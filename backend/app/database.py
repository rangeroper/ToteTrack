import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()  # Load env vars from .env

MONGO_URL = os.getenv("MONGO_URL")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client.inventory_management  # Choose your DB name here
