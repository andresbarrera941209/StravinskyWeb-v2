# Docker - Guía de uso

## Prerrequisitos
- Docker instalado y ejecutándose
- Docker Compose instalado

## Construir la imagen

```bash
docker build -t stravinsky-api .
```

## Ejecutar con Docker (sin compose)

```bash
docker run -p 8090:8090 \
  -v $(pwd)/stravinsky.db:/app/stravinsky.db \
  stravinsky-api
```

## Ejecutar con Docker Compose (recomendado)

```bash
docker-compose up -d
```

## Ver logs

```bash
docker-compose logs -f api
```

## Detener contenedor

```bash
docker-compose down
```

## Limpiar todo (incluido volúmenes)

```bash
docker-compose down -v
```

## Acceder a la API

- URL: http://localhost:8090
- Swagger: http://localhost:8090/docs
- ReDoc: http://localhost:8090/redoc

## Reconstruir después de cambios en requirements.txt

```bash
docker-compose build --no-cache
docker-compose up -d
```

## Comandos útiles

```bash
# Ver contenedores corriendo
docker ps

# Entrar al contenedor
docker exec -it stravinsky-api bash

# Ver imagen
docker images

# Eliminar imagen
docker rmi stravinsky-api
```
