# 🐳 Docker Setup - Stravinsky MusicShop

Guía completa para ejecutar el proyecto con Docker.

## 📋 Requisitos

- Docker >= 20.10
- Docker Compose >= 2.0
- Git

## 🚀 Quick Start

### 1. Clonar y preparar el proyecto

```bash
git clone <repo-url>
cd Stravinsky
```

### 2. Iniciar servicios con Docker Compose

```bash
docker-compose up -d
```

Esto inicia:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8090
- **Nginx Proxy**: http://localhost:80

### 3. Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Solo frontend
docker-compose logs -f frontend

# Solo backend
docker-compose logs -f api
```

## 🏗️ Estructura de Servicios

```
Stravinsky/
├── Frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── main.py
├── docker-compose.yml
├── nginx.conf
└── .env.example
```

## 📦 Servicios Incluidos

### Frontend (React + Vite)
- **Puerto**: 3000
- **Build**: Multi-stage para optimización
- **Tecnología**: Node 18-Alpine
- **Features**: Hot-reload en desarrollo (opcional)

### Backend (FastAPI + SQLite)
- **Puerto**: 8090
- **Base de datos**: SQLite local
- **Documentación**: http://localhost:8090/docs
- **Tecnología**: Python 3.11-Slim

### Nginx (Proxy Reverso)
- **Puerto**: 80
- **Función**: Enrutamiento y CORS
- **Config**: nginx.conf

## 🔧 Comandos Útiles

### Iniciar servicios
```bash
docker-compose up -d
```

### Detener servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes
```bash
docker-compose down -v
```

### Reconstruir imágenes
```bash
docker-compose build --no-cache
```

### Reconstruir e iniciar
```bash
docker-compose up -d --build
```

### Ver estado de servicios
```bash
docker-compose ps
```

### Ejecutar comando en contenedor
```bash
docker-compose exec frontend sh
docker-compose exec api bash
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f api --tail=100
```

## 🌍 Variables de Entorno

Crear `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:8090
DATABASE_URL=sqlite:///./stravinsky.db
```

## 📝 Configurar Backend (Primera vez)

Si es la primera vez, ejecutar migraciones:

```bash
docker-compose exec api python -m alembic upgrade head
```

## 🔒 CORS Configuration

Nginx está configurado para manejar CORS. El frontend en puerto 3000 puede acceder al backend en puerto 8090.

### URLs de acceso:
- **Frontend**: http://localhost:3000
- **Backend directo**: http://localhost:8090
- **API via Nginx**: http://localhost/api/

## 🚨 Troubleshooting

### "Port 3000 already in use"
```bash
# Cambiar puerto en docker-compose.yml
# ports:
#   - "3001:3000"  # Cambiar 3001 en lugar de 3000
```

### "Port 8090 already in use"
```bash
# Cambiar puerto en docker-compose.yml
# ports:
#   - "8091:8090"  # Cambiar 8091 en lugar de 8090
```

### Backend no conecta con Frontend
Verificar que `VITE_API_URL` apunte a `http://localhost:8090`

### Ver base de datos SQLite
```bash
# Dentro del contenedor
docker-compose exec api sqlite3 stravinsky.db

# O copiar la DB localmente
docker cp stravinsky-api:/app/stravinsky.db ./stravinsky.db
```

## 🔄 Desarrollo con Hot-Reload

Para habilitar hot-reload en desarrollo, descomentar en `docker-compose.yml`:

```yaml
frontend:
  volumes:
    - ./Frontend/src:/app/src
  command: npm run dev -- --host 0.0.0.0
```

## 🚀 Despliegue en Producción

1. Cambiar `VITE_API_URL` a dominio real
2. Configurar SSL en Nginx
3. Usar variables de entorno seguras
4. Habilitar healthchecks

Ejemplo producción:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📊 Monitoreo

Ver recursos usados por contenedores:

```bash
docker stats

# o con compose
docker-compose stats
```

## 🐛 Debug

Entrar a contenedor interactivamente:

```bash
# Frontend
docker-compose exec frontend sh

# Backend
docker-compose exec api bash

# Ver procesos
docker-compose exec api ps aux
```

## 🧹 Limpiar

```bash
# Eliminar contenedores
docker-compose rm

# Eliminar imágenes
docker image rm stravinsky-frontend stravinsky-api

# Limpiar todo (ADVERTENCIA!)
docker system prune -a --volumes
```

## 📖 Documentación Oficial

- [Docker Docs](https://docs.docker.com)
- [Docker Compose Docs](https://docs.docker.com/compose)
- [FastAPI + Docker](https://fastapi.tiangolo.com/deployment/docker/)
- [Vite + Docker](https://vitejs.dev/)

---

**¿Problemas?** Revisa los logs:
```bash
docker-compose logs -f
```
