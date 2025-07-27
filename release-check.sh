#!bin/bash

MAIN_BRANCH="main"
VERSION=$(jq -r '.version' package.json | tr -d '\n')
RELEASE_COMMIT_MESSAGE=$(git log )
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
BRANCH_AHEAD_BY=$(git rev-list --count origin/main..HEAD)
BRANCH_BEHIND_BY=$(git rev-list --count HEAD..origin/main)
HAS_CHANGE=$(git diff --quiet && git diff --quiet --staged && echo 0 || echo 1)

if [ $MAIN_BRANCH != $BRANCH_NAME ]
then
  echo 'ERROR: not main branch'
  exit 1
fi

if [ $BRANCH_AHEAD_BY != 0 ]
then
  echo "ERROR: current branch is ahead of remote by $BRANCH_AHEAD_BY commits"
  exit 1
fi

if [ $BRANCH_BEHIND_BY != 0 ]
then
  echo "ERROR: current branch is behind remote by $BRANCH_BEHIND_BY commits"
  exit 1
fi

if [ $BRANCH_BEHIND_BY != 0 ]
then
  echo "ERROR: current branch is behind remote by $BRANCH_BEHIND_BY commits"
  exit 1
fi

if [ $HAS_CHANGE != 0 ]
then
  echo "ERROR: found uncommited changes"
  exit 1
fi
