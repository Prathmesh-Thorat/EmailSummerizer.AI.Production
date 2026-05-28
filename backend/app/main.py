from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
from app.routes.auth import router as auth_router
from app.routes.summary import router as summary_router
from app.db.database import engine
from app.models.summary import Summary
from app.db.database import Base
from app.models.user import User
from app.routes.user import router as user_router
from app.models.task import Task
from app.routes.tasks import router as task_router
from starlette.middleware.trustedhost import TrustedHostMiddleware
import os;

load_dotenv()

app = FastAPI(root_path="")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://email-summerizer-ai-production.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET"),
    same_site="none",
    https_only=True
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

app.include_router(auth_router)
app.include_router(summary_router)
app.include_router(user_router)
app.include_router(task_router)

@app.get("/")
def home():
    return {"message": "Backend running"}