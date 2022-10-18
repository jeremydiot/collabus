#!/bin/bash

ENV_PATH="env/"

[ ! -d $ENV_PATH ] && python3.10 -m venv env

echo "set -a && source .env && set +a">> env/bin/activate

source env/bin/activate

python3 -m pip install -r requirements/common.txt
[ "$DJANGO_EXECUTION_ENVIRONMENT" = "development" ] && python3 -m pip install -r requirements/development.txt