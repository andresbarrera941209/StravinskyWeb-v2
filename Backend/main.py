from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import traceback
import sys
import os

# Agregar el directorio actual al path para importaciones
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import crud, models, schemas, database, auth

app = FastAPI(
    title="API con JWT Authentication",
    description="API con autenticación JWT",
    version="1.0.0"
)

# Configuración de CORS para permitir conexiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Más permisivo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas al inicializar
try:
    models.Base.metadata.create_all(bind=database.engine)
    print("✅ Base de datos inicializada correctamente")
except Exception as e:
    print(f"❌ Error inicializando base de datos: {e}")

# Rutas de autenticación
@app.post("/auth/register", response_model=schemas.UsuarioResponse, tags=["Authentication"])
def register(usuario: schemas.UsuarioCreate, db: Session = Depends(database.get_db)):
    try:
        print(f"📝 [REGISTER] Inicio - Usuario: {usuario.correo}")
        
        # Verificar si el usuario ya existe
        print(f"🔍 [REGISTER] Verificando usuario existente...")
        db_usuario = crud.get_usuario_by_email(db, usuario.correo)
        if db_usuario:
            print(f"⚠️ [REGISTER] Usuario ya existe: {usuario.correo}")
            raise HTTPException(status_code=400, detail="El correo ya está registrado")
        
        print(f"🔐 [REGISTER] Creando usuario...")
        result = crud.create_usuario(db, usuario)
        print(f"✅ [REGISTER] Usuario creado exitosamente: ID={result.id}")
        
        return result
        
    except HTTPException as http_exc:
        print(f"⚠️ [REGISTER] HTTP Exception: {http_exc.detail}")
        raise http_exc
    except Exception as e:
        error_msg = f"Error interno en registro: {str(e)}"
        print(f"❌ [REGISTER] Error: {error_msg}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/auth/login", response_model=schemas.Token, tags=["Authentication"])
def login(user_credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    try:
        print(f"🔑 [LOGIN] Inicio - Usuario: {user_credentials.correo}")
        
        user = auth.authenticate_user(db, user_credentials.correo, user_credentials.password)
        if not user:
            print(f"❌ [LOGIN] Credenciales incorrectas: {user_credentials.correo}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": user.correo}, expires_delta=access_token_expires
        )
        
        print(f"✅ [LOGIN] Login exitoso: {user.correo}")
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        error_msg = f"Error interno en login: {str(e)}"
        print(f"❌ [LOGIN] Error: {error_msg}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)

# Rutas protegidas (requieren JWT)
@app.post("/usuarios/", response_model=schemas.UsuarioResponse, tags=["Usuarios"])
def crear_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(database.get_db), current_user: models.Usuario = Depends(auth.get_current_user)):
    try:
        # Verificar si el usuario ya existe
        db_usuario = crud.get_usuario_by_email(db, usuario.correo)
        if db_usuario:
            raise HTTPException(status_code=400, detail="El correo ya está registrado")
        
        return crud.create_usuario(db, usuario)
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"❌ [CREATE_USER] Error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/usuarios/", tags=["Usuarios"])
def listar_usuarios(db: Session = Depends(database.get_db), current_user: models.Usuario = Depends(auth.get_current_user)):
    return crud.get_usuarios(db)

@app.get("/usuarios/{usuario_id}", tags=["Usuarios"])
def obtener_usuario(usuario_id: int, db: Session = Depends(database.get_db), current_user: models.Usuario = Depends(auth.get_current_user)):
    usuario = crud.get_usuario(db, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@app.put("/usuarios/{usuario_id}", tags=["Usuarios"])
def actualizar_usuario(usuario_id: int, usuario: schemas.UsuarioCreate, db: Session = Depends(database.get_db), current_user: models.Usuario = Depends(auth.get_current_user)):
    updated = crud.update_usuario(db, usuario_id, usuario)
    if not updated:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return updated

@app.delete("/usuarios/{usuario_id}", tags=["Usuarios"])
def eliminar_usuario(usuario_id: int, db: Session = Depends(database.get_db), current_user: models.Usuario = Depends(auth.get_current_user)):
    deleted = crud.delete_usuario(db, usuario_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"message": "Usuario eliminado correctamente"}

# Ruta para obtener perfil del usuario actual
@app.get("/me", response_model=schemas.UsuarioResponse, tags=["Authentication"])
def get_current_user_profile(current_user: models.Usuario = Depends(auth.get_current_user)):
    return current_user