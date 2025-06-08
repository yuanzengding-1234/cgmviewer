(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.CGMPreview = {}));
})(this, (function (exports) { 'use strict';

    class CGMPreview {
        constructor(wasmPath = './wasm/cgmparse.wasm') {
            this.module = null;
            this.isInitialized = false;
            this.wasmPath = wasmPath;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
        }
        /**
         * Initialize the CGM preview engine
         */
        async initialize() {
            if (this.isInitialized)
                return;
            try {
                // Load the WebAssembly module
                this.module = await this.loadWasmModule();
                this.setupWasmFunctions();
                this.isInitialized = true;
            }
            catch (error) {
                throw new Error(`Failed to initialize CGM preview: ${error}`);
            }
        }
        /**
         * Convert a CGM file to an image
         */
        async fileToImage(file, options = {}) {
            if (!this.isInitialized) {
                await this.initialize();
            }
            const { width = 1680, height = 1270, format = 'png', quality = 0.9, backgroundColor = 'white' } = options;
            try {
                // Read file as ArrayBuffer
                const arrayBuffer = await this.readFileAsArrayBuffer(file);
                // Setup canvas
                this.setupCanvas(width, height, backgroundColor);
                // Process CGM file
                await this.processCGMFile(arrayBuffer);
                // Generate image
                return this.generateImage(format, quality);
            }
            catch (error) {
                throw new Error(`Failed to convert CGM file: ${error}`);
            }
        }
        /**
         * Convert CGM file from URL to image
         */
        async urlToImage(url, options = {}) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch CGM file: ${response.statusText}`);
                }
                const blob = await response.blob();
                const file = new File([blob], 'cgm-file.cgm', { type: 'application/octet-stream' });
                return this.fileToImage(file, options);
            }
            catch (error) {
                throw new Error(`Failed to load CGM from URL: ${error}`);
            }
        }
        async loadWasmModule() {
            // This would need to be adapted based on how the WASM module is built
            // For now, we'll assume it's available globally or needs to be loaded
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = this.wasmPath.replace('.wasm', '.js');
                script.onload = () => {
                    // Assuming the module is available as a global
                    if (typeof Module !== 'undefined') {
                        resolve(Module);
                    }
                    else {
                        reject(new Error('WASM module not found'));
                    }
                };
                script.onerror = () => reject(new Error('Failed to load WASM module'));
                document.head.appendChild(script);
            });
        }
        setupWasmFunctions() {
            // Setup WASM function bindings based on the original code
            this.module.sdi_printcgm = this.module.cwrap('sdi_printcgm', 'number', ['number', 'number', 'number', 'number', 'number', 'number']);
            this.module.set_screen_dimensions = this.module.cwrap('set_screen_dimensions', 'number', ['number', 'number']);
            this.module.wasm_set_viewport = this.module.cwrap('wasm_set_viewport', 'number', ['number', 'number', 'number', 'number']);
            this.module.sdi_set_picture = this.module.cwrap('sdi_set_picture', 'number', ['number']);
            this.module.set_fit_transform = this.module.cwrap('set_fit_transform', 'number', ['number', 'number']);
            this.module.getvdcX = this.module.cwrap('getvdcX', 'number', ['number', 'number']);
            this.module.getvdcY = this.module.cwrap('getvdcY', 'number', ['number', 'number']);
        }
        setupCanvas(width, height, backgroundColor) {
            this.canvas.width = width;
            this.canvas.height = height;
            // Set background
            this.ctx.fillStyle = backgroundColor;
            this.ctx.fillRect(0, 0, width, height);
            // Setup transformation matrix similar to original code
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.scale(0.1, 0.1);
        }
        async readFileAsArrayBuffer(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);
                reader.readAsArrayBuffer(file);
            });
        }
        async processCGMFile(arrayBuffer) {
            const uint8Array = new Uint8Array(arrayBuffer);
            const size = uint8Array.length;
            // Allocate memory in WASM
            const ptr = this.module._malloc(size);
            this.module.HEAP8.set(uint8Array, ptr);
            try {
                // Setup screen dimensions
                const screenWidth = this.canvas.width * 10;
                const screenHeight = this.canvas.height * 10;
                this.module.set_screen_dimensions(screenWidth, screenHeight);
                // Set picture mode
                this.module.sdi_set_picture(1);
                // Set fit transform
                this.module.set_fit_transform(10000, 10000);
                // Process the CGM file
                const status = this.module.sdi_printcgm(ptr, size, 0, 0, 0, 1);
                if (status !== 0) {
                    throw new Error(`CGM processing failed with status: ${status}`);
                }
            }
            finally {
                // Free allocated memory
                this.module._free(ptr);
            }
        }
        generateImage(format, quality) {
            const mimeType = `image/${format}`;
            const dataUrl = this.canvas.toDataURL(mimeType, quality);
            // Convert to blob
            return new Promise((resolve) => {
                this.canvas.toBlob((blob) => {
                    resolve({
                        dataUrl,
                        blob: blob,
                        width: this.canvas.width,
                        height: this.canvas.height
                    });
                }, mimeType, quality);
            }); // Type assertion for simplicity
        }
        /**
         * Cleanup resources
         */
        dispose() {
            this.canvas.remove();
            this.isInitialized = false;
        }
    }
    // Export convenience function
    async function cgmToImage(file, options = {}) {
        const preview = new CGMPreview();
        try {
            return await preview.fileToImage(file, options);
        }
        finally {
            preview.dispose();
        }
    }

    exports.CGMPreview = CGMPreview;
    exports.cgmToImage = cgmToImage;

}));
//# sourceMappingURL=cgm-preview.js.map
