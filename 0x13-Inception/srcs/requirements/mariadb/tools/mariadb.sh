#!/bin/bash

service mariadb start

sleep 5

MARIADB_PW=$(cat /run/secrets/db_user_pass)
MARIADB_R_PW=$(cat /run/secrets/db_root_pass)

mariadb -u root <<EOF
CREATE DATABASE IF NOT EXISTS $MARIADB_NM;
CREATE USER IF NOT EXISTS $MARIADB_USER@'%' IDENTIFIED BY '$MARIADB_PW';
GRANT ALL PRIVILEGES ON ${MARIADB_NM}.* TO $MARIADB_USER@'%';
FLUSH PRIVILEGES;
EOF

#CREATE DATABASE IF NOT EXISTS $MARIADB_NM;
#means "create a new database with the name stored in the variable $MARIADB_NM, but only if it doesn’t already exist."

#CREATE USER IF NOT EXISTS $MARIADB_USER@'%' IDENTIFIED BY '$MARIADB_PW';
#Create a new user with the username stored in $MARIADB_USER
#Allow this user to connect from any location ('%' means "anywhere").
#set the user’s password to the value stored in $MARIADB_PW

#GRANT ALL PRIVILEGES ON ${MARIADB_NM}.* TO $MARIADB_USER@'%';
#Give the user full control (all privileges) over the database (${MARIADB_NM}.* means "all tables in the database").

#FLUSH PRIVILEGES;
#means "save and apply the changes we just made."


mysqladmin -u root -p$MARIADB_R_PW shutdown
#This command is used to shut down (stop) the MariaDB server.

exec mysqld_safe --bind-address=0.0.0.0
#start mariadb server in a safe mode and accept connections from any IP address