import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR
from app.routes.totes import router as totes_router
from app.routes.tags import router as tags_router

# Set up logging
logging.basicConfig(
    level=logging.INFO,  # Use DEBUG for more verbose logging in dev
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)
logger = logging.getLogger("inventory_api")

app = FastAPI(
    title="Inventory API",
    description="API for managing totes and tags",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS origins - add your frontend URLs here
origins = [
    "http://localhost:3000",  # React dev server
    "https://qr-storage.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with prefixes
app.include_router(totes_router, prefix="/totes", tags=["Totes"])
app.include_router(tags_router, prefix="/tags", tags=["Tags"])

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Server is up and running!"}

# Global exception handler for unexpected errors
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.method} {request.url}: {repr(exc)}")
    return JSONResponse(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal Server Error", "error": str(exc)},
    )
