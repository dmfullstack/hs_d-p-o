#!/usr/bin/env sh

# Wait for MySQL to be up before starting

set -e

echo "Starting to boot the app wit MySQL service"

host="localhost"
port="3306"
cmd="yarn start"

# Removing these files, so that mysql DB init process itself creates them
rm -rf /var/lib/mysql

# Remove the config file silently, if it does not exist, don't make noise
rm -f /etc/mysql/my.cnf

# Creating this folder, so that mysqld can create its lock files without any issue
mkdir -p /var/run/mysqld/
chown -R mysql:mysql /var/run/mysqld/

>&2 echo "Staring MySQL boot-up sequence in the background ..!"
/entrypoint.sh mysqld --skip-external-locking --user=mysql &

# echo 'Inspecting MySQL ' $host $port

sleep 20s

# while [ `telnet $host $port` ]
# do
  # >&2 echo "Service is unavailable - sleeping"
  # sleep 10s

>&2 echo "MySQL Service is now up, will execute " $cmd

$cmd
