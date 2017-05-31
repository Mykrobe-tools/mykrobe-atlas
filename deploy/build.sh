#/bin/bash
set -e

export CURRENT_VERSION=`date +"%Y%m%d%H%M"`

echo $CURRENT_VERSION > /var/go/releases/client/CURRENT_VERSION

mkdir -p /var/go/releases/client/$CURRENT_VERSION
cd /var/go/releases/client/$CURRENT_VERSION

cp -rf /var/lib/go-agent/pipelines/${TARGET_ENVIRONMENT}-atlas/. .

# build the target container
subber deploy/docker-compose.yml
docker-compose -f deploy/docker-compose.yml build
