from fastapi import FastAPI,Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles


from api.endpoints.configendpoint import config_router
from api.endpoints.authendpoint import auth_router


from authx.exceptions import  MissingTokenError, JWTDecodeError


app = FastAPI()
app.include_router(router=auth_router)
app.include_router(router=config_router)
app.mount("/static", StaticFiles(directory="static"), name="static")

favicon_path = 'static/herta.png'

templates = Jinja2Templates(directory="templates")


@app.get("/")
async def main_page(request:Request):
    return templates.TemplateResponse("index.html",context={"request":request})
    

@app.exception_handler(MissingTokenError)
async def login_error(request:Request,exc:MissingTokenError):
    return RedirectResponse(url="/")


@app.exception_handler(JWTDecodeError)
async def token_error(request:Request,excep: JWTDecodeError):
    return templates.TemplateResponse("session_expired.html",context={"request":request})
