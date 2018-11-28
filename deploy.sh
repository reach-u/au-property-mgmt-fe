#!/usr/bin/env bash

host=au.reach-u.com
dockerImg=africaunion/au-property-mgmt-fe
containerName=au-property-mgmt-fe

conn=$host

npm install
npm run build
docker build -t $dockerImg .

ssh $conn -p 4122 "docker stop $containerName || true"
ssh $conn -p 4122 "docker rm $containerName || true"
ssh $conn -p 4122 "docker rmi $dockerImg || true"
docker save $dockerImg | ssh $host -p 4122 'docker load'
ssh $conn -p 4122 "docker run --name $containerName -td $dockerImg"
ssh $conn  -p 4122 "docker network connect au-network $containerName"