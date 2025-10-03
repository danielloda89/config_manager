import json 
from pathlib import Path
from typing import List,Dict
import aiofiles
# Path to this file (jsonwork.py)


class Handler():
    def __init__(self):
        BASE_DIR = Path(__file__).resolve().parents[2]  # goes up to GLEG/
        config_path = BASE_DIR / "storage" / "config.json"
        self.file = config_path


    async def get_data(self):
        async with aiofiles.open(self.file,'r') as file:
            content = await file.read()
            result = json.loads(content)
            print(type(result))
            print(type(result["inbounds"][0]["settings"]["clients"]))
        return result

    async def post_data(self,data_to_post):
        async with aiofiles.open(self.file,'w') as file:
            handled_data = json.dumps(data_to_post,indent=2)
            await file.write(handled_data)

    async def add(self,data_to_add:Dict):
        datas = [{'id': 'test_id', 'flow': 'test_flow', 'email': 'test_email'}, {'id': '2fe4a0d9-84ad-4549-b06f-89d69dd36490', 'flow': 'xtls-rprx-vision', 'email': 'Dan'}] 
        data = await self.get_data()
        data["inbounds"][0]["settings"]["clients"].append(data_to_add)
        await self.post_data(data)


    async def delete(self,delete_id):
        data = await self.get_data()
        for i,item in enumerate(data["inbounds"][0]["settings"]["clients"]):
            if item["id"] == delete_id:
                del data["inbounds"][0]["settings"]["clients"][i]
        await self.post_data(data)


    async def update(self,id_on_update,data_to_update:Dict):
        data = await self.get_data()
        print("-------------------------")
        for i,item in enumerate(data["inbounds"][0]["settings"]["clients"]):
            print("---------------------------",i)
            if item["id"] == id_on_update: 
                print("entered if statement")
                data["inbounds"][0]["settings"]["clients"][i]= {**item,**data_to_update}
                print(data["inbounds"][0]["settings"]["clients"])
        await self.post_data(data)
                
        







"""async def main():
    new_obj = Handler()
    x = await new_obj.get_data()
    x_new = x["inbounds"][0]["settings"]["clients"]
    test_input_for_update = {"id":"updated id","flow":"updated flow","email":"updated email"}
    print(x)
    print(x_new)
    print(test_input_for_update)
    print("data_to_update type:", type(test_input_for_update))
    print("data_to_update contents:", test_input_for_update)
    print("data_to_update keys:", test_input_for_update.keys())
    #await new_obj.add({'id': 'test_id', 'flow': 'test_flow', 'email': 'test_email'})
    #await new_obj.delete(delete_id="test")
    await new_obj.update("test_id",test_input_for_update)

asyncio.run(main())"""



class Orhectr():
    def __init__(self, payload : List):
        self.payload = payload
        self.handler = Handler()

    def __str__(self):
        return f"{[[element.operation,element.data["id"]] for element in self.payload]}"

    async def proccessing(self):
        for element in self.payload:
            print(element.target_id)
            if element.operation == 'a':
                print("-----------addition-------------\n",element.data)
                await self.handler.add(element.data)
            if element.operation == 'd':
                await self.handler.delete(element.data["id"])
            if element.operation == 'e':
                await self.handler.update(element.target_id,element.data)
