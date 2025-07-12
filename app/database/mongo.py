from motor.motor_asyncio import AsyncIOMotorClient
from ..config import settings

class Database:
    def __init__(self):
        self.client = None
        self.database = None

db = Database()

async def connect_to_mongo():
    """Create database connection."""
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)  # type: ignore
    if db.client:
        db.database = db.client[settings.DATABASE_NAME]  # type: ignore
    print("Connected to MongoDB.")

async def close_mongo_connection():
    """Close database connection."""
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB.")

def get_collection(collection_name: str):  # type: ignore
    """Get a collection from the database."""
    if db.database is None:
        raise RuntimeError("Database not connected")
    return db.database[collection_name]



