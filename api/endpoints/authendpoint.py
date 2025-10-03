from fastapi import APIRouter
from fastapi.responses import JSONResponse
from api.models.userscheme import UserLogin
#from ..modles.userscheme import CreateUser,ResponseUser

from api.security.config import config,security

from api.core.usercreation import userobject

auth_router = APIRouter()

#@user_router.get("/create_user",response_model=ResponseUser)
#async def create_user(payload:CreateUser):
 #   return payload

@auth_router.post("/login")
async def login(user: UserLogin):
    #print(user.uname,user.upass)
    if user.uname == userobject.username  and user.upass == userobject.password:
        token = security.create_access_token(uid=userobject.uid)
       
        responce = JSONResponse(
            {
                "success":True,
                "redirect":"/config"
            }
        )
        responce.set_cookie(config.JWT_ACCESS_COOKIE_NAME,token)
        print(responce)
        return responce
    else:
        return JSONResponse(content={"error": "Invalid username or password"}, status_code=401)

