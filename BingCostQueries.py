import requests
import json
import time
import datetime  
import numpy as np

from json import JSONEncoder
from fastapi import HTTPException
from requests.exceptions import HTTPError
from models import *
from typing import Optional, List

############################################################################################
##### Define the class to encode cost matrix
class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)

############################################################################################
##### The function to request the distance matrix from the Bing distance matrix API
def BingRequestCostMatrix(solverRequest: SolverRequest, BingMapsAPIKey, jobUUID):

    ##### Raise errors if the user input is invalid. Bing API can handle at most 50 nodes (2500 matrix elements)
    NumNodes = len(solverRequest.locations)
    if NumNodes < 2:
        raise HTTPException(status_code=404, detail="Specify at least two locations")    
        raise RuntimeError('Specify at least two locations')
    elif NumNodes>50: 
        raise HTTPException(status_code=404, detail="Bing Distance API can currently not handle more than 50 nodes - MS Bing Docs")    
        raise RuntimeError('Bing Distance API can currently not handle more than 50 nodes - MS Bing Docs')
    
    ##### Initialize variables to call Bing API and to save its response
    Locations = {}                  # Will contain the locations/ node names
    LocCoordinatesList = []         # Will contain the coordinates of the locations
    LocationsString = ''            # Will contain the search string for the Bing distance API - it contains the coordinates of the locations

    ##### We create a query string based on te coordinates given to us by the web request
    k = 0
    for l in range(0,NumNodes):
        LocCoordinatesList.append(solverRequest.locations[l].coordinates)                                                                                                   # Add coordinates 
        LocationsString = LocationsString+f"{round(solverRequest.locations[l].coordinates['lat'],5)}"+','+f"{round(solverRequest.locations[l].coordinates['lon'],5)}"       # Create/add to the coordinate string for the Bing distance API
        Locations[l] = solverRequest.locations[l].name                                                                                                                      # Add name to the locations variable
        if l != NumNodes-1:
                LocationsString = LocationsString+';'


    ##### Save the variables in a dictionary to be accessed later on - this will contain info about the specific optimization task
    CostReqDict = {}
    CostReqDict["locations"] = Locations
    CostReqDict["origins"] = LocCoordinatesList
    CostReqDict["destinations"] = LocCoordinatesList           
    CostReqDict["travelMode"] = solverRequest.BingSettings.travelMode.lower()       # has to be Driving, Walking, or Transit 
    CostReqDict["optimize"] = solverRequest.BingSettings.optimize.lower()           # optimize either time or distance 
    CostReqDict["timeUnit"] = 'minute'                                              # hard-coded, such that when times are specified, we get min
    CostReqDict["distanceUnit"] = 'km'                                              # hard-coded, such that when distances are specified, we get km
    CostReqDict["maxSolutions"] = 1                                                 # Only want one route returned to us after requesting bing    
    
    ##### Call the Bing API with the coordinate string of the locations and manage error-handling
    try:
        BingTravResponse = requests.get(f"https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins={LocationsString}&destinations={LocationsString}&travelMode={CostReqDict['travelMode']}&key={BingMapsAPIKey}")
        BingTravResponse.raise_for_status()
        jsonTravResponse = BingTravResponse.json() 
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

    ##### We initialize the cost matrix in which we will save the distances between the nodes 
    CostMatrix = np.zeros(NumNodes*NumNodes).reshape(NumNodes,NumNodes)
    for i in range(0,len(jsonTravResponse['resourceSets'][0]['resources'][0]['results'])): 
        origIndex = jsonTravResponse['resourceSets'][0]['resources'][0]['results'][i]['originIndex']        # origin index
        destIndex = jsonTravResponse['resourceSets'][0]['resources'][0]['results'][i]['destinationIndex']   # destination index
        travelDur = jsonTravResponse['resourceSets'][0]['resources'][0]['results'][i]['travelDuration']     # minutes
        travelDis = jsonTravResponse['resourceSets'][0]['resources'][0]['results'][i]['travelDistance']     # kilometers

        ##### Assign the specific cost type (user-specified) to the index pair: (origin, destination)
        if CostReqDict["optimize"].lower() == 'distance':                                                   # if the user wants to optimize for distance
            CostMatrix[origIndex,destIndex] = round(travelDis,1)
        elif CostReqDict["optimize"].lower() == 'time':                                                     # if the user wants to optimize for time 
            CostMatrix[origIndex,destIndex] = round(travelDur,1)
        else:
            raise HTTPException(status_code=404, detail='Can only optimize for distance or time. Please refer to the Bing Distance API.')
            raise RuntimeError('Can only optimize for distance or time. Please refer to the Bing Distance API.')

    ##### We add the cost matrix to the dictionary to export it and refer to it later
    CostReqDict["CostMatrix"] = json.dumps(CostMatrix, cls=NumpyArrayEncoder)   # convert Costmatrix to JSON https://pynative.com/python-serialize-numpy-ndarray-into-json/

    ##### Save the requestdata to a json file so that we can access it later
    with open(f"RequestData/{jobUUID}.json",'w') as file:
        json.dump(CostReqDict,file)

    ##### Return the cost matrix
    return CostMatrix








