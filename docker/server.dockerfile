FROM python:3-onbuild

MAINTAINER Aaron W Brown - aaronwbrown13@gmail.com

COPY . var/www

WORKDIR var/www

RUN #python stuff goes here

EXPOSE 4568

ENTRYPOINT ["python" "/dir here"]