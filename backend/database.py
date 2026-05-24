from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGODB_URI, MONGODB_DB

client = AsyncIOMotorClient(MONGODB_URI)
db = client[MONGODB_DB]
roasts = db['roasts']
