# tests/conftest.py

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import sys
import os

# ============================================
# 🔥 Agregar el PATH correcto hacia /Backend
# ============================================
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Backend"))
sys.path.append(BASE_DIR)

# Ahora sí puede importar módulos del Backend
from main import app
from database import get_db
from models import Base

# ============================================
# 🔥 Base de datos de prueba (en memoria)
# ============================================
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ============================================
# 🔥 Override de dependencia get_db
# ============================================
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# ============================================
# 🔥 Cliente de pruebas
# ============================================
@pytest.fixture
def client():
    # Reinicia las tablas antes de cada test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    return TestClient(app)
