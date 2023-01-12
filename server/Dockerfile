FROM python:3.11.1-buster
RUN apt update
RUN apt-get install cron -y
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /srv/app
RUN pip install --upgrade pip
COPY requirements.txt /srv/app/
RUN pip install -r requirements.txt
COPY . .