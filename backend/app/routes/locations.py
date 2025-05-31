from fastapi import APIRouter, HTTPException
from app.models import LocationCreate, LocationUpdate  # you'll need to create these Pydantic models
from app.database import db
from datetime import datetime
from bson import ObjectId

router = APIRouter()
locations_collection = db["locations"]
totes_collection = db["totes"]

def serialize_location(location):
    location["id"] = str(location["_id"])
    del location["_id"]
    for field in ("created_at", "updated_at"):
        if field in location and isinstance(location[field], datetime):
            location[field] = location[field].isoformat()
    return location

@router.post("/", status_code=201)
async def create_location(location_create: LocationCreate):
    existing = await locations_collection.find_one({"name": location_create.name})
    if existing:
        raise HTTPException(status_code=400, detail="Location with this name already exists")

    now = datetime.utcnow()
    location_data = location_create.dict()
    location_data.update(created_at=now, updated_at=now)

    result = await locations_collection.insert_one(location_data)
    new_location = await locations_collection.find_one({"_id": result.inserted_id})
    return {"message": "Location created", "location": serialize_location(new_location)}


@router.get("/")
async def list_locations():
    locations = []
    async for doc in locations_collection.find({}):
        locations.append(serialize_location(doc))
    return {"locations": locations}

@router.get("/{location_id}/affected-count")
async def get_affected_count(location_id: str):
    location_obj_id = ObjectId(location_id)
    location = await locations_collection.find_one({"_id": location_obj_id})
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    count = await totes_collection.count_documents({"location": location["name"]})
    return {"affected_count": count}


@router.patch("/{location_id}")
async def rename_location(location_id: str, location_update: LocationUpdate):
    location_obj_id = ObjectId(location_id)
    location = await locations_collection.find_one({"_id": location_obj_id})
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    if await locations_collection.find_one({"name": location_update.name, "_id": {"$ne": location_obj_id}}):
        raise HTTPException(status_code=400, detail="Another location with this name already exists")

    now = datetime.utcnow()
    update_data = {"name": location_update.name, "updated_at": now}

    await locations_collection.update_one({"_id": location_obj_id}, {"$set": update_data})

    old_name = location["name"]
    await totes_collection.update_many(
        {"location": old_name},
        {"$set": {"updated_at": now, "location": location_update.name}},
    )

    updated_location = await locations_collection.find_one({"_id": location_obj_id})
    return {"message": "Location renamed and totes updated", "location": serialize_location(updated_location)}


@router.delete("/{location_id}")
async def delete_location(location_id: str):
    location_obj_id = ObjectId(location_id)
    location = await locations_collection.find_one({"_id": location_obj_id})
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    result = await locations_collection.delete_one({"_id": location_obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=500, detail="Failed to delete location")

    # Remove this location from totes by unsetting the location field or setting it to None/empty string
    await totes_collection.update_many(
        {"location": location["name"]},
        {"$unset": {"location": ""}, "$set": {"updated_at": datetime.utcnow()}}
    )

    return {"message": "Location deleted and removed from totes"}
