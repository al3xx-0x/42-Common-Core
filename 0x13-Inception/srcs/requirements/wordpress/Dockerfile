FROM debian:11

RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y curl php php7.4-fpm php-mysql mariadb-client

# curl : A command-line tool used to transfer data to or from a server
# php7.4-fpm : (FastCGI Process Manager) is a PHP extension used to handle PHP requests efficiently
# php-mysql : A PHP extension that allows PHP to communicate with MySQL/MariaDB databases
# mariadb-client : A command-line client for interacting with MariaDB databases

COPY /tools/wordpress.sh /tools/wordpress.sh

RUN chmod +x /tools/wordpress.sh

RUN mkdir -p /var/www/wordpress

ENTRYPOINT ["./tools/wordpress.sh"]