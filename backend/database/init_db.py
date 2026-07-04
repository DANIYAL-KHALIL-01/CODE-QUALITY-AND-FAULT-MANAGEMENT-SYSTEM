"""
Database initialization script
Run this to create the SQLite database and tables
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask
from models import db

def init_database():
    """Initialize the database"""
    app = Flask(__name__)
    db_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'app.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Database initialized successfully!")
        print("📁 Database location: backend/data/app.db")
        print("📊 Tables created: repositories, code_metrics, predictions, bug_reports, test_cases")

if __name__ == '__main__':
    init_database()