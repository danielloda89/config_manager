import os
from dotenv import load_dotenv
load_dotenv()
class Users:
    
    def __init__(self,):
        self.username = os.getenv('USER_NAME')
        self.password = os.getenv('USER_PASS')
        self.uid = "321341"

    def __str__(self):
        return f"{self.username},{self.password}"
    

userobject = Users()




            
