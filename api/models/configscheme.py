from pydantic import BaseModel
from typing import List,Dict


class ConfigItem(BaseModel):
    id:str
    flow:str
    email:str


class Config(BaseModel):
    clients: List [ConfigItem]





class ReturnedConfig(BaseModel):
    operation: str
    data: Dict


