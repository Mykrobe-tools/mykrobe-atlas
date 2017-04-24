# remove the failed deployment directory
CURRENT_VERSION=$(cat /var/go/releases/client/CURRENT_VERSION)
rm -R /var/go/releases/client/$CURRENT_VERSION

# remove the failed image
docker images | grep $CURRENT_VERSION | awk '{print $1}' | xargs --no-run-if-empty docker rmi

# work with the prior working version
PREVIOUS_VERSION=$(cat /var/go/releases/client/PREVIOUS_VERSION)
cd /var/go/releases/client/$PREVIOUS_VERSION

# remove current images
docker rm -f atlas-client || true
docker images -q --filter "dangling=true" | xargs --no-run-if-empty docker rmi

# build the target container
docker-compose -f deploy/docker-compose.yml build

# provide environment variables to docker-compose and run it up
subber deploy/docker-compose.yml 
docker-compose -f deploy/docker-compose.yml up -d

# clean containers down
./dkcleanup.sh