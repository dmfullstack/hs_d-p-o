#!/usr/bin/env sh

# Wait for MySQL to be up before starting

set -e

host="localhost"
port="3306"
cmd="yarn start"

>&2 echo "Staring MySQL boot-up sequence in the background ..!"
/entrypoint.sh mysqld &

# echo 'Inspecting MySQL ' $host $port

sleep 20s

# while [ `telnet $host $port` ]
# do
  # >&2 echo "Service is unavailable - sleeping"
  # sleep 10s

>&2 echo "MySQL Service is now up, will execute " $cmd

$cmd
