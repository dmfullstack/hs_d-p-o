#!/usr/bin/env sh

# Wait for MSSQl to be up before starting

set -e

echo "Starting to boot the app with MSSQl service"

host="localhost"
port="1433"
cmd="yarn start"

>&2 echo "MSSQL Server entrypoint..."
/opt/mssql/bin/sqlservr &

while ! nc -z $host $port; do sleep 2; done

>&2 echo "MSSQL Service is now up, will execute " $cmd

$cmd
