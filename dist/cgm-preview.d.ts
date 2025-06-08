export interface CGMPreviewOptions {
    width?: number;
    height?: number;
    format?: 'png' | 'jpeg' | 'webp';
    quality?: number;
    backgroundColor?: string;
}
export interface CGMPreviewResult {
    dataUrl: string;
    blob: Blob;
    width: number;
    height: number;
}
export declare class CGMPreview {
    private module;
    private canvas;
    private ctx;
    private isInitialized;
    private wasmPath;
    constructor(wasmPath?: string);
    /**
     * Initialize the CGM preview engine
     */
    initialize(): Promise<void>;
    /**
     * Convert a CGM file to an image
     */
    fileToImage(file: File, options?: CGMPreviewOptions): Promise<CGMPreviewResult>;
    /**
     * Convert CGM file from URL to image
     */
    urlToImage(url: string, options?: CGMPreviewOptions): Promise<CGMPreviewResult>;
    private loadWasmModule;
    private setupWasmFunctions;
    private setupCanvas;
    private readFileAsArrayBuffer;
    private processCGMFile;
    private generateImage;
    /**
     * Cleanup resources
     */
    dispose(): void;
}
export declare function cgmToImage(file: File, options?: CGMPreviewOptions): Promise<CGMPreviewResult>;
