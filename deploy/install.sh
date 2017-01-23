export CURRENT_VERSION=`cat /var/go/releases/CURRENT_VERSION`
export PREVIOUS_VERSION=`cat /var/go/releases/PREVIOUS_VERSION`

# remove unwanted containers
docker ps -a -q | xargs --no-run-if-empty docker rm -f	
cd /var/go/releases/$CURRENT_VERSION

# provide environment variables to docker-compose and run it up
subber deploy/docker-compose.yml 
docker-compose -f deploy/docker-compose.yml up -d

# clean containers down
dkcleanup.sh

# restart the reverse proxy
sudo service nginx restart

# remove the previous image
docker images | grep $PREVIOUS_VERSION | awk '{print $1}' | xargs docker rmi

# all ok set PREVIOUS_VERSION
echo $CURRENT_VERSION > /var/go/releases/PREVIOUS_VERSION