#!/bin/bash

[ ! -f backend/.env ] && echo 'ERROR : no environment file for in backend folder' && exit 1
[ ! -f .env ] && echo 'ERROR : no environment file in root folder' && exit 1

set -a
source backend/.env
source .env
set +a

[ ! -v COLLABUS_BACKEND_PORT ] && echo "ERROR (.env): missing 'COLLABUS_BACKEND_PORT' environment variable" && exit 1
[ ! -v COLLABUS_FRONTEND_PORT ] && echo "ERROR (.env): missing 'COLLABUS_FRONTEND_PORT' environment variable" && exit 1
[ ! -v EXECUTION_ENVIRONMENT ] && echo "ERROR (.env): missing 'EXECUTION_ENVIRONMENT' environment variable" && exit 1
[ "$EXECUTION_ENVIRONMENT" != "production" ] && [ "$EXECUTION_ENVIRONMENT" != "staging" ] && echo "ERROR (.env): wrong value for 'EXECUTION_ENVIRONMENT' environment variable, must be 'production' or 'staging'" && exit 1

[ ! -v DJANGO_EXECUTION_ENVIRONMENT ] && echo "ERROR (backend/.env): missing 'DJANGO_EXECUTION_ENVIRONMENT' environment variable" && exit 1
[ "$DJANGO_EXECUTION_ENVIRONMENT" != "production" ] && [ "$DJANGO_EXECUTION_ENVIRONMENT" != "staging" ] && echo "ERROR (backend/.env): wrong value for 'DJANGO_EXECUTION_ENVIRONMENT' environment variable, must be 'production' or 'staging'" && exit 1
[ ! -v DJANGO_SETTINGS_MODULE ] && echo "ERROR (backend/.env): missing 'DJANGO_SETTINGS_MODULE' environment variable" && exit 1
[ ! -v DJANGO_SECRET_KEY ] && echo "ERROR (backend/.env): missing 'DJANGO_SECRET_KEY' environment variable" && exit 1
[ ! -v DJANGO_SUPERUSER_PASSWORD ] && echo "ERROR (backend/.env): missing 'DJANGO_SUPERUSER_PASSWORD' environment variable" && exit 1
[ ! -v DJANGO_SUPERUSER_USERNAME ] && echo "ERROR (backend/.env): missing 'DJANGO_SUPERUSER_USERNAME' environment variable" && exit 1
[ ! -v DJANGO_SUPERUSER_EMAIL ] && echo "ERROR (backend/.env): missing 'DJANGO_SUPERUSER_EMAIL' environment variable" && exit 1
[ ! -v DJANGO_DATABASE_NAME ] && echo "ERROR (backend/.env): missing 'DJANGO_DATABASE_NAME' environment variable" && exit 1
[ ! -v DJANGO_DATABASE_USER ] && echo "ERROR (backend/.env): missing 'DJANGO_DATABASE_USER' environment variable" && exit 1
[ ! -v DJANGO_DATABASE_PSWD ] && echo "ERROR (backend/.env): missing 'DJANGO_DATABASE_PSWD' environment variable" && exit 1
[ ! -v DJANGO_BACKEND_URL ] && echo "ERROR (backend/.env): missing 'DJANGO_BACKEND_URL' environment variable" && exit 1
[ ! -v DJANGO_FRONTEND_URL ] && echo "ERROR (backend/.env): missing 'DJANGO_FRONTEND_URL' environment variable" && exit 1

./stop.prod.sh

docker compose -f backend/docker-compose.prod.yml build --no-cache
docker compose -f backend/docker-compose.prod.yml up --detach --force-recreate --remove-orphans

docker compose -f frontend/docker-compose.prod.yml build --no-cache
docker compose -f frontend/docker-compose.prod.yml up --detach --force-recreate --remove-orphans

docker system prune --force
# docker image prune --force
