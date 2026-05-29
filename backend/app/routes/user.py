from fastapi import APIRouter, Request
from fastapi import HTTPException
from app.auth.dependencies import get_current_user
from app.auth.jwt import decode_token
from fastapi import Header
from jose import JWTError

router = APIRouter()

@router.get("/logout")
def logout():
    # JWT is stateless — client just deletes the token
    return {"message": "Logged out"}

@router.get("/me")
def get_me(authorization: str = Header(...)):
    try:
        payload = decode_token(authorization[7:])
        return {
            "email": payload.get("user_email"),
            "user_id": payload.get("user_id")
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Not logged in")