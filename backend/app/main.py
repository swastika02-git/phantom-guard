import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.api.router import api_router

# Configure logging (Never log user raw payloads)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("phantom_guard")

app = FastAPI(
    title="👻 Phantom Guard API",
    description="Intelligent Scam and Phishing Protection Platform focused on India (English, Hindi, Hinglish).",
    version="0.2.0-phase2",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Strict CORS configuration
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Custom Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# Mount API V1 Router
app.include_router(api_router)

@app.get("/")
def root_redirect():
    return {
        "service": "Phantom Guard API",
        "status": "online",
        "documentation": "/docs",
        "version": "0.2.0-phase2",
        "tagline": "See the red flags. Outsmart the scams."
    }
