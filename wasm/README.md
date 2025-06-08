# WebAssembly Files

This directory should contain the WebAssembly files required for CGM parsing:

- `cgmparse.wasm` - The compiled WebAssembly module
- `cgmparse.js` - The JavaScript wrapper (if needed)

## Setup

1. Copy the `cgmparse.wasm` file from your original project to this directory
2. If you have a JavaScript wrapper file, copy it as well
3. Ensure these files are served with the correct MIME types:
   - `.wasm` files should be served as `application/wasm`
   - `.js` files should be served as `application/javascript`

## Building from Source

If you need to rebuild the WebAssembly module:

1. Ensure you have Emscripten installed
2. Compile your C/C++ CGM parsing code with Emscripten
3. Use appropriate flags for web deployment

Example Emscripten command:
```bash
emcc cgmparse.c -o cgmparse.js \
  -s WASM=1 \
  -s EXPORTED_FUNCTIONS="['_sdi_printcgm', '_set_screen_dimensions', ...]" \
  -s EXTRA_EXPORTED_RUNTIME_METHODS="['cwrap', 'UTF8ToString']"
```

Note: Replace the exported functions list with the actual functions your CGM parser exports.