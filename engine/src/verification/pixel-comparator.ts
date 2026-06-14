import { createCanvas, loadImage } from "canvas";

export interface PixelComparisonOptions {
  threshold?: number; // 0-1, default 0.1 (10% difference)
  ignoreRegions?: Array<{ x: number; y: number; width: number; height: number }>;
  generateDiffImage?: boolean;
}

export interface PixelComparisonResult {
  similarity: number; // 0-1
  diffPercentage: number;
  boundingBoxes: Array<{ x: number; y: number; width: number; height: number }>;
  diffImage?: Buffer;
  passed: boolean;
  details: {
    totalPixels: number;
    differentPixels: number;
    maxChannelDiff: number;
  };
}

/**
 * Pixel Comparison - Step 2 of the visual verification pipeline
 * Fast pixel-level comparison for detecting UI regressions, missing elements, and broken layouts
 */
export class PixelComparator {
  private options: PixelComparisonOptions;

  constructor(options: PixelComparisonOptions = {}) {
    this.options = {
      threshold: 0.1,
      generateDiffImage: true,
      ...options,
    };
  }

  /**
   * Compare two screenshot buffers pixel by pixel
   */
  async compare(screenshotA: Buffer, screenshotB: Buffer): Promise<PixelComparisonResult> {
    const [imageA, imageB] = await Promise.all([loadImage(screenshotA), loadImage(screenshotB)]);

    const width = Math.max(imageA.width, imageB.width);
    const height = Math.max(imageA.height, imageB.height);

    const canvasA = createCanvas(width, height);
    const ctxA = canvasA.getContext("2d");
    ctxA.drawImage(imageA, 0, 0, width, height);

    const canvasB = createCanvas(width, height);
    const ctxB = canvasB.getContext("2d");
    ctxB.drawImage(imageB, 0, 0, width, height);

    const imageDataA = ctxA.getImageData(0, 0, width, height);
    const imageDataB = ctxB.getImageData(0, 0, width, height);

    const dataA = imageDataA.data;
    const dataB = imageDataB.data;

    let differentPixels = 0;
    let maxChannelDiff = 0;
    const diffMask = new Uint8Array(width * height);

    for (let i = 0; i < dataA.length; i += 4) {
      const pixelIndex = i / 4;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);

      // Skip ignored regions
      if (this.isIgnoredRegion(x, y)) {
        continue;
      }

      const rDiff = Math.abs(dataA[i] - dataB[i]);
      const gDiff = Math.abs(dataA[i + 1] - dataB[i + 1]);
      const bDiff = Math.abs(dataA[i + 2] - dataB[i + 2]);
      const aDiff = Math.abs(dataA[i + 3] - dataB[i + 3]);

      const totalDiff = rDiff + gDiff + bDiff + aDiff;
      const maxDiff = Math.max(rDiff, gDiff, bDiff, aDiff);

      if (maxDiff > maxChannelDiff) {
        maxChannelDiff = maxDiff;
      }

      // Threshold for considering pixels different
      if (totalDiff > 12) {
        differentPixels++;
        diffMask[pixelIndex] = 1;
      }
    }

    const totalPixels = width * height;
    const diffPercentage = differentPixels / totalPixels;
    const similarity = 1 - diffPercentage;
    const passed = diffPercentage <= (this.options.threshold || 0.1);

    // Find bounding boxes of differences
    const boundingBoxes = this.findBoundingBoxes(diffMask, width, height);

    let diffImage: Buffer | undefined;
    if (this.options.generateDiffImage) {
      diffImage = this.generateDiffImage(dataA, dataB, diffMask, width, height);
    }

    return {
      similarity,
      diffPercentage,
      boundingBoxes,
      diffImage,
      passed,
      details: {
        totalPixels,
        differentPixels,
        maxChannelDiff,
      },
    };
  }

  private isIgnoredRegion(x: number, y: number): boolean {
    if (!this.options.ignoreRegions) return false;
    return this.options.ignoreRegions.some(
      (region) => x >= region.x && x < region.x + region.width && y >= region.y && y < region.y + region.height
    );
  }

  private findBoundingBoxes(diffMask: Uint8Array, width: number, height: number): Array<{ x: number; y: number; width: number; height: number }> {
    const boxes: Array<{ x: number; y: number; width: number; height: number }> = [];
    const visited = new Uint8Array(width * height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (diffMask[idx] === 1 && visited[idx] === 0) {
          const box = this.floodFill(diffMask, visited, x, y, width, height);
          if (box.width > 5 && box.height > 5) {
            boxes.push(box);
          }
        }
      }
    }

    return boxes;
  }

  private floodFill(diffMask: Uint8Array, visited: Uint8Array, startX: number, startY: number, width: number, height: number): { x: number; y: number; width: number; height: number } {
    let minX = startX,
      maxX = startX,
      minY = startY,
      maxY = startY;
    const stack: Array<[number, number]> = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const idx = y * width + x;

      if (x < 0 || x >= width || y < 0 || y >= height || visited[idx] === 1 || diffMask[idx] === 0) {
        continue;
      }

      visited[idx] = 1;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    };
  }

  private generateDiffImage(dataA: Uint8ClampedArray, dataB: Uint8ClampedArray, diffMask: Uint8Array, width: number, height: number): Buffer {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < dataA.length; i += 4) {
      const pixelIndex = i / 4;
      if (diffMask[pixelIndex] === 1) {
        // Red for differences
        data[i] = 255;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 255;
      } else {
        // Semi-transparent original
        data[i] = dataA[i];
        data[i + 1] = dataA[i + 1];
        data[i + 2] = dataA[i + 2];
        data[i + 3] = 128;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toBuffer("image/png");
  }
}

export default PixelComparator;
