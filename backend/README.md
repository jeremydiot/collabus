# Collabus backend

## OS requirements

- debian
- vscode
- python3.10
- python3-venv
- python3-pip
- libpq-dev
- docker
- docker-compose-plugin
- ports 5050, 8000, 6379, 5432 are free

## Env file

Example of **.env** file, to be created in django project folder root
> In production context, use **'production'** value fo key **DJANGO_EXECUTION_ENVIRONMENT** else use **'development'** value.

```bash
# rewrite in production context
DJANGO_EXECUTION_ENVIRONMENT=development # or production
DJANGO_SETTINGS_MODULE=config.settings
DJANGO_SECRET_KEY=z7BHm1iQxQihGH2pplHUIhPbexbjjvNau4tsvMP9WkD4cUGANkQj76aOS1nn
DJANGO_SUPERUSER_PASSWORD=admin
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@admin.com
DJANGO_DATABASE_NAME=postgres
DJANGO_DATABASE_USER=postgres
DJANGO_DATABASE_PSWD=postgres
DJANGO_BACKEND_HOST=localhost,127.0.0.1
DJANGO_FRONTEND_URL=http://localhost,http://127.0.0.1
COMPOSE_FILE=docker-compose.dev.yml # or docker-compose.prod.yml
```

## Commands

Execute following commands from django project base folder.

```bash 
./init.sh # init project execution environment
./start.sh # start django and docker containers
python3.10 manage.py initdata # add fixtures
```
