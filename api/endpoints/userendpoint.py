from fastapi import APIRouter
#from ..modles.userscheme import CreateUser,ResponseUser
from ..core.usercreation import Users

user_router = APIRouter()

#@user_router.get("/create_user",response_model=ResponseUser)
#async def create_user(payload:CreateUser):
 #   return payload