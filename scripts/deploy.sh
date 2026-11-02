#!/usr/bin/env bash
# Build the back Docker image and push it to a registry.
set -euo pipefail

read -r -p "Registry (<registry>/namespace/image:tag) : " REGISTRY
read -r -p "Namespace (registry/<namespace>/image:tag) : " IMAGE_NAMESPACE
read -r -p "Image (registry/namespace/<image>:tag) : " IMAGE_NAME
read -r -p "Tag (registry/namespace/image:<tag>) : " TAG

IMAGE="$REGISTRY/$IMAGE_NAMESPACE/$IMAGE_NAME:$TAG"

read -r -s -p "Registry secret key : " REGISTRY_SECRET_KEY
echo

docker pull node:slim
docker pull node
docker pull node:alpine
docker compose build --pull --no-cache front back
docker tag polynames-back "$IMAGE"

# The registry authenticates with the secret key only: the username is a fixed placeholder.
echo "$REGISTRY_SECRET_KEY" | docker login "$REGISTRY/$IMAGE_NAMESPACE" -u nologin --password-stdin
trap 'docker logout "$REGISTRY/$IMAGE_NAMESPACE"' EXIT

docker push "$IMAGE"

echo "Back published: $IMAGE"

docker compose run front bash ./scripts/publish.sh

