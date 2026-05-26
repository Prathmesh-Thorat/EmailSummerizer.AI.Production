from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/me")
def get_me(request: Request):

    return {
        "email": request.session.get("user_email"),
        "user_id": request.session.get("user_id")
    }

@router.get("/logout")
def logout(request: Request):

    request.session.clear()

    return {
        "message": "Logged out"
    }