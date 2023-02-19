# set base image
FROM python:3.7

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set work directory
WORKDIR /home/app/api

# install dependencies
COPY requirements.txt ./
RUN python3 -m pip install --upgrade pip setuptools
RUN pip install -r requirements.txt

# Copy project
COPY . ./

# initial setting
# RUN python3 manage.py migrate
# RUN python3 manage.py custom_createsuperuser --username ${sp_username} --password ${sp_password} --email ${sp_email}
RUN python3 manage.py collectstatic

# Expose application port
EXPOSE 8000
