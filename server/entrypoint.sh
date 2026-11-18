#!/bin/sh
set -e

echo "Applying Django migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "Ensuring root superuser and car catalog exist..."
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.settings')
django.setup()
from django.contrib.auth.models import User
from djangoapp.models import CarMake
from djangoapp.populate import initiate
u, _ = User.objects.get_or_create(username='root', defaults={'email':'root@bestcars.com','is_staff':True,'is_superuser':True})
u.set_password('rootpass123')
u.is_staff = True
u.is_superuser = True
u.save()
if CarMake.objects.count() == 0:
    initiate()
"

echo "Starting Dealership API on 127.0.0.1:3030..."
node /app/local_api.js &

echo "Starting Sentiment Analyzer on 127.0.0.1:5050..."
python -c "import sys; sys.path.insert(0, '/app/djangoapp/microservices'); import app; app.app.run(host='127.0.0.1', port=5050)" &

sleep 2

echo "Starting Django via Gunicorn on 0.0.0.0:8000..."
exec gunicorn --bind 0.0.0.0:8000 --workers 2 --threads 4 djangoproj.wsgi:application
