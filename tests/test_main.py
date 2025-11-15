import pytest

# ---------- 1. Test del endpoint /hello ----------
def test_hello(client):
    response = client.get("/hello")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hola Mundo"}

# ---------- 2. Registro exitoso ----------
def test_register_success(client):
    data = {
        "nombre": "Andres",
        "correo": "test@example.com",
        "password": "123456"
    }
    r = client.post("/auth/register", json=data)
    assert r.status_code == 200
    assert r.json()["correo"] == "test@example.com"

# ---------- 3. Registro duplicado ----------
def test_register_duplicate(client):
    data = {
        "nombre": "Andres",
        "correo": "test2@example.com",
        "password": "123456"
    }
    client.post("/auth/register", json=data)
    r = client.post("/auth/register", json=data)
    assert r.status_code == 400
    assert r.json()["detail"] == "El correo ya está registrado"

# ---------- 4. Login exitoso ----------
def test_login_success(client):
    data = {
        "nombre": "User",
        "correo": "login@example.com",
        "password": "123456"
    }
    client.post("/auth/register", json=data)

    login_data = {"correo": "login@example.com", "password": "123456"}
    r = client.post("/auth/login", json=login_data)
    assert r.status_code == 200
    assert "access_token" in r.json()

# ---------- 5. Login incorrecto ----------
def test_login_wrong_password(client):
    data = {
        "correo": "login2@example.com",
        "nombre": "User",
        "password": "123456"
    }
    client.post("/auth/register", json=data)
    r = client.post("/auth/login", json={"correo": "login2@example.com", "password": "999999"})
    assert r.status_code == 401

# ---------- helper para obtener token ----------
def get_token(client, email="auth@example.com"):
    register = {
        "nombre": "Tester",
        "correo": email,
        "password": "123456"
    }
    client.post("/auth/register", json=register)
    login = client.post("/auth/login", json={"correo": email, "password": "123456"})
    return login.json()["access_token"]

# ---------- 6. Endpoint protegido sin token ----------
def test_list_usuarios_no_token(client):
    r = client.get("/usuarios/")
    assert r.status_code == 401

# ---------- 7. Endpoint protegido con token válido ----------
def test_list_usuarios_token(client):
    token = get_token(client)
    r = client.get("/usuarios/", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200

# ---------- 8. Crear usuario (administrador autenticado) ----------
def test_crear_usuario(client):
    token = get_token(client)
    data = {
        "nombre": "Nuevo",
        "correo": "nuevo@example.com",
        "password": "123456"
    }
    r = client.post("/usuarios/", json=data, headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["correo"] == "nuevo@example.com"

# ---------- 9. Obtener usuario por ID ----------
def test_obtener_usuario(client):
    token = get_token(client)
    data = {
        "nombre": "Carlos",
        "correo": "carlos@example.com",
        "password": "123456"
    }
    created = client.post("/usuarios/", json=data, headers={"Authorization": f"Bearer {token}"}).json()
    r = client.get(f"/usuarios/{created['id']}", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["correo"] == "carlos@example.com"

# ---------- 10. Obtener usuario que no existe ----------
def test_obtener_usuario_not_found(client):
    token = get_token(client)
    r = client.get("/usuarios/9999", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 404

# ---------- 11. Actualizar usuario ----------
def test_actualizar_usuario(client):
    token = get_token(client)
    data = {
        "nombre": "Luis",
        "correo": "luis@example.com",
        "password": "123456"
    }
    created = client.post("/usuarios/", json=data, headers={"Authorization": f"Bearer {token}"}).json()

    update_data = {
        "nombre": "Luis Modificado",
        "correo": "luis@example.com",
        "password": "123456"
    }

    r = client.put(f"/usuarios/{created['id']}", json=update_data, headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["nombre"] == "Luis Modificado"

# ---------- 12. Eliminar usuario ----------
def test_eliminar_usuario(client):
    token = get_token(client)
    data = {
        "nombre": "Dario",
        "correo": "dario@example.com",
        "password": "123456"
    }
    created = client.post("/usuarios/", json=data, headers={"Authorization": f"Bearer {token}"}).json()
    r = client.delete(f"/usuarios/{created['id']}", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200

# ---------- 13. Acceso al endpoint /me ----------
def test_me(client):
    token = get_token(client)
    r = client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert "correo" in r.json()

# ---------- 14. Crear usuario con correo repetido ----------
def test_crear_usuario_duplicado(client):
    token = get_token(client)
    data = {
        "nombre": "A1",
        "correo": "dup@example.com",
        "password": "123456"
    }
    client.post("/usuarios/", json=data, headers={"Authorization": f"Bearer {token}"})
    r = client.post("/usuarios/", json=data, headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 400

# ---------- 15. Validación: password faltante ----------
def test_register_missing_password(client):
    data = {
        "nombre": "SinPass",
        "correo": "sinpass@example.com"
    }
    r = client.post("/auth/register", json=data)
    assert r.status_code == 422  # Unprocessable Entity
