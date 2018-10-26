#!/usr/bin/env bash

host=au.reach-u.com
dockerImg=au-property-mgmt-fe

conn=$host

npm install
npm run build
docker build -t $dockerImg .

ssh $conn -p 4122 "docker stop $dockerImg || true"
ssh $conn -p 4122 "docker rm $dockerImg || true"
ssh $conn -p 4122 "docker rmi $dockerImg || true"
docker save $dockerImg | ssh $host -p 4122 'docker load'
ssh $conn -p 4122 "docker run --name $dockerImg -td $dockerImg"
ssh $conn  -p 4122 "docker network connect au-network $dockerImg"