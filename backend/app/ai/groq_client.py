import os
from google import genai
from dotenv import load_dotenv
from openai import OpenAI
load_dotenv()

client = genai.Client(
    api_key=os.getenv("GROQ_API_KEY")
)

client = OpenAI(
    api_key=os.getenv("csk-jjp2rnev6dwpfh6yc2xetmfpvf8cfkd3pdkcm89trchk9pny"),
    base_url="https://api.cerebras.ai/v1"
)