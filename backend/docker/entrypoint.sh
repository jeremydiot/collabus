#!/bin/bash

while ! nc -z postgres 5432; do
  echo 'waiting for postgres container...'
  sleep 1
done

python3.10 manage.py migrate --no-input
python3.10 manage.py collectstatic --no-input

daphne -b 0.0.0.0 -p 8000 config.asgi:application