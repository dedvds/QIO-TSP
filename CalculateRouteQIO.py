import numpy as np
import time
import math
import json

from azure.quantum import Workspace
from azure.quantum.optimization import Problem, ProblemType, Term
from azure.quantum.optimization import SimulatedAnnealing, ParallelTempering, Tabu, QuantumMonteCarlo, HardwarePlatform, Solver

from fastapi import HTTPException
from models import SolverSetting

############################################################################################
##### Define the optimization problem for the Quantum Inspired Solver
def OptProblem(CostMatrix) -> Problem:
    terms = []

    ############################################################################################
    ##### Cost of traveling between nodes
    for t in range(0,len(CostMatrix)):
        for i in range(0,len(CostMatrix)):
            for j in range(0,len(CostMatrix)):   
                terms.append(
                    Term(
                        c = CostMatrix.item((i,j)) ,
                        indices = [i+(len(CostMatrix)*t), j+(len(CostMatrix)*(t+1))]   #plus one to denote dependence on next time step
                    )
                )
                #print(f'{i+(len(CostMatrix)*t)},{j+(len(CostMatrix)*(t+1))}')
                

    ############################################################################################
    ##### Constraint on allowing only one move per timestep
    for t in range(0,len(CostMatrix)+1):
        for i in range(0,len(CostMatrix)):
            for j in range(0,len(CostMatrix)): 
                if i!=j and i<j:    #i<j because we don't want to penalize twice // i==j is forbidden (above)
                    terms.append(
                        Term(
                            c = int(2*np.max(CostMatrix)), 
                            indices = [i+(len(CostMatrix)*t),j+(len(CostMatrix)*t)]  
                        )
                    )
                    #print(f'{i+(len(CostMatrix)*t)},{j+(len(CostMatrix)*(t))}')

    
    ############################################################################################                        
    ##### Penalty for traveling to a same node again --- (in the last step we may travel back)
    for node_now in range(0,len(CostMatrix)+len(CostMatrix)*(len(CostMatrix))):
        for same_node_future in range(node_now+len(CostMatrix),len(CostMatrix)*(len(CostMatrix)),len(CostMatrix)):
            terms.append(
                Term(
                    c =int(2*np.max(CostMatrix)),
                    indices = [node_now,same_node_future]   
                )
            )     
            #print(f'{node_now},{same_node_future}')


    ############################################################################################    
    ##### Promote travel in every move
    for variable in range(0,len(CostMatrix)+len(CostMatrix)*(len(CostMatrix))):    
        terms.append(
            Term(
                c = int(-1.65*np.max(CostMatrix)),
                indices = [variable]   
            )
        )
        #print(variable)

    #############################################################################################                        
    ##### Begin at x0
    terms.append(
        Term(
            c = int(-10*np.max(CostMatrix)),
            indices = [0]   
        )
    )
    
    ############################################################################################                        
    ##### End at x0
    terms.append(
        Term(
            c = int(-10*np.max(CostMatrix)),
            indices = [len(CostMatrix)*(len(CostMatrix))]   
        )    
    )
    
    # Return problem instance
    return Problem(name="Traveling Salesman", problem_type=ProblemType.pubo, terms=terms)

############################################################################################
##### Read the results returned by the solver - need to make the solution readable
def ReadResults(Config: dict, NodeName, CostMatrix):  

    NumNodes = len(NodeName)

    #############################################################################################
    ##### Read the return result (dictionary) from the solver and sort it
    PathChoice = Config.items()
    PathChoice = [(int(k), v) for k, v in Config.items()] 
    PathChoice.sort(key=lambda tup: tup[0]) 

    #############################################################################################
    ##### Initialize variables to understand the routing    
    TimeStep=[]                                                     # This will contain an array of times - each node is represented during/for each time interval
    Node = []                                                       # This will contain an array of node names 
    Location = []                                                   # This will contain the locations the salesman is for each timestep
    RouteMatrixElements = []                                        # This will contain the indices of the cost matrix representing where the salesman has traveled (to determine total cost)

    #############################################################################################
    ##### Go through nodes during each timestep/trip to see where the salesman has been
    for Index in PathChoice:
        TimeStep.append(math.floor(Index[0]/len(CostMatrix)))       # Time step/ the k-th is floor of the index diveded by the number of nodes
        Node.append(NodeName[str(Index[0]%len(CostMatrix))])        # Append node names for each time step
        Location.append(Index[1])                                   # Append locations for each time step
        if Index[1] == 1:                                           # Save selected node where the salesman travels to in that trip (if the variable == 1, the salesman goes to that node)
            RouteMatrixElements.append(Index[0]%len(CostMatrix))    # Save the indices (this returns the row index)
    SimulationResult = np.array([TimeStep,Node,Location])           # Save all the route data (also where the salesman did not go during a turn/trip/timestep)
         
    #############################################################################################
    ##### Create the route dictionary 
    k=0                                                                                                             
    PathDict = {}                                                                                                                                              
    PathDict['Route'] = {}
    Path = np.array([['Timestep,','Node']])
    for i in range(0,(NumNodes*(NumNodes+1))):
        if SimulationResult[2][i] == '1':                                                                                   # If the SimulationResult[2][i] (location) == 1, then thats where the salesman goes/went
            Path = np.concatenate((Path, np.array([[SimulationResult[j][i] for j in range(0,2)]])),axis=0)                  # Add the rows where the salesman DOES travel to Path matrix
            PathDict['Route'].update({k:Path[k+1][1]})                                                                      # Save the route to a dictionary
            k+=1                                                                                                            # Iterable keeps track for the dictionary, but also allows to check for constraint

    #############################################################################################
    ##### Contraint checks -- need to verify the solution before we process it/send it back 
    if k != NumNodes+1:  
        raise HTTPException(status_code=400, detail=f"Invalid solution - Number of nodes visited invalid:\n k={k} \n {Path}")
    AnalyzeResult(Path)                                                                                                     # Check if Path array satisifies other constraints as well (could integrate previous one above in function)

    #############################################################################################
    ###### Calculate the total cost of the route the salesman made (can be in time (minutes) or in distance (km))
    TotalRouteCost = 0
    for trips in range(0,NumNodes):
        TotalRouteCost = TotalRouteCost+float(CostMatrix.item(RouteMatrixElements[trips],RouteMatrixElements[trips+1]))     # The sum of the matrix elements where the salesman has been (determined through the indices)
    PathDict['RouteCost'] = {'Cost':TotalRouteCost}

    ##### Return the simulation result in a human understandable way =)
    return PathDict

############################################################################################
##### Check whether the solution satisfies the optimization constraints 
def AnalyzeResult(Path):

    NumNodes = len(Path)-2                                                                                                              #If no error raised, then we know that the number of nodes is equal to the length of Path minus the header and last node

    ############################################################################################                        
    ##### Check if the number of travels is equal to the number of nodes +1 (for returning home)
    if (len(Path)-1) != NumNodes+1:
        print(Path)
        raise HTTPException(status_code=400, detail=f'This solution is not correct -- Number of nodes visited invalid:\n {Path}!')
        raise RuntimeError(f'This solution is not correct -- Number of nodes visited invalid:\n {Path}!')
    else:
        NumNodesPassed = NumNodes
        print(f"Number of nodes passed: {NumNodesPassed}")

    ############################################################################################                        
    ##### Check if the nodes are different (except start/end node)
    PastNodes = []
    for k in range(1,len(Path)-1):                                                                                                      # Start to second last node must all be different - skip header so start at 1, skip last node so -1
        for l in range(0, len(PastNodes)):  
            if Path[k][1] == PastNodes[l]:
                raise HTTPException(status_code=400, detail='Invalid solution -  Traveled to a non-starting node more than once.')
                raise RuntimeError('This solution is not correct -- Traveled to a non-starting node more than once')
        PastNodes.append(Path[k][1])
        

    ############################################################################################                        
    ##### Check if the end nodes is same as the start node
    if Path[1][1] != Path[-1][1]:
        raise HTTPException(status_code=400, detail=' Start node not equal to end node.')
        raise RuntimeError(f'This solution is not correct -- Start node {Path[1][1]} is not equal to end node {Path[-1][1]}')
    
############################################################################################
##### Submit the optimization problem to the QIO with the user specified input/request
def CalculateRoute(CostMatrix, solverSetting: SolverSetting, workspace):

    ##### Initialize solver specificationss -- In all cases we do parameter-free solving because we don't want to do manual tuning
    SolverName = solverSetting.SolverName   # Name of the solver
    HardwareSpec = solverSetting.Hardware   # The hardware, CPU or FPGA
    Timeout =  solverSetting.Timeout        # The timeout for the solver, in seconds

    ##### Raise errors if invalid request - Some solvers require specific user inputs
    if (SolverName.lower() == 'quantum monte carlo'):
        raise HTTPException(status_code=400, detail='Can only implement a Quantum Monte Carlo with paramtrization (manual tuning). It has been disabled for this demo. Check the QIO docs.')

    if (SolverName.lower() == 'tabu search' or SolverName.lower() == 'quantum monte carlo' or SolverName.lower() == 'parallel tempering') and (HardwareSpec.lower() == 'fpga'):
        raise HTTPException(status_code=400, detail='Can only implement Tabu search, Quantum Monte Carlo, Parallel Tempering on CPU. Check the QIO docs.')
        
    ##### The type of hardware the solver will run on
    if HardwareSpec.lower() == 'cpu':
        HardwareInt = 1
    elif HardwareSpec.lower() == 'fpga':
        HardwareInt = 2
    else:
        raise HTTPException(status_code=400, detail='Hardware choice not valid - choose from CPU/FPGA')

    ##### The solver algorithm initialized
    if SolverName.lower() == 'simulated annealing':
        solver = SimulatedAnnealing(workspace, timeout = Timeout, platform= HardwareInt)
    elif SolverName.lower() == 'parallel tempering':
        solver = ParallelTempering(workspace, timeout = Timeout)
    elif SolverName.lower() == 'tabu search':
        solver = Tabu(workspace, timeout = Timeout)
    elif SolverName.lower() == 'quantum monte carlo':
        solver = QuantumMonteCarlo(workspace, timeout = Timeout)

    ##### Submit the optimization problem to the QIO workspace
    OptimizationProblem = OptProblem(CostMatrix)                # Initialize the optimization problem instance
    result = solver.submit(OptimizationProblem)                 # We submit because we want to track the status of the optimization - means we do not immediately have a solution, will need to fetch it later

    ##### Return the optimization result
    return result

############################################################################################
#####Check whether the solver finished -- process the returned status/solution
def GetJobStatus(id:str, workspace:Workspace):

    ##### Fetch the optimization task with its ids
    QIOJobId = id.split(',')[0]
    jsonId = id.split(',')[1]
    job = workspace.get_job(QIOJobId)

    ##### Process the job status 
    if job.has_completed() == False or job.details.status == 'Cancelled':
        return {'completed': False, 'status':job.details.status, 'results':None}                                        # Send back that the solver is not done yet
    else:   
        result = job.get_results()  
        with open(f"RequestData/{jsonId}.json") as f:           
            jsonObj = json.load(f)                                                                                      # This json file contains the NodeNames
        CostMatrix = np.array(json.loads(jsonObj["CostMatrix"]))                                                        # load the cost matrix 
        PathDict = ReadResults(result['configuration'], jsonObj['locations'],CostMatrix)                                # read the results of the returned solution
        if jsonObj['optimize'].lower() == 'time':                                                                       # save solution to PathDict, specifying the units optimized for
            PathDict['RouteCost'].update({'Unit':'minutes'})                                                            # save solution to PathDict, specifying the units optimized for
        elif jsonObj['optimize'].lower() == 'distance':                                                                 # save solution to PathDict, specifying the units optimized for
            PathDict['RouteCost'].update({'Unit':'kilometers'})                                                         # save solution to PathDict, specifying the units optimized for
        else:
            raise HTTPException(status_code=400, detail='You can only optimize for distance or time') 

        return {'completed': True, 'results':PathDict}                                                                  # send back that the solver finished, and send the solution with it