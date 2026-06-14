import { createCanvas, loadImage } from "canvas";

export interface SSIMOptions {
  windowSize?: number;
  k1?: number;
  k2?: number;
  bitDepth?: number;
}

export interface SSIMResult {
  ssimIndex: number; // -1 to 1, where 1 is identical
  similarity: number; // 0-1 normalized
  passed: boolean;
  threshold: number;
  details: {
    luminance: number;
    contrast: number;
    structure: number;
    meanX: number;
    meanY: number;
    varianceX: number;
    varianceY: number;
    covariance: number;
  };
}

/**
 * SSIM (Structural Similarity Index) - Step 3 of the visual verification pipeline
 * Compares structure, contrast, and brightness rather than raw pixels
 * Removes many false positives from pixel-perfect comparison
 */
export class SSIMComparator {
  private options: SSIMOptions;

  constructor(options: SSIMOptions = {}) {
    this.options = {
      windowSize: 11,
      k1: 0.01,
      k2: 0.03,
      bitDepth: 8,
      ...options,
    };
  }

  /**
   * Compare two screenshots using SSIM
   */
  async compare(screenshotA: Buffer, screenshotB: Buffer, threshold: number = 0.95): Promise<SSIMResult> {
    const [imageA, imageB] = await Promise.all([loadImage(screenshotA), loadImage(screenshotB)]);

    const width = Math.min(imageA.width, imageB.width);
    const height = Math.min(imageA.height, imageB.height);

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

    // Convert to grayscale
    const grayA = this.toGrayscale(dataA, width, height);
    const grayB = this.toGrayscale(dataB, width, height);

    // Calculate SSIM
    const ssimResult = this.calculateSSIM(grayA, grayB, width, height);
    const ssimIndex = ssimResult.ssim;

    // Normalize to 0-1 range
    const similarity = (ssimIndex + 1) / 2;
    const passed = ssimIndex >= threshold;

    return {
      ssimIndex,
      similarity,
      passed,
      threshold,
      details: {
        luminance: ssimResult.luminance,
        contrast: ssimResult.contrast,
        structure: ssimResult.structure,
        meanX: ssimResult.meanX,
        meanY: ssimResult.meanY,
        varianceX: ssimResult.varianceX,
        varianceY: ssimResult.varianceY,
        covariance: ssimResult.covariance,
      },
    };
  }

  private toGrayscale(data: Uint8ClampedArray, width: number, height: number): Float64Array {
    const gray = new Float64Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      // Standard grayscale conversion
      gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    }
    return gray;
  }

  private calculateSSIM(
    grayA: Float64Array,
    grayB: Float64Array,
    width: number,
    height: number
  ): {
    ssim: number;
    luminance: number;
    contrast: number;
    structure: number;
    meanX: number;
    meanY: number;
    varianceX: number;
    varianceY: number;
    covariance: number;
  } {
    const windowSize = this.options.windowSize!;
    const k1 = this.options.k1!;
    const k2 = this.options.k2!;
    const bitDepth = this.options.bitDepth!;

    const L = Math.pow(2, bitDepth) - 1;
    const c1 = Math.pow(k1 * L, 2);
    const c2 = Math.pow(k2 * L, 2);
    const c3 = c2 / 2;

    let totalSSIM = 0;
    let totalLuminance = 0;
    let totalContrast = 0;
    let totalStructure = 0;
    let windowCount = 0;

    let globalMeanX = 0;
    let globalMeanY = 0;
    let globalVarX = 0;
    let globalVarY = 0;
    let globalCov = 0;

    const halfWindow = Math.floor(windowSize / 2);

    for (let y = halfWindow; y < height - halfWindow; y += halfWindow) {
      for (let x = halfWindow; x < width - halfWindow; x += halfWindow) {
        // Extract window
        let sumX = 0,
          sumY = 0,
          sumXY = 0,
          sumX2 = 0,
          sumY2 = 0;
        let count = 0;

        for (let dy = -halfWindow; dy <= halfWindow; dy++) {
          for (let dx = -halfWindow; dx <= halfWindow; dx++) {
            const idx = (y + dy) * width + (x + dx);
            const valA = grayA[idx];
            const valB = grayB[idx];

            sumX += valA;
            sumY += valB;
            sumXY += valA * valB;
            sumX2 += valA * valA;
            sumY2 += valB * valB;
            count++;
          }
        }

        const meanX = sumX / count;
        const meanY = sumY / count;
        const varianceX = sumX2 / count - meanX * meanX;
        const varianceY = sumY2 / count - meanY * meanY;
        const covariance = sumXY / count - meanX * meanY;

        globalMeanX += meanX;
        globalMeanY += meanY;
        globalVarX += varianceX;
        globalVarY += varianceY;
        globalCov += covariance;

        // SSIM components
        const luminance = (2 * meanX * meanY + c1) / (meanX * meanX + meanY * meanY + c1);
        const contrast = (2 * Math.sqrt(varianceX) * Math.sqrt(varianceY) + c2) / (varianceX + varianceY + c2);
        const structure = (covariance + c3) / (Math.sqrt(varianceX) * Math.sqrt(varianceY) + c3);

        const ssim = luminance * contrast * structure;

        totalSSIM += ssim;
        totalLuminance += luminance;
        totalContrast += contrast;
        totalStructure += structure;
        windowCount++;
      }
    }

    const avgWindows = windowCount || 1;

    return {
      ssim: totalSSIM / avgWindows,
      luminance: totalLuminance / avgWindows,
      contrast: totalContrast / avgWindows,
      structure: totalStructure / avgWindows,
      meanX: globalMeanX / avgWindows,
      meanY: globalMeanY / avgWindows,
      varianceX: globalVarX / avgWindows,
      varianceY: globalVarY / avgWindows,
      covariance: globalCov / avgWindows,
    };
  }
}

export default SSIMComparator;
