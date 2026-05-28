from fastapi import APIRouter, Request
from fastapi import HTTPException

router = APIRouter()


@router.get("/logout")
def logout(request: Request):

    request.session.clear()

    return {
        "message": "Logged out"
    }

@router.get("/me")
def get_me(request: Request):

    user_id = request.session.get("user_id")

    if  not user_id:

        raise HTTPException(
            status_code=401,
            detail="Not logged in"
        )

    return {
        "email": request.session.get("user_email"),
        "user_id": user_id
    }