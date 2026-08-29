#!/usr/bin/env bash
# Idempotent Cloud Agent install: prepares the Algorithm Visualizer web app and
# its companion backend `server` (a separate repo that supplies the algorithm
# catalog and the JavaScript tracer web worker the web app fetches at runtime).
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_DIR="${SERVER_DIR:-$HOME/algorithm-visualizer-server}"

echo "==> Installing web app dependencies"
cd "$REPO_DIR"
npm install

echo "==> Preparing backend server at $SERVER_DIR"
if [ ! -d "$SERVER_DIR/.git" ]; then
  git clone https://github.com/algorithm-visualizer/server.git "$SERVER_DIR"
else
  git -C "$SERVER_DIR" fetch origin master
  git -C "$SERVER_DIR" reset --hard origin/master
fi

cd "$SERVER_DIR"
npm install

# Dummy credentials keep the server runnable locally. GitHub sign-in and
# compiled-language (C++/Java) tracing are disabled, but browsing the algorithm
# catalog and JavaScript visualizations work fully.
if [ ! -f .env.local ]; then
  cat > .env.local <<'EOF'
GITHUB_CLIENT_ID = dummy
GITHUB_CLIENT_SECRET = dummy
AWS_ACCESS_KEY_ID = dummy
AWS_SECRET_ACCESS_KEY = dummy
EOF
fi

# The web app is served by Vite on port 3000, so the backend only needs to
# provide the /api endpoints. Seed a placeholder built-frontend directory so the
# server does not try to clone and build its own (legacy node-sass) copy of the
# web app on every boot.
mkdir -p public/frontend-built
if [ ! -f public/frontend-built/index.html ]; then
  echo '<!doctype html><title>Algorithm Visualizer API</title><p>API server. Open the web app at http://localhost:3000</p>' > public/frontend-built/index.html
fi

echo "==> Install complete"
