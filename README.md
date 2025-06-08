# CGM Preview

A JavaScript package for previewing CGM (Computer Graphics Metafile) files and converting them to images.

## Features

- Convert CGM files to PNG, JPEG, or WebP images
- Support for File objects and URLs
- Configurable output dimensions and quality
- WebAssembly-based CGM parsing for high performance
- TypeScript support

## Installation

```bash
npm install cgm-preview
```

## Usage

### Basic Usage

```javascript
import { cgmToImage } from 'cgm-preview';

// Convert a File object to image
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const result = await cgmToImage(file, {
        width: 800,
        height: 600,
        format: 'png'
      });
      
      // Use the result
      console.log('Image data URL:', result.dataUrl);
      console.log('Image blob:', result.blob);
      console.log('Dimensions:', result.width, 'x', result.height);
      
      // Display the image
      const img = document.createElement('img');
      img.src = result.dataUrl;
      document.body.appendChild(img);
    } catch (error) {
      console.error('Failed to convert CGM:', error);
    }
  }
});
```

### Advanced Usage with CGMPreview Class

```javascript
import { CGMPreview } from 'cgm-preview';

const preview = new CGMPreview('./path/to/cgmparse.wasm');

// Initialize once
await preview.initialize();

// Convert multiple files
const files = [file1, file2, file3];
const results = await Promise.all(
  files.map(file => preview.fileToImage(file, {
    width: 1200,
    height: 800,
    format: 'jpeg',
    quality: 0.8,
    backgroundColor: 'white'
  }))
);

// Convert from URL
const result = await preview.urlToImage('https://example.com/file.cgm');

// Cleanup when done
preview.dispose();
```

## API Reference

### cgmToImage(file, options?)

Convenience function to convert a single CGM file to an image.

**Parameters:**
- `file: File` - The CGM file to convert
- `options?: CGMPreviewOptions` - Conversion options

**Returns:** `Promise<CGMPreviewResult>`

### CGMPreview Class

#### Constructor

```javascript
new CGMPreview(wasmPath?: string)
```

**Parameters:**
- `wasmPath?: string` - Path to the WebAssembly module (default: './wasm/cgmparse.wasm')

#### Methods

##### initialize(): Promise<void>

Initialize the CGM preview engine. Must be called before using other methods.

##### fileToImage(file, options?): Promise<CGMPreviewResult>

Convert a File object to an image.

##### urlToImage(url, options?): Promise<CGMPreviewResult>

Convert a CGM file from URL to an image.

##### dispose(): void

Cleanup resources and remove canvas elements.

## Types

### CGMPreviewOptions

```typescript
interface CGMPreviewOptions {
  width?: number;        // Output width (default: 1680)
  height?: number;       // Output height (default: 1270)
  format?: 'png' | 'jpeg' | 'webp';  // Output format (default: 'png')
  quality?: number;      // Image quality 0-1 (default: 0.9)
  backgroundColor?: string;  // Background color (default: 'white')
}
```

### CGMPreviewResult

```typescript
interface CGMPreviewResult {
  dataUrl: string;       // Data URL of the generated image
  blob: Blob;           // Blob object of the generated image
  width: number;        // Actual width of the generated image
  height: number;       // Actual height of the generated image
}
```

## WebAssembly Module

This package requires a WebAssembly module for CGM parsing. You need to:

1. Copy the `cgmparse.wasm` file to your public directory
2. Ensure the WASM file is accessible via HTTP
3. Update the path in the constructor if needed

## Browser Support

- Modern browsers with WebAssembly support
- Canvas API support
- File API support

## License

MIT