#!/bin/bash

python3.10 manage.py migrate --no-input
python3.10 manage.py collectstatic --no-input

daphne -b 0.0.0.0 -p 8000 config.asgi:application