#!/bin/sh -e

CUR_DIR="$(dirname ${BASH_SOURCE[0]})"
GPG_DIR="$CUR_DIR/third_party/gnupg"
DIST_DIR="$CUR_DIR/dist"
GPG_BIN="$GPG_DIR/g10/gpg"
DIST_SRV_PORT=8082

function transcode {
(
  cd "$GPG_DIR"

  git clean -dqxf

  emconfigure ./autogen.sh

  emconfigure ./configure --quiet \
      --disable-asm --disable-card-support --disable-agent-support \
      --disable-keyserver-helpers --disable-exec --disable-nls \
      --disable-threads --enable-static-rnd=linux \
      ac_cv_sizeof_unsigned_long=4 \
      CFLAGS=-O2

  patch config.h < config-h.emcc.patch

  emmake make -s -j8
)
}

if [ ! -f "$GPG_BIN" ]; then
  transcode
fi

if [ ! -f "$GPG_BIN" ]; then
  echo "emcc transcode failed"
  exit 1
fi

mkdir -p "$DIST_DIR"
cp "$GPG_BIN" "$DIST_DIR/gpg.bc"
echo "Building final gpg.js"
emcc -O2 -g1 -o "$DIST_DIR/gpg.js" "$DIST_DIR/gpg.bc" --pre-js "$CUR_DIR/gpg-pre.js"
rm -f "$DIST_DIR/gpg.bc"
cp "$CUR_DIR/index.html" "$DIST_DIR/"
cp "$CUR_DIR/gpg-worker.js" "$DIST_DIR/"

echo "Build successful, starting dev server"
(sleep 1 && python -m webbrowser "http://127.0.0.1:$DIST_SRV_PORT")&
(cd "$DIST_DIR"; python -m SimpleHTTPServer $DIST_SRV_PORT)
