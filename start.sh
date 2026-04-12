#!/usr/bin/env bash
set -e
docker compose up -d --build
echo "Recollect running at http://localhost:5000"