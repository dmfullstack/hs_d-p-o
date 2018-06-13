#!/usr/bin/env sh

set -e

host="localhost"
port="3306"
cmd="yarn start"

>&2 echo "Staring MySQL boot-up sequence in the background ..!"
/entrypoint.sh mysqld &

echo 'Inspecting ' $host $port

until $(telnet $host $port); do
	>&2 echo "MySQL Service not Available yet - trying"
	sleep 5
done

>&2 echo "MySQL Service is working! Yippie!"

sleep 1

exec $cmd

