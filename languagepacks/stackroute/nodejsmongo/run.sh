#!/usr/bin/env sh

# Wait for mongodb to be up before starting

set -e

mongod &

host="localhost"
port="27017"
cmd="yarn start"

echo 'Inspecting mongodb ' $host $port

until `telnet $host $port`; do
  >&2 echo "Service is unavailable - sleeping"
  sleep 10
done

>&2 echo "Mongodb Service is now up, will execute " $cmd

$cmd