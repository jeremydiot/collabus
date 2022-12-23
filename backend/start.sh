#!/bin/bash

# active python virtual environment
source env/bin/activate

# start docker
./scripts/dockerStart.sh

# configure and run server
python3.10 manage.py migrate
python3.10 manage.py createsuperuser --noinput > /dev/null 2>&1
python3.10 manage.py runserver

# stop docker
./scripts/dockerStop.sh