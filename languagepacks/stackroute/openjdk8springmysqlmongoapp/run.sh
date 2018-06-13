#!/usr/bin/env sh

# Wait for MONGODB to be up before starting

set -e

# Mongo Will kickoff => MySQK, will kick off  => NodeS Agent
# exec ./runMongo.sh

mongod &
>&2 echo "Staring MONGO in the background ..!"
sleep 20s

host="localhost"
port="27017"
cmd="yarn start"

#echo 'Inspecting mongodb ' $host $port

>&2 echo "Staring MySQL boot-up sequence in the background ..!"
#like mongodb is needed to check wheather it is up or not ?
/entrypoint.sh mysqld &

sleep 20s

>&2 echo "Done waiting for MONGO & MySQL Services to be up, executing command " $cmd

$cmd
