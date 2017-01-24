# remove the failed deployment directory
CURRENT_VERSION=$(cat /var/go/releases/CURRENT_VERSION)
rm -R /var/go/releases/$CURRENT_VERSION

# remove the failed image
docker images | grep $CURRENT_VERSION | awk '{print $1}' | xargs --no-run-if-empty docker rmi

# work with the prior working version
PREVIOUS_VERSION=$(cat /var/go/releases/PREVIOUS_VERSION)
cd /var/go/releases/$PREVIOUS_VERSION

# remove current images
docker ps -a -q | xargs --no-run-if-empty docker rm -f 
docker images -q --filter "dangling=true" | xargs --no-run-if-empty docker rmi

# build the target container
docker-compose -f deploy/docker-compose.yml build

# provide environment variables to docker-compose and run it up
subber deploy/docker-compose.yml 
docker-compose -f deploy/docker-compose.yml up -d

# clean containers down
./dkcleanup.sh

# restart the reverse proxy
sudo service nginx restart