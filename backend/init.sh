#!/bin/bash

# exit when any command fails
set -e 

# install and configure python virtual environment
ENV_PATH="env/"
[ ! -d $ENV_PATH ] && python3.10 -m venv env && echo "set -a && source .env && set +a">> env/bin/activate

# install python dependencies in virtual environment
source env/bin/activate
python3.10 -m pip install --upgrade pip --require-virtualenv
python3.10 -m pip install -r requirements/common.txt --require-virtualenv
python3.10 -m pip install -r requirements/development.txt --require-virtualenv