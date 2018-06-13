#!/usr/bin/env sh

# Wait for MONGODB to be up before starting

set -e

mongod &

host="localhost"
port="27017"
cmd="yarn start"

echo 'Inspecting mongodb ' $host $port

>&2 echo "Staring MONGO in the background ..!"

sleep 20s

>&2 echo "MONGO Service is now up, will execute " $cmd

$cmd
