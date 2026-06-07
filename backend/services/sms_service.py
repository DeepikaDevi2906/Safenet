import os

from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()

ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE_NUMBER")

client = Client(
    ACCOUNT_SID,
    AUTH_TOKEN
)


def send_sms(phone, message):
    client.messages.create(
        body=message,
        from_=TWILIO_PHONE,
        to=phone
    )