#!/usr/bin/env bash

# get the first param which will be
# the branch name. if not provided
# we'll default to main
BRANCH=${1:-main}

pscale connect ezquiz $BRANCH --port 3309