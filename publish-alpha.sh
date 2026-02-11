#!/bin/bash
set -euo pipefail

CURRENT_VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME=$(node -p "require('./package.json').name")
echo "Current version: $CURRENT_VERSION"

read -p "Target version: " TARGET_VERSION

ALPHA_VERSION="${TARGET_VERSION}-alpha.$(date +%s)"
echo "Publishing ${PACKAGE_NAME}@${ALPHA_VERSION}"

# Temporarily set version without git commit
npm version "$ALPHA_VERSION" --no-git-tag-version

cleanup() {
    npm version "$CURRENT_VERSION" --no-git-tag-version
}

# Restore original version on success or failure
trap cleanup EXIT

npm run build
npm publish --tag alpha

cat <<EOF
Install with:
  npm install $PACKAGE_NAME@${ALPHA_VERSION}

EOF