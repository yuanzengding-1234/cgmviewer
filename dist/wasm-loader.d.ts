/**
 * WASM module loader utility
 */
export declare class WasmLoader {
    private static instance;
    private static isLoading;
    private static loadPromise;
    static loadModule(wasmPath: string): Promise<any>;
    private static doLoadModule;
}
