import os
from dotenv import load_dotenv
from openai import OpenAI
load_dotenv()

c_client = OpenAI(
    api_key=os.getenv("CEREBRAS_API_KEY"),
    base_url="https://api.cerebras.ai/v1"
)