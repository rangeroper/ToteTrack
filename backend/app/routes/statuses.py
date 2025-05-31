from fastapi import APIRouter, HTTPException
from app.models import StatusCreate, StatusUpdate  # create these in your models
from app.database import db
from datetime import datetime
from bson import ObjectId

router = APIRouter()
statuses_collection = db["statuses"]
totes_collection = db["totes"]

def serialize_status(status):
    status["id"] = str(status["_id"])
    del status["_id"]
    for field in ("created_at", "updated_at"):
        if field in status and isinstance(status[field], datetime):
            status[field] = status[field].isoformat()
    return status

@router.post("/", status_code=201)
async def create_status(status_create: StatusCreate):
    existing = await statuses_collection.find_one({"name": status_create.name})
    if existing:
        raise HTTPException(status_code=400, detail="Status with this name already exists")

    now = datetime.utcnow()
    status_data = status_create.dict()
    status_data.update(created_at=now, updated_at=now)

    result = await statuses_collection.insert_one(status_data)
    new_status = await statuses_collection.find_one({"_id": result.inserted_id})
    return {"message": "Status created", "status": serialize_status(new_status)}


@router.get("/")
async def list_statuses():
    statuses = []
    async for doc in statuses_collection.find({}):
        statuses.append(serialize_status(doc))
    return {"statuses": statuses}

@router.get("/{status_id}/affected-count")
async def get_affected_count(status_id: str):
    status_obj_id = ObjectId(status_id)
    status = await statuses_collection.find_one({"_id": status_obj_id})
    if not status:
        raise HTTPException(status_code=404, detail="Status not found")

    count = await totes_collection.count_documents({"status": status["name"]})
    return {"affected_count": count}


@router.patch("/{status_id}")
async def rename_status(status_id: str, status_update: StatusUpdate):
    status_obj_id = ObjectId(status_id)
    status = await statuses_collection.find_one({"_id": status_obj_id})
    if not status:
        raise HTTPException(status_code=404, detail="Status not found")

    if await statuses_collection.find_one({"name": status_update.name, "_id": {"$ne": status_obj_id}}):
        raise HTTPException(status_code=400, detail="Another status with this name already exists")

    now = datetime.utcnow()
    update_data = {"name": status_update.name, "updated_at": now}

    await statuses_collection.update_one({"_id": status_obj_id}, {"$set": update_data})

    old_name = status["name"]
    await totes_collection.update_many(
        {"status": old_name},
        {"$set": {"updated_at": now, "status": status_update.name}},
    )

    updated_status = await statuses_collection.find_one({"_id": status_obj_id})
    return {"message": "Status renamed and totes updated", "status": serialize_status(updated_status)}


@router.delete("/{status_id}")
async def delete_status(status_id: str):
    status_obj_id = ObjectId(status_id)
    status = await statuses_collection.find_one({"_id": status_obj_id})
    if not status:
        raise HTTPException(status_code=404, detail="Status not found")

    result = await statuses_collection.delete_one({"_id": status_obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=500, detail="Failed to delete status")

    # Remove this status from totes by unsetting the field
    await totes_collection.update_many(
        {"status": status["name"]},
        {"$unset": {"status": ""}, "$set": {"updated_at": datetime.utcnow()}}
    )

    return {"message": "Status deleted and removed from totes"}
