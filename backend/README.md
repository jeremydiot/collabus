# collabus backend

## OS requirements
- debian
- vscode
- python3.10
- python3-venv
- libpq-dev
- docker
- docker-compose-plugin

## Env file
Example of **.env** file, to be created in django project folder root
> In production context, use **'production'** value fo key **DJANGO_EXECUTION_ENVIRONMENT** else use **'development'** value.

```bash
# rewrite values in production context
DJANGO_EXECUTION_ENVIRONMENT='development'
DJANGO_SECRET_KEY='django-insecure-+8d51zrhytbw=s6+oh)4p$ghje@l#&k9f664cw4u8s)2w*zxgb'
DJANGO_SUPERUSER_PASSWORD='admin'
DJANGO_SUPERUSER_USERNAME='admin'
DJANGO_SUPERUSER_EMAIL='admin@admin.com'
DJANGO_DATABASE_NAME='postgres'
DJANGO_DATABASE_USER='postgres'
DJANGO_DATABASE_PSWD='postgres'
DJANGO_DATABASE_HOST='localhost'
DJANGO_DATABASE_PORT='5432'
```

## Commands
Execute following commands from django project base folder.
```bash 
./init.sh # init project execution environment
docker compose up -d # start database

python3 manage.py migrate
python3 manage.py createsuperuser --noinput
```