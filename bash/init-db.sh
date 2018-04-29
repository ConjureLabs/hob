#! /bin/bash
# This initializes the local Postgres with needed fixtures
# assumes it is running from the project's root dir

if [ "$NODE_ENV" = "production" ]; then
  exit 1;
fi

username=$1
filename=$2

cd ./sql/;
psql postgres --username=$username -w --file="$filename" --quiet;
