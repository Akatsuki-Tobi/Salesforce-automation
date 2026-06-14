import { createCanvas, loadImage } from "canvas";

export interface OCROptions {
  languages?: string[];
  confidenceThreshold?: number;
  regions?: Array<{ x: number; y: number; width: number; height: number }>;
}

export interface OCRResult {
  text: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
}

export interface OCRVerificationResult {
  similarity: number; // 0-1
  passed: boolean;
  threshold: number;
  matchedText: Array<{ expected: string; actual: string; similarity: number }>;
  missingText: string[];
  extraText: string[];
  details: {
    expectedText: string;
    actualText: string;
    confidence: number;
  };
}

/**
 * OCR Verifier - Step 5 of the visual verification pipeline
 * Extracts and compares text from screenshots
 * Useful for forms, invoices, tables, and documents
 */
export class OCRVerifier {
  private options: OCROptions;

  constructor(options: OCROptions = {}) {
    this.options = {
      languages: ["eng"],
      confidenceThreshold: 0.6,
      ...options,
    };
  }

  /**
   * Extract text from a screenshot using basic OCR
   * Note: In production, this would use Tesseract.js or a cloud OCR service
   */
  async extractText(screenshot: Buffer): Promise<OCRResult[]> {
    const image = await loadImage(screenshot);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;

    // Simple text region detection based on contrast and density
    const textRegions = this.detectTextRegions(data, image.width, image.height);

    const results: OCRResult[] = [];
    for (const region of textRegions) {
      const text = this.extractTextFromRegion(data, region, image.width, image.height);
      results.push({
        text,
        confidence: 0.8, // Placeholder confidence
        bbox: region,
      });
    }

    return results;
  }

  /**
   * Compare expected text with actual text extracted from screenshot
   */
  async verifyText(screenshot: Buffer, expectedText: string, threshold: number = 0.8): Promise<OCRVerificationResult> {
    const extractedResults = await this.extractText(screenshot);
    const actualText = extractedResults.map((r) => r.text).join(" ");

    // Calculate text similarity using Levenshtein distance
    const similarity = this.calculateTextSimilarity(expectedText, actualText);
    const passed = similarity >= threshold;

    // Find matched and missing text
    const { matched, missing, extra } = this.findTextDifferences(expectedText, actualText);

    return {
      similarity,
      passed,
      threshold,
      matchedText: matched,
      missingText: missing,
      extraText: extra,
      details: {
        expectedText,
        actualText,
        confidence: extractedResults.reduce((sum, r) => sum + r.confidence, 0) / extractedResults.length,
      },
    };
  }

  private detectTextRegions(data: Uint8ClampedArray, width: number, height: number): Array<{ x: number; y: number; width: number; height: number }> {
    const regions: Array<{ x: number; y: number; width: number; height: number }> = [];

    // Simple region detection based on text-like patterns
    // In production, this would use a proper text detection model
    const visited = new Uint8Array(width * height);
    const minRegionSize = 20;

    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const idx = (y * width + x) * 4;
        if (visited[y * width + x]) continue;

        // Check if this pixel is part of text (high contrast)
        const isText = this.isTextPixel(data, idx);
        if (isText) {
          const region = this.floodFillRegion(data, visited, x, y, width, height);
          if (region.width > minRegionSize && region.height > minRegionSize) {
            regions.push(region);
          }
        }
      }
    }

    return regions;
  }

  private isTextPixel(data: Uint8ClampedArray, idx: number): boolean {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const brightness = (r + g + b) / 3;
    return brightness < 200; // Dark pixels are likely text
  }

  private floodFillRegion(data: Uint8ClampedArray, visited: Uint8Array, startX: number, startY: number, width: number, height: number): { x: number; y: number; width: number; height: number } {
    let minX = startX,
      maxX = startX,
      minY = startY,
      maxY = startY;
    const stack: Array<[number, number]> = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      if (x < 0 || x >= width || y < 0 || y >= height || visited[y * width + x]) continue;

      visited[y * width + x] = 1;
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

  private extractTextFromRegion(data: Uint8ClampedArray, region: { x: number; y: number; width: number; height: number }, width: number, height: number): string {
    // Placeholder for actual OCR text extraction
    // In production, this would use Tesseract.js or similar
    return `Text region at (${region.x}, ${region.y})`;
  }

  private calculateTextSimilarity(expected: string, actual: string): number {
    const distance = this.levenshteinDistance(expected.toLowerCase(), actual.toLowerCase());
    const maxLength = Math.max(expected.length, actual.length);
    return maxLength > 0 ? 1 - distance / maxLength : 1;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
        }
      }
    }

    return matrix[b.length][a.length];
  }

  private findTextDifferences(expected: string, actual: string): {
    matched: Array<{ expected: string; actual: string; similarity: number }>;
    missing: string[];
    extra: string[];
  } {
    const expectedWords = expected.split(/\s+/);
    const actualWords = actual.split(/\s+/);

    const matched: Array<{ expected: string; actual: string; similarity: number }> = [];
    const missing: string[] = [];
    const extra: string[] = [];

    const usedActual = new Set<number>();

    for (const expWord of expectedWords) {
      let bestMatch = -1;
      let bestSimilarity = 0;

      for (let i = 0; i < actualWords.length; i++) {
        if (usedActual.has(i)) continue;
        const similarity = this.calculateTextSimilarity(expWord, actualWords[i]);
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
          bestMatch = i;
        }
      }

      if (bestMatch >= 0 && bestSimilarity > 0.8) {
        matched.push({ expected: expWord, actual: actualWords[bestMatch], similarity: bestSimilarity });
        usedActual.add(bestMatch);
      } else {
        missing.push(expWord);
      }
    }

    for (let i = 0; i < actualWords.length; i++) {
      if (!usedActual.has(i)) {
        extra.push(actualWords[i]);
      }
    }

    return { matched, missing, extra };
  }
}

export default OCRVerifier;
