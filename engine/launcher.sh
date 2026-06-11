#!/usr/bin/env bash
set -e

# Load environment from .env if available
if [ -f "$(dirname "$0")/.env" ]; then
  set -o allexport
  source "$(dirname "$0")/.env"
  set +o allexport
fi

node "$(dirname "$0")/main.js"
