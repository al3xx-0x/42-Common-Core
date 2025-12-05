FROM debian:11

RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y mariadb-server

COPY /tools/mariadb.sh /tools/mariadb.sh

RUN chmod +x /tools/mariadb.sh

ENTRYPOINT ["./tools/mariadb.sh"]