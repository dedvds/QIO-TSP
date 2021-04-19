import json
import uuid
import numpy as np

import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from pydantic import BaseModel


# import python function files
from BingCostQueries import BingRequestCostMatrix
from CalculateRouteQIO import *
from FetchSPandKey import *
from models import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.mount("/public", StaticFiles(directory="public"), name="public")

@app.get('/')
def serve_root():
    return FileResponse('./public/index.html')


@app.post("/api/v1/solve")
# optimize for request - nodes to find a route for (see ExampleRequest.json)
def SolveTravelingSalesman(solverRequest: SolverRequest):
    test = os.environ.get('password') 
    if(os.environ.get('password') != '' and os.environ.get('password') != solverRequest.password):           #check if the password is correct
        raise HTTPException(status_code=403, detail='Password is not correct')

    jobUUID = uuid.uuid4()                                              # use this to save and fetch request options
    workspace = SPLogin()                                               # login into the quantum workspace
    BingMapsAPIKey = FetchBingMapsKey()                                 # fetch bing maps key
    # print(solverRequest)
    CostMatrix = BingRequestCostMatrix(solverRequest, BingMapsAPIKey, jobUUID)  # determine cost matrix
    BingMapsAPIKey = ''                                                 # delete key as it is not needed anymore
    job = CalculateRoute(CostMatrix, solverRequest.solver , workspace)   # use QIO solver to find route
    # delete workspace variable as it is not needed anymore
    workspace = None

    # return json string of the solution - the route through the network (see ExampleOutput.json)
    return {"jobid":f"{job.id},{jobUUID}"}

@app.get('/api/v1/status')
def getJobStatus(id:str):
    workspace = SPLogin()
    result = GetJobStatus(id, workspace)

    return result