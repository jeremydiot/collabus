#!/bin/bash

# active python virtual environment
source env/bin/activate

# start docker
./scripts/dockerUp.sh

# configure and run server
python3 manage.py migrate
python3 manage.py createsuperuser --noinput > /dev/null 2>&1
python3 manage.py runserver

docker compose stop
# docker compose down # for stop and remove containers