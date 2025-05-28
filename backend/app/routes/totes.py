from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Request
from typing import List, Optional
from app.models import Tote, ToteUpdate
from app.database import db
from datetime import datetime
from io import BytesIO
import qrcode
import base64
from bson import ObjectId, errors

router = APIRouter()

totes_collection = db["totes"]

def serialize_tote(tote):
    data = {**tote}  # shallow copy
    data["id"] = str(data["_id"])
    del data["_id"]

    for field in ("created_at", "updated_at"):
        if field in data and isinstance(data[field], datetime):
            data[field] = data[field].isoformat()
    return data


# Create Tote (no change)
@router.post("/", status_code=201)
async def create_tote(
    request: Request,
    barcode: str = Form(...),
    description: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    weight: Optional[float] = Form(None),
    images: List[UploadFile] = File([]),
):
    form = await request.form()
    tags = form.getlist("tags") or form.getlist("tags[]") or []

    tote_data = {
        "barcode": barcode,
        "description": description,
        "status": status,
        "location": location,
        "weight": weight,
        "tags": tags,
        "images": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    for image_file in images:
        contents = await image_file.read()
        encoded = base64.b64encode(contents).decode("utf-8")
        tote_data["images"].append(encoded)

    # Insert tote first to get the MongoDB ID
    result = await totes_collection.insert_one(tote_data)
    tote_id = str(result.inserted_id)

    # Generate QR code using the MongoDB ID
    qr_url = f"https://qr-storage.onrender.com/totes/{tote_id}"
    qr_img = qrcode.make(qr_url)
    buf = BytesIO()
    qr_img.save(buf, format="PNG")
    buf.seek(0)
    qr_image_b64 = base64.b64encode(buf.read()).decode()

    # Update the inserted tote with QR data
    await totes_collection.update_one(
        {"_id": result.inserted_id},
        {"$set": {"qr_url": qr_url, "qr_image": qr_image_b64}}
    )

    new_tote = await totes_collection.find_one({"_id": result.inserted_id})
    return {"message": "Tote created", "tote": serialize_tote(new_tote)}

# List totes (no change)
@router.get("/")
async def list_totes():
    totes = []
    async for doc in totes_collection.find({}):
        totes.append(serialize_tote(doc))
    return {"totes": totes}

# Get tote by _id
@router.get("/{id}")
async def get_tote(id: str):
    try:
        oid = ObjectId(id)
    except errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    tote = await totes_collection.find_one({"_id": oid})
    if not tote:
        raise HTTPException(status_code=404, detail="Tote not found")

    serialized = serialize_tote(tote)

    return {"tote": serialized}

# Update tote by _id
@router.patch("/{id}")
async def update_tote(
    request: Request,
    id: str,
    description: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    weight: Optional[float] = Form(None),
    existingImages: List[str] = Form([]),  # snake_case naming consistent
    images: List[UploadFile] = File([]),
):
    try:
        oid = ObjectId(id)
    except errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    form = await request.form()
    tags = form.getlist("tags") or form.getlist("tags[]") or []

    update_data = {}

    if description is not None:
        update_data["description"] = description
    if status is not None:
        update_data["status"] = status
    if location is not None:
        update_data["location"] = location
    if weight is not None:
        update_data["weight"] = weight
    if tags:
        update_data["tags"] = tags

    # Process new images like in create_tote
    for image_file in images:
        contents = await image_file.read()
        encoded = base64.b64encode(contents).decode("utf-8")
        existingImages.append(encoded)  # directly append encoded images to existingImages

    update_data["images"] = existingImages

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    update_data["updated_at"] = datetime.utcnow()

    result = await totes_collection.update_one(
        {"_id": oid},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Tote not found")

    updated = await totes_collection.find_one({"_id": oid})
    return {"message": "Tote updated", "tote": serialize_tote(updated)}

# Delete tote by _id (changed from barcode)
@router.delete("/{id}")
async def delete_tote(id: str):
    try:
        oid = ObjectId(id)
    except errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await totes_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tote not found")
    return {"message": f"Tote {id} deleted"}
