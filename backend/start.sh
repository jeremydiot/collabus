#!/bin/bash

# active python virtual environment
source env/bin/activate

# start and wait postgres database is running
docker compose up -d
until docker exec collabus_dev_postgres psql $DJANGO_DATABASE_NAME $DJANGO_DATABASE_USER > /dev/null 2>&1; do
  echo "waiting for postgres container..."
  sleep 1
done

# configure and run server
python3 manage.py migrate
python3 manage.py createsuperuser --noinput > /dev/null 2>&1
python3 manage.py runserver

docker compose stop
# docker compose down # for stop and remove containers