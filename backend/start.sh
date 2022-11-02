#!/bin/bash

# start and wait postgres database is running
docker compose up -d
until docker exec collabus_dev_postgres psql -U postgres > /dev/null 2>&1; do
  echo "waiting for postgres container..."
  sleep 1
done

# active python virtual environment configure and run server
source env/bin/activate
python3 manage.py migrate
python3 manage.py createsuperuser --noinput > /dev/null 2>&1
python3 manage.py runserver

docker compose stop
# docker compose down # for stop and remove containers