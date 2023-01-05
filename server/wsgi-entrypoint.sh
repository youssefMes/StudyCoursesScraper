#!/bin/sh
until cd /srv/app
do
    echo "Waiting for server volume..."
done

until ./manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done

./manage.py collectstatic --noinput

gunicorn coursesscraper.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4
