#!/usr/bin/env bash
# shellcheck disable=SC2024
set -euo pipefail
BASE_DIR=$PWD
tmpdir=$(mktemp -d)
cp -r "${INPUT_PKGDIR:-.}/"* "$tmpdir"
chown -R builder "$tmpdir"
cd "$tmpdir"
sudo -u builder makepkg \
    --config \
    "${INPUT_MAKEPKGCONF:+"$BASE_DIR/"}${INPUT_MAKEPKGCONF:-makepkg.conf}" \
    --printsrcinfo >.SRCINFO
mv .SRCINFO "$BASE_DIR/${INPUT_PKGDIR:-.}/"
cd "$BASE_DIR"
rm -rf "$tmpdir"
