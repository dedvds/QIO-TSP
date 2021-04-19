from typing import Optional, List
from pydantic import BaseModel

class Coordinates(BaseModel):
    lat: float
    lon: float

class Location(BaseModel):
    name: str
    coordinates: Coordinates

    def __init__(self, **response):
         for k,v in response.items():
            self.__dict__[k] = v

class BingSetting(BaseModel):
    optimize: Optional[str] = "distance"
    travelMode: Optional[str] = "driving"

class SolverSetting(BaseModel):
    Hardware: Optional[str] = "cpu"
    SolverName: Optional[str] = "Parallel tempering"
    Timeout: Optional[int] = 300

class SolverRequest(BaseModel):
    solver:SolverSetting
    locations:List[Location]
    BingSettings: BingSetting
    password: Optional[str] = None