#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:?Usage: extract-changelog.sh <version>}"

awk "
  /^## \[${VERSION}\]/ { found=1; next }
  /^## \[/             { if (found) exit }
  found                { print }
" CHANGELOG.md