# Docker Setup for Advocate Diary

This guide explains how to run the Advocate Diary application using Docker.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) (usually comes with Docker Desktop)

## Project Structure

```
advdiary/
├── docker-compose.yml       # Orchestrates all services
├── server/                  # Flask backend
│   ├── Dockerfile          # Backend container configuration
│   ├── .dockerignore       # Files to exclude from backend image
│   └── .env.example        # Environment variables template
├── client/                  # React frontend
│   ├── Dockerfile          # Frontend container configuration
│   ├── nginx.conf          # Nginx web server configuration
│   └── .dockerignore       # Files to exclude from frontend image
└── database/               # Database schema
```

## Services

The application consists of three Docker containers:

1. **db** (MySQL 8.0) - Database server on port 3306
2. **backend** (Flask) - Python API server on port 5000
3. **frontend** (React/Nginx) - Web application on port 80

## Quick Start

### 1. Environment Configuration

Create a `.env` file in the `server/` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file and update the values (especially the secret keys for production):

```env
SECRET_KEY=your-secure-secret-key-here
JWT_SECRET_KEY=your-secure-jwt-secret-here
```

### 2. Build and Start All Services

From the project root directory:

```bash
docker-compose up --build
```

This command will:
- Build Docker images for backend and frontend
- Pull the MySQL image
- Create and start all containers
- Initialize the database
- Run database migrations

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Database**: localhost:3306

## Docker Commands

### Start Services (Background Mode)

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### Stop Services and Remove Volumes (⚠️ Deletes all data)

```bash
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Restart a Service

```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db
```

### Rebuild a Service

```bash
# Rebuild backend
docker-compose up -d --build backend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Access Container Shell

```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh

# Database container
docker-compose exec db bash
```

## Database Management

### Access MySQL Console

```bash
docker-compose exec db mysql -u advdiary_user -p advdiary_db
# Password: advdiary_pass
```

### Run Database Migrations

```bash
docker-compose exec backend flask db upgrade
```

### Create New Migration

```bash
docker-compose exec backend flask db migrate -m "description of changes"
```

### Database Backup

```bash
docker-compose exec db mysqldump -u advdiary_user -p advdiary_db > backup.sql
# Password: advdiary_pass
```

### Restore Database

```bash
docker-compose exec -T db mysql -u advdiary_user -p advdiary_db < backup.sql
# Password: advdiary_pass
```

## Development Workflow

### Hot Reload (Development)

The docker-compose.yml is configured with volume mounting for development:

- Backend code changes are reflected immediately (Flask auto-reload)
- Frontend changes require rebuilding: `docker-compose up -d --build frontend`

### Debugging

#### Backend Debugging

1. View backend logs:
   ```bash
   docker-compose logs -f backend
   ```

2. Access Python shell:
   ```bash
   docker-compose exec backend python
   ```

#### Frontend Debugging

1. View frontend logs:
   ```bash
   docker-compose logs -f frontend
   ```

2. Check nginx configuration:
   ```bash
   docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
   ```

## Production Deployment

### 1. Update Environment Variables

Edit `docker-compose.yml` and update:
- `SECRET_KEY` - Use a strong random key
- `JWT_SECRET_KEY` - Use a strong random key
- `MYSQL_ROOT_PASSWORD` - Use a strong password
- `MYSQL_PASSWORD` - Use a strong password
- Set `FLASK_ENV=production`

### 2. Use Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: advdiary_db
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - advdiary-network

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    restart: always
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=mysql+pymysql://${DB_USER}:${DB_PASSWORD}@db:3306/advdiary_db
      - SECRET_KEY=${SECRET_KEY}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    volumes:
      - backend_uploads:/app/uploads
    depends_on:
      - db
    networks:
      - advdiary-network

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - advdiary-network

volumes:
  mysql_data:
  backend_uploads:

networks:
  advdiary-network:
```

### 3. Run Production Build

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Check what's using the port
netstat -ano | findstr :5000    # Windows
lsof -i :5000                   # Linux/Mac

# Kill the process or change ports in docker-compose.yml
```

### Database Connection Issues

```bash
# Check if database is healthy
docker-compose ps

# Restart database
docker-compose restart db

# Check database logs
docker-compose logs db
```

### Frontend Can't Connect to Backend

1. Check backend is running: `docker-compose ps`
2. Verify backend logs: `docker-compose logs backend`
3. Test API directly: `curl http://localhost:5000/api/health`

### Permission Issues (Linux/Mac)

```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

## Cleanup

### Remove All Containers and Images

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi advdiary-backend advdiary-frontend

# Remove all unused images
docker image prune -a
```

### Remove Volumes (⚠️ Deletes all data)

```bash
docker-compose down -v
docker volume prune
```

## Performance Tips

1. **Use .dockerignore** - Already configured to exclude unnecessary files
2. **Layer caching** - Dependencies are installed in separate layers
3. **Multi-stage builds** - Frontend uses multi-stage build for smaller images
4. **Volume mounting** - Source code is mounted for faster development

## Security Considerations

1. **Change default passwords** in production
2. **Use environment variables** for sensitive data
3. **Don't expose database port** in production (remove ports: 3306:3306)
4. **Use HTTPS** with SSL certificates in production
5. **Keep images updated**: `docker-compose pull`

## Next Steps

- [ ] Configure SSL/TLS for production
- [ ] Set up automated backups
- [ ] Configure monitoring and logging
- [ ] Set up CI/CD pipeline
- [ ] Configure reverse proxy (nginx/traefik)

## Support

For issues or questions:
- Check logs: `docker-compose logs`
- Verify configuration: `docker-compose config`
- Restart services: `docker-compose restart`

---

**Note**: This configuration is optimized for development. For production deployment, additional security and performance configurations are recommended.
