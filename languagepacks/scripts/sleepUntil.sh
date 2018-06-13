#!/usr/bin/env bash

set -e

sleepUntil="$1"
cmd="$2"

echo "Sleeping until: " $sleepUntil
sleep $sleepUntil

echo "Awake now, will execute " $cmd

$cmd
