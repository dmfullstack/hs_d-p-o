#!/usr/bin/env sh

set -e

mongod &

host="localhost"
port="27017"
cmd="exec ./runMySQL.sh"

echo 'Inspecting' $host $port

until $(telnet $host $port); do
	>&2 echo "Mongod Service not Available yet - trying"
	sleep 5
done

>&2 echo "Mongod Service is working! Yippie!"

sleep 1

exec $cmd