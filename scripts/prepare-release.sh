#!/bin/bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Ensure we're on main and up to date

CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "${RED}ERROR: Must be on main branch. Currently on: ${CURRENT_BRANCH}${NC}"
  exit 1
fi

# Ensure CHANGELOG.md is the only changed file

CHANGED_FILES=$(git diff --name-only HEAD)
STAGED_FILES=$(git diff --name-only --cached)
ALL_CHANGED=$(echo -e "${CHANGED_FILES}\n${STAGED_FILES}" | sort -u | sed '/^$/d')

if [ -z "$ALL_CHANGED" ]; then
  echo -e "${RED}ERROR: No changes found. Update CHANGELOG.md first.${NC}"
  exit 1
fi

if [ "$ALL_CHANGED" != "CHANGELOG.md" ]; then
  echo -e "${RED}ERROR: Only CHANGELOG.md should be changed. Found:${NC}"
  echo "$ALL_CHANGED"
  exit 1
fi

# Parse the two most recent version headers from CHANGELOG.md
 
VERSIONS=$(grep -oE '## \[[0-9]+\.[0-9]+\.[0-9]+' CHANGELOG.md | sed 's/## \[//' | head -2 || true)

LATEST=$(echo "$VERSIONS" | sed -n '1p')
PREVIOUS=$(echo "$VERSIONS" | sed -n '2p')


if [ -z "$LATEST" ]; then
  echo -e "${RED}ERROR: Could not parse latest version header from CHANGELOG.md${NC}"
  echo "Expected format: ## [x.y.z](url)"
  exit 1
fi

if [ -z "$PREVIOUS" ]; then
  echo -e "${RED}ERROR: Could not parse previous version header from CHANGELOG.md${NC}"
  echo "Expected format: ## [x.y.z](url)"
  exit 1
fi

echo "Latest changelog version:   $LATEST"
echo "Previous changelog version: $PREVIOUS"

CURRENT_PKG_VERSION=$(node -p "require('./package.json').version")
echo "Current package.json:       $CURRENT_PKG_VERSION"
echo ""

# Check if already released
 
if [ "$CURRENT_PKG_VERSION" = "$LATEST" ]; then
  echo -e "${RED}ERROR: package.json version ($CURRENT_PKG_VERSION) already matches latest changelog version ($LATEST)${NC}"
  echo "This version appears to already be released."
  exit 1
fi

# Check package.json matches previous changelog version
 
if [ "$CURRENT_PKG_VERSION" != "$PREVIOUS" ]; then
  echo -e "${RED}ERROR: package.json version ($CURRENT_PKG_VERSION) doesn't match previous changelog version ($PREVIOUS)${NC}"
  echo "The changelog history is inconsistent. Fix CHANGELOG.md first."
  exit 1
fi

# Determine version bump type
 
IFS='.' read -r PREV_MAJOR PREV_MINOR PREV_PATCH <<< "$PREVIOUS"
IFS='.' read -r NEXT_MAJOR NEXT_MINOR NEXT_PATCH <<< "$LATEST"

BUMP_TYPE=""

if [ "$NEXT_MAJOR" -eq $((PREV_MAJOR + 1)) ] && \
   [ "$NEXT_MINOR" -eq 0 ] && \
   [ "$NEXT_PATCH" -eq 0 ]; then
  BUMP_TYPE="major"
elif [ "$NEXT_MAJOR" -eq "$PREV_MAJOR" ] && \
     [ "$NEXT_MINOR" -eq $((PREV_MINOR + 1)) ] && \
     [ "$NEXT_PATCH" -eq 0 ]; then
  BUMP_TYPE="minor"
elif [ "$NEXT_MAJOR" -eq "$PREV_MAJOR" ] && \
     [ "$NEXT_MINOR" -eq "$PREV_MINOR" ] && \
     [ "$NEXT_PATCH" -eq $((PREV_PATCH + 1)) ]; then
  BUMP_TYPE="patch"
else
  echo -e "${RED}ERROR: Version jump $PREVIOUS -> $LATEST is not consecutive${NC}"
  echo ""
  echo "Valid transitions from $PREVIOUS:"
  echo "  patch: $PREV_MAJOR.$PREV_MINOR.$((PREV_PATCH + 1))"
  echo "  minor: $PREV_MAJOR.$((PREV_MINOR + 1)).0"
  echo "  major: $((PREV_MAJOR + 1)).0.0"
  exit 1
fi

echo -e "Detected bump type: ${GREEN}${BUMP_TYPE}${NC}"
echo -e "Will release:       ${GREEN}v${LATEST}${NC}"
echo ""

# Check if release branch already exists
 
BRANCH="release/v${LATEST}"

if git show-ref --verify --quiet "refs/heads/${BRANCH}" 2>/dev/null; then
  echo -e "${RED}ERROR: Local branch ${BRANCH} already exists${NC}"
  echo "Delete it with: git branch -D ${BRANCH}"
  exit 1
fi

if git ls-remote --exit-code --heads origin "${BRANCH}" &>/dev/null; then
  echo -e "${RED}ERROR: Remote branch ${BRANCH} already exists${NC}"
  echo "Delete it with: git push origin --delete ${BRANCH}"
  exit 1
fi

if git rev-parse "v${LATEST}" &>/dev/null; then
  echo -e "${RED}ERROR: Tag v${LATEST} already exists${NC}"
  exit 1
fi

read -p "Create release branch and PR for v${LATEST}? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
  echo "Aborted."
  exit 0
fi

# Ensure we're on main and up to date

echo "Rebasing the main branch with origin..."

git stash -q
git pull --rebase origin main -q
git stash pop -q

# Create release branch
git checkout -b "$BRANCH"

# Bump version without creating a tag
npm version "$BUMP_TYPE" --no-git-tag-version

# Commit
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: release v${LATEST}"

# Push
git push -u origin "$BRANCH"

# Switch back to main
git checkout main

REPO_URL=$(git remote get-url origin | sed 's/\.git$//' | sed 's|git@github.com:|https://github.com/|')
PR_URL="${REPO_URL}/compare/main...${BRANCH}?title=chore%3A+release+v${LATEST}&expand=1"

echo ""
echo -e "${GREEN}Release branch created and pushed.${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Open PR: ${PR_URL}"
echo "  2. Wait for CI to pass"
echo "  3. Merge the PR (use regular merge commit, not squash)"
echo "  4. npm publish and GitHub Release will happen automatically"