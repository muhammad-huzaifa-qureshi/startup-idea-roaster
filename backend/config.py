"""
Centralised all environment variable access
"""
from dotenv import load_dotenv

import os
load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
TAVILY_API_KEY = os.getenv('TAVILY_API_KEY')
MONGODB_URI = os.getenv('MONGODB_URI')
CORS_ORIGIN = os.getenv('CORS_ORIGIN')
MONGODB_DB = os.getenv('MONGODB_DB')
GROQ_LLM_MODEL = os.getenv('GROQ_LLM_MODEL')
