from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Base de datos local en SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./stravinsky.db"

# Configuración del motor de la BD
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # Requerido por SQLite
)

# Sesión de base de datos
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Declaración del modelo base
Base = declarative_base()

# Dependencia para inyección en FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
