#!/usr/bin/env bash
# Token-free customer IPA deployment. Download via connected GitHub artifact tool,
# transfer IPA to 114, then pass its trusted SHA256. Default only validates.
set -euo pipefail
exec python3 "$(dirname "$0")/deploy_ipa.py" "$@"
