from authx import AuthX,AuthXConfig

config = AuthXConfig(
    JWT_SECRET_KEY="KEY",
    JWT_ACCESS_COOKIE_NAME="ACCESS_TOKEN",
    JWT_TOKEN_LOCATION=["cookies"]
)


security = AuthX(config=config)
