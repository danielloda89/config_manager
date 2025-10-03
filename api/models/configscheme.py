from pydantic import BaseModel
from typing import List,Dict,Optional


class ConfigItem(BaseModel):
    id:str
    flow:str
    email:str


class Config(BaseModel):
    clients: List [ConfigItem]


class ReturnedConfig(BaseModel):
    operation: str
    data: Dict
    target_id: Optional[str] = None
    


