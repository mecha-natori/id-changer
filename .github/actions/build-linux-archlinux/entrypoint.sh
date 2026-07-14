#!/usr/bin/env bash
# shellcheck disable=SC2024
set -euo pipefail
sudo -u builder bash <<EOCMD
    gpg \
        --batch \
        --import \
        --no-tty \
        --passphrase-fd 3 \
        --pinentry-mode loopback \
        --yes \
        <<<"$INPUT_GPG_PRIVATE_KEY" \
        3<<<"$INPUT_GPG_PRIVATE_KEY_PASSPHRASE"
EOCMD
sudo -u builder bash -c \
    'printf "allow-preset-passphrase\n" >>"$HOME/.gnupg/gpg-agent.conf"'
sudo -u builder gpgconf --kill gpg-agent
sudo -u builder gpg-connect-agent /bye >/dev/null
sudo -u builder /usr/lib/gnupg/gpg-preset-passphrase \
    --preset \
    -P "$INPUT_GPG_PRIVATE_KEY_PASSPHRASE" \
    "$INPUT_GPG_SIGN_KEY_KEYGRIP"
BASE_DIR=$PWD
tmpdir=$(mktemp -d)
mpcfg=$tmpdir/${INPUT_MAKEPKGCONF:-makepkg.conf}
cp -r "${INPUT_PKGDIR:-.}/"* "$tmpdir"
chown -R builder "$tmpdir"
cd "$tmpdir"
sudo -u builder makepkg \
    --config "$mpcfg" \
    --key "$INPUT_GPG_SIGN_KEY!" \
    --sign \
    --syncdeps
mkdir "$BASE_DIR/out"
cp ./*.tar.* "$BASE_DIR/out/"
cd "$BASE_DIR"
rm -rf "$tmpdir"
echo "version=$(yq .package.version ./src-tauri/Cargo.toml)" >>"$GITHUB_OUTPUT"
