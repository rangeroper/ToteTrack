from fastapi import APIRouter, HTTPException
from app.models import Tote, ToteUpdate, TagCreate, TagUpdate
from app.database import db
from datetime import datetime
from io import BytesIO
import qrcode
import base64
from bson import ObjectId

router = APIRouter()
tags_collection = db["tags"]
totes_collection = db["totes"]

def serialize_tag(tag):
    tag["id"] = str(tag["_id"])
    del tag["_id"]
    for field in ("created_at", "updated_at"):
        if field in tag and isinstance(tag[field], datetime):
            tag[field] = tag[field].isoformat()
    return tag

@router.post("/", status_code=201)
async def create_tag(tag_create: TagCreate):
    # Ensure unique tag names
    existing = await tags_collection.find_one({"name": tag_create.name})
    if existing:
        raise HTTPException(status_code=400, detail="Tag with this name already exists")

    now = datetime.utcnow()
    tag_data = tag_create.dict()
    tag_data.update(created_at=now, updated_at=now)

    result = await tags_collection.insert_one(tag_data)
    new_tag = await tags_collection.find_one({"_id": result.inserted_id})
    return {"message": "Tag created", "tag": serialize_tag(new_tag)}


@router.get("/")
async def list_tags():
    tags = []
    async for doc in tags_collection.find({}):
        tags.append(serialize_tag(doc))
    return {"tags": tags}


@router.patch("/{tag_id}")
async def rename_tag(tag_id: str, tag_update: TagUpdate):
    # Validate tag exists
    tag_obj_id = ObjectId(tag_id)
    tag = await tags_collection.find_one({"_id": tag_obj_id})
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    # Check if new name already exists
    if await tags_collection.find_one({"name": tag_update.name, "_id": {"$ne": tag_obj_id}}):
        raise HTTPException(status_code=400, detail="Another tag with this name already exists")

    now = datetime.utcnow()
    update_data = {"name": tag_update.name, "updated_at": now}

    # Update the tag name
    await tags_collection.update_one({"_id": tag_obj_id}, {"$set": update_data})

    # Update all totes that have the old tag name in their tags list
    old_name = tag["name"]
    await totes_collection.update_many(
        {"tags": old_name},
        {"$set": {"updated_at": now}, "$addToSet": {"tags": tag_update.name}},
    )
    # Remove the old tag name from totes
    await totes_collection.update_many(
        {"tags": old_name},
        {"$pull": {"tags": old_name}},
    )

    updated_tag = await tags_collection.find_one({"_id": tag_obj_id})
    return {"message": "Tag renamed and totes updated", "tag": serialize_tag(updated_tag)}


@router.delete("/{tag_id}")
async def delete_tag(tag_id: str):
    tag_obj_id = ObjectId(tag_id)
    tag = await tags_collection.find_one({"_id": tag_obj_id})
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    # Delete the tag document
    result = await tags_collection.delete_one({"_id": tag_obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=500, detail="Failed to delete tag")

    # Remove this tag from all totes
    await totes_collection.update_many(
        {"tags": tag["name"]},
        {"$pull": {"tags": tag["name"]}, "$set": {"updated_at": datetime.utcnow()}}
    )

    return {"message": "Tag deleted and removed from totes"}
