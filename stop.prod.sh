#!/bin/bash

docker compose -f backend/docker-compose.prod.yml down
docker compose -f frontend/docker-compose.prod.yml down