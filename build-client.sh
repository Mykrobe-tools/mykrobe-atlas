#!/bin/bash

export DEBUG_PRODUCTION=1
export API_DEBUG=1
export API_URL=http://api-dev.mykro.be
export GOOGLE_MAPS_API_KEY=AIzaSyAe_EWm97fTPHqzfRrhu2DVwO_iseBQkAc
export BOX_CLIENT_ID=uudga67zohcl0ttwzd38lc3orwumrppo
export DROPBOX_APP_KEY=sqvzeehijk0hx50
export GOOGLE_DRIVE_CLIENT_ID=780918371602-rqgivkfba07ko1vvu5h868eomc3edq6f.apps.googleusercontent.com
export GOOGLE_DRIVE_DEVELOPER_KEY=AIzaSyAGWxdeXCK_1_AGRWZlkoaH6gQCjfC-3pI
export ONEDRIVE_CLIENT_ID=e39a152d-61a5-4dbc-981c-95a0d0f23d9f
export AUTH_COOKIE_NAME=api-dev.mykro.be
export API_SWAGGER_URL=http://api-dev.mykro.be/swagger.json

#copy ssh keys
cp ~/.ssh/bitbucket-readonly .
cp ~/.ssh/atlas-jsonschema-readonly .

docker build --build-arg DEBUG_PRODUCTION --build-arg API_DEBUG --build-arg API_URL --build-arg ATLAS_APP --build-arg GOOGLE_MAPS_API_KEY --build-arg BOX_CLIENT_ID --build-arg DROPBOX_APP_KEY --build-arg GOOGLE_DRIVE_CLIENT_ID --build-arg GOOGLE_DRIVE_DEVELOPER_KEY --build-arg ONEDRIVE_CLIENT_ID --build-arg AUTH_COOKIE_NAME --build-arg API_SWAGGER_URL -t makeandship/atlas-client . -f deploy/ClientDockerfile

#remove ssh keys
rm bitbucket-readonly
rm atlas-jsonschema-readonly