#!/usr/bin/env bash
SCRIPT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
echo "Fetching the latest laji-cli tools"
docker pull luomus/laji-cli >/dev/null 2>&1
echo "Sending LoLIFE to crowdin"
docker run --rm --env-file ${SCRIPT_PATH}/.env -v ${SCRIPT_PATH}/../src/languages/translations:/data luomus/laji-cli \
  crowdin:send:json LOLIFE \
  fi:/data/fi.json  \
  en-GB:/data/en.json \
  sv-FI:/data/sv.json