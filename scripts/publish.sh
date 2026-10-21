#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

read -r -p "Dépôt GitHub (propriétaire/nom) : " REPO
read -r -p "Branche cible : " BRANCH
read -r -s -p "Personal access token : " PAT
echo

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"; unset PAT' EXIT

# Le PAT passe par la configuration git de l'environnement :
# il n'apparaît ni dans l'URL du remote, ni dans les arguments de commande.
export GIT_CONFIG_COUNT=1
export GIT_CONFIG_KEY_0=http.extraheader
GIT_CONFIG_VALUE_0="AUTHORIZATION: basic $(printf 'x-access-token:%s' "$PAT" | base64 | tr -d '\n')"
export GIT_CONFIG_VALUE_0

echo "→ Build de l'image front"
docker compose build front

echo "→ Extraction de dist-prod"
CID="$(docker create polynames-front)"
docker cp "$CID:/polynames/front/dist-prod" "$WORK/dist"
docker rm "$CID" > /dev/null

echo "→ Préparation de la branche $BRANCH"
git init -q "$WORK/repo"
cd "$WORK/repo"
git remote add origin "https://github.com/$REPO.git"

if git fetch -q --depth 1 origin "$BRANCH" 2> /dev/null; then
	git checkout -q -B "$BRANCH" FETCH_HEAD
else
	git checkout -q --orphan "$BRANCH"
fi

find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r "$WORK/dist/." .
git add -A

if git diff --cached --quiet; then
	echo "Rien à publier : la branche est déjà à jour."
	exit 0
fi

echo "→ Commit et push"
git -c user.name="${GIT_USER_NAME:-polynames-publish}" \
	-c user.email="${GIT_USER_EMAIL:-publish@polynames.invalid}" \
	commit -q -m "Publish front dist-prod $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -q origin "HEAD:refs/heads/$BRANCH"

echo "Publié sur $REPO, branche $BRANCH."
