from fastapi import APIRouter,Depends, Request,Form
from fastapi.responses import HTMLResponse
from api.core.jsonwork import Handler, Orhectr
#from api.core.json_orchestr import Orhectr
from api.models.configscheme import Config,ConfigItem,ReturnedConfig
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from api.security.config import security
from typing import List

from pydantic import BaseModel

config_router = APIRouter()
#config_router.mount("/static", StaticFiles(directory="templates"), name="static")
templates = Jinja2Templates(directory="templates")

@config_router.get("/config",response_class=HTMLResponse,dependencies=[Depends(security.access_token_required)])
async def conf(request:Request):
    datas = Handler()
    data =  await datas.get_data()
    dates = Config(clients=data["inbounds"][0]["settings"]["clients"])
    #print(dates)
    #print(data["clients"])
    return templates.TemplateResponse(name="config.html",context={"request":request,"clients":dates.model_dump()})
    #nya ubu danyukvu sinovo sinovo <3


@config_router.get("/iron",response_class=HTMLResponse)
async def iron_man(request:Request):
    return templates.TemplateResponse(name="far.html",context={"request":request})


@config_router.post("/post_config")
async def post_config(payload:List[ReturnedConfig]):
    print(payload)
    new_orchestr = Orhectr(payload)
    #print(new_orchestr)
    await new_orchestr.proccessing()
    data = {"success":True}
    return  data


@config_router.get("/templates",response_class=HTMLResponse)
async def page(request: Request):
    return templates.TemplateResponse(name="index.html",context={"request":request,})

