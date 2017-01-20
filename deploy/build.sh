#/bin/bash
set -e

export CURRENT_VERSION=`date +"%Y%m%d%H%M"`

echo $CURRENT_VERSION > /var/go/releases/CURRENT_VERSION

mkdir -p /var/go/releases/$CURRENT_VERSION
cd /var/go/releases/$CURRENT_VERSION

cp -rf /var/lib/go-agent/pipelines/${TARGET_ENVIRONMENT}-atlas/. .

# remove current images
docker ps -a -q | xargs --no-run-if-empty docker rm -f 
docker images -q --filter "dangling=true" | xargs --no-run-if-empty docker rmi

# build the target container
docker-compose -f deploy/docker-compose.yml build
