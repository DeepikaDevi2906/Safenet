from fastapi import APIRouter

from services.sms_service import send_sms

router = APIRouter()


@router.get("/test-sms")
def test_sms():

    send_sms(
        "+91YOUR_NUMBER",
        "🚨 SAFENET SMS Test Successful"
    )

    return {
        "message": "SMS Sent Successfully"
    }