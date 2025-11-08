# 🎉 ¡Docker está corriendo!

## 🌐 URLs de acceso

| Servicio | URL | Puerto |
|----------|-----|--------|
| **Frontend** | http://localhost:3000 | 3000 |
| **Backend API** | http://localhost:8090 | 8090 |
| **Backend Docs** | http://localhost:8090/docs | 8090 |
| **Nginx Proxy** | http://localhost:80 | 80 |

## 📊 Estado de Contenedores

```
✅ stravinsky-api       - Backend FastAPI corriendo en :8090
✅ stravinsky-frontend  - Frontend React corriendo en :3000
✅ stravinsky-nginx     - Nginx proxy corriendo en :80
✅ Network              - Conectando todos los servicios
```

## 🔧 Comandos Útiles

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Ver logs de un servicio
```bash
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f nginx
```

### Detener servicios
```bash
docker-compose stop
```

### Reiniciar servicios
```bash
docker-compose restart
```

### Rehacer desde cero
```bash
docker-compose down -v
docker-compose up -d
```

## 🧪 Pruebas Rápidas

### Verificar Backend
```bash
curl http://localhost:8090/docs
```

### Verificar Frontend
```bash
# Abrir en navegador: http://localhost:3000
```

### Verificar Nginx
```bash
curl http://localhost:80
```

## 📝 Próximos Pasos

1. Abre http://localhost:3000 en tu navegador
2. Registra una nueva cuenta
3. Inicia sesión
4. Prueba agregar productos al carrito
5. Gestiona usuarios en /usuarios

## 🐛 Si algo no funciona

```bash
# Ver todos los logs
docker-compose logs

# Entrar al contenedor del backend
docker-compose exec api bash

# Entrar al contenedor del frontend
docker-compose exec frontend sh

# Verificar que el backend está respondiendo
curl -v http://localhost:8090/auth/login
```

## 🛑 Para detener todo

```bash
docker-compose down
```

---

**¡Listo para usar! 🚀**
