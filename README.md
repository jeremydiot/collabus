# Collabus

Website for Collabus project  
[www.collabus.fr](https://www.collabus.fr)

## Deployment

1. Add **.env** file in **backend/** folder. [See backend environment file documentation.](backend/README.md#env-file)
2. Add **.env** file in project root folder and add the following keys :

```bash
COLLABUS_BACKEND_PORT=8000 # port example
COLLABUS_FRONTEND_PORT=8001 # port example
```

3. Start containers ```./start.prod.sh ```

> Stop containers ```./stop.prod.sh ```

### NGINX example configuration

```
server {
    listen 80;
    listen [::]:80;

    server_name backend.collabus.fr;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}

server {
    listen 80;
    listen [::]:80;

    server_name collabus.fr;

    location / {
        proxy_pass http://localhost:8001;
    }
}
```

## Commit 

```
<type>[optional scope][optional breaking change '!']: <description>
```

### Example : 

- feat(frontend): commit description
- fix(backend)!: commit description

### Types : 

- chore(): routine job
- build(): system build and dependencies
- ci(): integration or configuration scripts and files
- feat(): introduces a new feature
- fix(): patches a bug
- perf(): performance improvement
- refactor(): rewrite code
- style(): code formatting
- docs(): add or update docs
- test(): add or update tests
