#!/bin/bash

SENTRY_AUTH_TOKEN=$(cat /workspace/sentry-auth-token.txt)
SHORT_SHA=$SHORT_SHA SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN SENTRY_PROJECT=$SENTRY_PROJECT SENTRY_ORG=$SENTRY_ORG yarn web-build