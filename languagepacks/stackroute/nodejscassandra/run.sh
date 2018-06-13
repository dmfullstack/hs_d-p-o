#!/usr/bin/env sh

set -e

cassandra -Rf &

host=$CASSANDRA_HOST
port=$CASSANDRA_PORT
cmd="npm start"
pingcmd="nc -vz $host $port"

echo 'Inspecting cassandra ' $host $port

while true
do
  ($pingcmd && echo "Cassandra Service is now up, will execute " $cmd && $cmd) \
  || (echo "Cassandra Service is unavailable - sleeping" && sleep 10)
done