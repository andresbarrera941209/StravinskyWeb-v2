from sqlalchemy.orm import Session
import models, schemas



def get_usuario_by_email(db: Session, email: str):
    return db.query(models.Usuario).filter(models.Usuario.correo == email).first()

# Crear usuario
def create_usuario(db: Session, usuario: schemas.UsuarioCreate):
    from auth import get_password_hash
    hashed_password = get_password_hash(usuario.password)
    db_usuario = models.Usuario(
        nombre=usuario.nombre, 
        correo=usuario.correo, 
        hashed_password=hashed_password
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Obtener todos los usuarios
def get_usuarios(db: Session):
    return db.query(models.Usuario).all()

# Obtener usuario por ID
def get_usuario(db: Session, usuario_id: int):
    return db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()

# Actualizar usuario
def update_usuario(db: Session, usuario_id: int, usuario: schemas.UsuarioCreate):
    from auth import get_password_hash
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not db_usuario:
        return None
    db_usuario.nombre = usuario.nombre
    db_usuario.correo = usuario.correo
    # Solo actualizar la contraseña si se proporciona
    if hasattr(usuario, 'password') and usuario.password:
        db_usuario.hashed_password = get_password_hash(usuario.password)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Eliminar usuario
def delete_usuario(db: Session, usuario_id: int):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not db_usuario:
        return None
    db.delete(db_usuario)
    db.commit()
    return db_usuario
