#!/usr/bin/env bash
set -euo pipefail

# Run inside the front container:
#   docker compose run --rm -it --no-deps --entrypoint bash front scripts/publish.sh

read -r -p "GitHub username: " OWNER
read -r -p "Repository name: " NAME
read -r -p "Branch: " BRANCH
read -r -s -p "GitHub token: " TOKEN
echo

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
cp -r /polynames/front/dist-prod/. .
git add -A

if git diff --cached --quiet; then
	echo "Nothing to publish."
	exit 0
fi

git -c user.name=polynames-publish -c user.email=publish@polynames.invalid \
	commit -q -m "Publish front dist-prod"
git push -q origin "HEAD:refs/heads/$BRANCH"

echo "Published to $OWNER/$NAME on branch $BRANCH."
