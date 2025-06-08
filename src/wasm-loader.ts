/**
 * WASM module loader utility
 */
export class WasmLoader {
  private static instance: any = null;
  private static isLoading = false;
  private static loadPromise: Promise<any> | null = null;

  static async loadModule(wasmPath: string): Promise<any> {
    if (this.instance) {
      return this.instance;
    }

    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = this.doLoadModule(wasmPath);
    
    try {
      this.instance = await this.loadPromise;
      return this.instance;
    } finally {
      this.isLoading = false;
      this.loadPromise = null;
    }
  }

  private static async doLoadModule(wasmPath: string): Promise<any> {
    // Load the WASM module
    const wasmBinary = await fetch(wasmPath).then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load WASM file: ${response.statusText}`);
      }
      return response.arrayBuffer();
    });

    // Create module instance
    const Module = {
      wasmBinary,
      onRuntimeInitialized: () => {},
      print: (text: string) => console.log(text),
      printErr: (text: string) => console.error(text),
    };

    return new Promise((resolve, reject) => {
      Module.onRuntimeInitialized = () => resolve(Module);
      
      // Initialize the module (this would depend on how the WASM is built)
      try {
        // This is a placeholder - actual implementation would depend on the WASM build
        (window as any).Module = Module;
        resolve(Module);
      } catch (error) {
        reject(error);
      }
    });
  }
}