/**
 * Canvas rendering utilities for CGM preview
 */
export declare class CanvasRenderer {
    private canvas;
    private ctx;
    constructor(canvas: HTMLCanvasElement);
    setupTransforms(): void;
    setTextAttributes(fontName: string, fontSize: number, bold: boolean, hjust: number, vjust: number): void;
    private trackTransforms;
}
