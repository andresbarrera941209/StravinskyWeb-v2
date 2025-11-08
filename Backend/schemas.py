from pydantic import BaseModel, ConfigDict
from typing import Optional

class UsuarioBase(BaseModel):
    nombre: str
    correo: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    correo: str
    password: str

class UsuarioCreate(BaseModel):
    nombre: str
    correo: str
    password: str

class UsuarioResponse(BaseModel):
    id: int
    nombre: str
    correo: str
    
    model_config = ConfigDict(from_attributes=True)

class Usuario(UsuarioBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
