import asyncio
import uvicorn
from fastapi.testclient import TestClient
from app.main import app

def test_api():
    """Test the API endpoints"""
    client = TestClient(app)
    
    # Test root endpoint
    response = client.get("/")
    print(f"Root endpoint: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test health endpoint
    response = client.get("/health")
    print(f"Health endpoint: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test users endpoint (should return empty list)
    response = client.get("/users/")
    print(f"Users endpoint: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_api() 