#!/bin/bash
set -e

host="$1"
port="$2"
cmd="$3"

echo 'Inspecting ' $host $port

# This requires netcat
while ! nc -z $host $port; do sleep 3; done

>&2 echo "Service is now up, will execute " $cmd

$cmd
