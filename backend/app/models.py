from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime



class Tote(BaseModel):
    id: Optional[str] = None 
    barcode: str
    description: str
    location: Optional[List[str]]  = []
    status: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    weight: Optional[float] = None
    qr_url: Optional[str] = None
    qr_image: Optional[str] = None 
    images: Optional[List[str]] = [] 
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ToteCreate(BaseModel):
    barcode: str
    description: str
    location: Optional[List[str]]  = []
    status: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    weight: Optional[float] = None
    images: Optional[List[str]] = []

    @validator('weight', pre=True)
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v

class ToteUpdate(BaseModel):
    barcode: Optional[str] = None
    description: Optional[str] = None
    location: Optional[List[str]]  = []
    status: Optional[List[str]]
    tags: Optional[List[str]] = []
    weight: Optional[float] = None
    images: Optional[List[str]] = None

class Tag(BaseModel):
    id: Optional[str] = None
    name: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class TagCreate(BaseModel):
    name: str

class TagUpdate(BaseModel):
    name: str

class Location(BaseModel):
    id: Optional[str] = None
    name: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class LocationCreate(BaseModel):
    name: str

class LocationUpdate(BaseModel):
    name: str

class Status(BaseModel):
    id: Optional[str] = None
    name: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class StatusCreate(BaseModel):
    name: str

class StatusUpdate(BaseModel):
    name: str
