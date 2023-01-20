#!/bin/bash

set -a
source backend/.env
source .env
set +a

docker compose -f backend/docker-compose.prod.yml down --remove-orphans --rmi local --volumes
docker compose -f frontend/docker-compose.prod.yml down --remove-orphans --rmi local --volumes
docker system prune --force
# docker volume prune --force