from pydantic import BaseModel



class CreateUser(BaseModel):
    user_name:str
    user_password:str
    date:str


class UserLogin(BaseModel):
    uname:str
    upass:str


class User(BaseModel):
    user_name:str


class ResponseUser(BaseModel):
    user_name:str
