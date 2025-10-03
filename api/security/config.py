from datetime import timedelta
from authx import AuthX,AuthXConfig
from authx.exceptions import NoAuthorizationError

config = AuthXConfig(
    JWT_SECRET_KEY="KEY",
    JWT_ACCESS_COOKIE_NAME="ACCESS_TOKEN",
    JWT_TOKEN_LOCATION=["cookies"],
    #JWT_ACCESS_TOKEN_EXPIRES=timedelta(minutes=1)
)


security = AuthX(config=config)

