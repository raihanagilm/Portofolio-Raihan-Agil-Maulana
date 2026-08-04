# create_tables.py
"""Utility script to create all database tables based on SQLAlchemy models.
Run with: python create_tables.py
"""
import os
import sys

# Ensure project root is in PYTHONPATH
project_root = os.path.abspath(os.path.dirname(__file__))
if project_root not in sys.path:
    sys.path.append(project_root)

# Import Flask app (creates app instance) and db
from app import app  # Flask app instance defined in app.py
from Backend.database import db

with app.app_context():
    db.create_all()
    print("All tables created (or already exist).")
