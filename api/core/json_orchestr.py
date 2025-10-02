from jsonwork import Handler
from typing import List
class Orhectr():
    def __init__(self, payload : List):
        self.payload = payload
        self.handler = Handler()

    def __str__(self):
        return f"{[[element.operation,element.data["id"]] for element in self.payload]}"

    async def proccessing(self):
        for element in self.payload:
            if element.operation == 'a':
                print("-----------addition-------------\n",element.data)
                await self.handler.add(element.data)
            if element.operation == 'd':
                await self.handler.delete(element.data["id"])
            if element.operation == 'e':
                await self.handler.update(element.data["id"],element.data)


