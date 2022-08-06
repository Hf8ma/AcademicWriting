## Server

[![Python Version](https://img.shields.io/badge/Python-3.9-blue)](https://img.shields.io/badge/Python-3.9-blue)

#### Anleitung Server lokal starten:

1. Virtual Environment erstellen:

```python
python -m venv venv
source venv/bin/activate

# export PATH=$PATH:/Applications/Postgres.app/Contents/Versions/12/bin/
pip install -r requirements.txt
```

2. Lokale Postgres Datenbank erstellen:

```bash
psql postgres -U username

> postgres=# CREATE DATABASE academicwriting_db;
```

3. Environment Variablen erstellen:

```bash
export SECRET_KEY=XXXX
export DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/academicwriting_db
export APP_SETTINGS=api.config.DevelopmentConfig
```

4. Datenbank erstellen:

```bash
python manage.py db init
python manage.py db migrate
python manage.py db upgrade
```

5. Pandoc

```python
from pypandoc.pandoc_download import download_pandoc


download_pandoc(version='2.0')
```

6. Flask-Server starten:

```bash
python run.py
```

#### Anleitung Server über Docker starten:

1. .env Datei mit folgenden Variablen erstellen:

```bash
POSTGRES_USER=localhost
POSTGRES_PASSWORD=test
POSTGRES_DB=academicwriting_db
SECRET_KEY=XXXX
DATABASE_URL=postgresql+psycopg2://localhost:test@postgres:5432/academicwriting_db
APP_SETTINGS=api.config.ProductionConfig
```

2. docker-compose.yml ausführen:

```bash
docker-compose build && docker-compose up
```

3. Einklinken in Docker-Container und Datenbank erstellen:

```bash
docker-compose exec flask sh
> python manage.py db init && python manage.py db migrate && python manage.py db upgrade
> exit
```

API-Route = http://127.0.0.1:5000/api/

Packageliste erstellen:

```python
pip freeze > requirements.txt
```


## Hilfreiche Links

### Datenbank

https://realpython.com/flask-by-example-part-2-postgres-sqlalchemy-and-alembic/
https://www.codementor.io/@engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb


### Authentifizierung

https://realpython.com/token-based-authentication-with-flask/

### Projektstruktur

https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project
