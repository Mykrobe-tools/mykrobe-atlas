export CURRENT_VERSION=`cat /var/go/releases/client/CURRENT_VERSION`
export PREVIOUS_VERSION=`cat /var/go/releases/client/PREVIOUS_VERSION`

# remove unwanted containers
cd /var/go/releases/client/$CURRENT_VERSION

# remove current images and containers
docker rm -f atlas-client || true
docker images -q --filter "dangling=true" | xargs --no-run-if-empty docker rmi

# provide environment variables to docker-compose and run it up
subber deploy/docker-compose.yml
docker-compose -f deploy/docker-compose.yml up -d

# generate bundle.js - find reason for lost environment variable
docker exec atlas-client bash -c 'yarn web-build'

# clean containers down
deploy/dkcleanup.sh

# remove the previous volumes
docker volume ls -qf dangling=true | xargs -r docker volume rm

# all ok set PREVIOUS_VERSION
echo $CURRENT_VERSION > /var/go/releases/client/PREVIOUS_VERSION
