#/bin/bash

# 0 * * * * /var/lib/go-agent/pipelines/atlas-uat/deploy/cleanup.sh

export CURRENT_VERSION=`cat /var/go/releases/CURRENT_VERSION`
export PREVIOUS_VERSION=`cat /var/go/releases/PREVIOUS_VERSION`

for d in /var/go/releases/*/ ; do
        if [ "${d}" != "/var/go/releases/${CURRENT_VERSION}/" ] && [ "${d}" != "/var/go/releases/${PREVIOUS_VERSION}/" ]; then
        		echo "Removing: ${d}"
                rm -rf "${d}"
        fi
done