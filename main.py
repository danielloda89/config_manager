from fastapi import FastAPI,Depends,Request, Response, HTTPException
from fastapi.responses import RedirectResponse,HTMLResponse,JSONResponse,FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from api.core.jsonwork import Handler
from api.core.usercreation import userobject

from api.models.configscheme import ConfigItem,Config
from api.models.userscheme import UserLogin

from api.endpoints.configendpoint import config_router

from api.security.config import config,security

app = FastAPI()
app.include_router(router=config_router)
app.mount("/static", StaticFiles(directory="static"), name="static")
#app.mount("/favicon.ico", StaticFiles(directory="static"), name="favicon")
favicon_path = 'static/herta.png'

templates = Jinja2Templates(directory="templates")


@app.get("/")
async def main_page(request:Request):
    return templates.TemplateResponse("index.html",context={"request":request})
    

@app.get("/favicon.ico",include_in_schema=False)
async def get_favicon(request:Request):
   
    return Response(status_code=204)


@app.get("/test")
async def test_route():
    return {"message": "Test route works!"}


@app.post("/login")
async def login(user: UserLogin):
    data = ["1","2"]
    print(user.uname,user.upass)
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
    

