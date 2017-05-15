#/bin/bash

# 0 * * * * /var/lib/go-agent/pipelines/atlas-uat/deploy/cleanup.sh

export CLIENT_CURRENT_VERSION=`cat /var/go/releases/client/CURRENT_VERSION`
export CLIENT_PREVIOUS_VERSION=`cat /var/go/releases/client/PREVIOUS_VERSION`
export SERVER_CURRENT_VERSION=`cat /var/go/releases/server/CURRENT_VERSION`
export SERVER_PREVIOUS_VERSION=`cat /var/go/releases/server/PREVIOUS_VERSION`

for d in /var/go/releases/client/*/ ; do
        if [ "${d}" != "/var/go/releases/client/${CLIENT_CURRENT_VERSION}/" ] && [ "${d}" != "/var/go/releases/client/${CLIENT_PREVIOUS_VERSION}/" ]; then
        		echo "Removing: ${d}"
                rm -rf "${d}"
        fi
done

for d in /var/go/releases/server/*/ ; do
        if [ "${d}" != "/var/go/releases/client/${SERVER_CURRENT_VERSION}/" ] && [ "${d}" != "/var/go/releases/client/${SERVER_PREVIOUS_VERSION}/" ]; then
        		echo "Removing: ${d}"
                rm -rf "${d}"
        fi
done