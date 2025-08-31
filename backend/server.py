# server.py - Entry point for local development
from main import app

# This allows supervisor to find the app at server:app
# while keeping main.py as the entry point for Vercel deployment