#!/usr/bin/env bash
set -euo pipefail

read -r -p "GitHub username: " OWNER
read -r -p "Repository name (polynames): " NAME
read -r -p "Branch (gh-pages): " BRANCH
read -r -s -p "GitHub token: " TOKEN
echo

read -r -p "Back domain (eg: polynames.cloud): " VITE_BACK_DOMAIN
read -r -p "Back port (443): " VITE_BACK_PORT
read -r -p "WebSocket protocol (wss): " VITE_WEBSOCKET_PROTOCOL

rm -rf dist
npm run build

export GIT_CONFIG_COUNT=1
export GIT_CONFIG_KEY_0=http.extraheader
export GIT_CONFIG_VALUE_0="AUTHORIZATION: basic $(printf 'x-access-token:%s' "$TOKEN" | base64 | tr -d '\n')"

WORK="$(mktemp -d)"
cd "$WORK"

git init -q
git remote add origin "https://github.com/$OWNER/$NAME.git"

if git ls-remote --exit-code --heads origin "$BRANCH" > /dev/null; then
	git fetch -q --depth 1 origin "$BRANCH"
	git checkout -q -B "$BRANCH" FETCH_HEAD
else
	git checkout -q --orphan "$BRANCH"
fi

find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r /polynames/front/dist/. .
git add -A

if git diff --cached --quiet; then
	echo "Nothing to publish."
	exit 0
fi

git -c user.name=polynames-publish -c user.email=publish@polynames.invalid \
	commit -q -m "Publish front dist"
git push -q origin "HEAD:refs/heads/$BRANCH"

echo "Published to $OWNER/$NAME on branch $BRANCH."
