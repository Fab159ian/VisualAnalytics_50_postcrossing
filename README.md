# VisualAnalytics_50_postcrossing
Visual Analytics project for postcrossing 2025

First time running requires building the frontend, database setup and loading postcards before running the server

### Database
python3 manage.py makemirgration

python3 manage.py migrate

### Run backend
python3 manage.py runserver

### Update Frontend
python3 manage.py build_frontend

if on Unix you might also need to run:

    chmod +x build_and_sync_frontend.sh

manually:

    npm run build

move everything inside frontend/build folder into backend/static/frontend (delete old content inside backend/static/frontend)

### Load and remove Postcards in Database from data folder
python3 manage.py load_postcards

python3 manage.py clear_postcards