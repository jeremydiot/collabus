#!/bin/bash

# exit when any command fails
set -e 

# install and configure python virtual environment
ENV_PATH="env/"
[ ! -d $ENV_PATH ] && python3.10 -m venv env && echo "set -a && source .env && set +a">> env/bin/activate

# install python dependencies in virtual environment
source env/bin/activate
python3 -m pip install -r requirements/common.txt
[ "$DJANGO_EXECUTION_ENVIRONMENT" = "development" ] && python3 -m pip install -r requirements/development.txt