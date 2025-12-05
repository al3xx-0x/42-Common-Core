#!/bin/bash

MARIADB_PW=$(cat /run/secrets/db_user_pass)
ADMIN_PASS=$(cat /run/secrets/wp_admin_pass)
NUSER_PASS=$(cat /run/secrets/wp_user_pass)

sleep 10

curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

chmod +x wp-cli.phar

mv wp-cli.phar /usr/local/bin/wp

cd /var/www/wordpress

chmod -R 755 /var/www/wordpress/

chown -R www-data:www-data /var/www/wordpress
# Changes the ownership of the entire WordPress directory to the user www-data,
# which is the default user for web servers (like Apache or Nginx).
# This ensures the web server can manage WordPress files properly

wp core download --allow-root --path=/var/www/wordpress
# This is a WP-CLI command that downloads the WordPress core files
# (like index.php, wp-config-sample.php, and other necessary WordPress files)
# The --allow-root flag allows the command to run as the root user (useful in Docker containers)

wp core config --dbname=$MARIADB_NM --dbuser=$MARIADB_USER --dbpass=$MARIADB_PW --dbhost=mariadb:3306 --allow-root --path=/var/www/wordpress
# Creates the wp-config.php file that contains database connection settings for WordPress

wp core install --url=$DOMAIN --title=$WEBSITE_NAME --admin_user=$ADMIN_NAME --admin_password=$ADMIN_PASS --admin_email=$ADMIN_EMAIL --skip-email --allow-root --path=/var/www/wordpress
# wp core install → Installs WordPress.
# --url=$DOMAIN → Sets the website URL (like example.com).
# --title=$WEBSITE_NAME → Sets the website title (like "My Blog").
# --admin_user=$ADMIN_NAME → Creates the admin user (like "admin").
# --admin_password=$ADMIN_PASS → Sets the admin password.
# --admin_email=$ADMIN_EMAIL → Sets the admin email.
# --skip-email → Prevents WordPress from sending an email confirmation.
# --allow-root → Allows running the command as the root user (needed in Docker).
# --path=/var/www/wordpress → Runs the command in this directory (/var/www/wordpress),

wp user create $NUSER_NAME $NUSER_EMAIL --role=author --user_pass=$NUSER_PASS --allow-root --path=/var/www/wordpress
# wp user create → Creates a new WordPress user.
# $NUSER_NAME → The username of the new user.
# $NUSER_EMAIL → The email of the new user.
# --role=author → Assigns the "author" role (can write and publish posts but not change settings).
# --user_pass=$NUSER_PASS → Sets the password for the new user.
# --allow-root → Allows running the command as root (needed inside Docker).
# --path=/var/www/wordpress → Runs the command inside the WordPress directory (/var/www/wordpress).

wp theme install lowfi --activate --allow-root
# wp theme install lowfi → Downloads and installs the "Lowfi" theme from the WordPress theme repository.
# --activate → Activates the theme immediately after installation.
# --allow-root → Allows running the command as root (needed in Docker or when running as the root user).

sed -i 's#listen = /run/php/php7.4-fpm.sock#listen = 0.0.0.0:9000#' /etc/php/7.4/fpm/pool.d/www.conf
# 's#listen = /run/php/php7.4-fpm.sock#listen = 0.0.0.0:9000#'
# s#OLD#NEW# → Replaces OLD with NEW
#Old value: listen = /run/php/php7.4-fpm.sock
# New value: listen = 0.0.0.0:9000
# /etc/php/7.4/fpm/pool.d/www.conf
# The file where the replacement happens.

service php7.4-fpm restart

mkdir -p /run/php
# The /run/php directory is needed for PHP-FPM to store runtime files
/usr/sbin/php-fpm7.4 -F
# Starts the PHP FastCGI Process Manager (PHP-FPM) version 7.4.
# The -F flag runs PHP-FPM in the foreground, meaning: It does not detach from the terminal.
