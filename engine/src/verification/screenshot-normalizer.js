import { createCanvas, loadImage, Image } from "canvas";
import * as fs from "fs";
import * as path from "path";
const DEFAULT_OPTIONS = {
    targetWidth: 1920,
    targetHeight: 1080,
    theme: "auto",
    fontFamily: "Arial, sans-serif",
    removeAnimations: true,
    normalizeTimezone: true,
    removeRandomIds: true,
    outputFormat: "png",
    quality: 95,
};
/**
 * Screenshot Normalizer - Step 1 of the visual verification pipeline
 * Normalizes screenshots to reduce false positives from environmental differences
 */
export class ScreenshotNormalizer {
    options;
    constructor(options = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }
    /**
     * Normalize a screenshot buffer
     */
    async normalize(screenshotBuffer) {
        const image = await loadImage(screenshotBuffer);
        const originalWidth = image.width;
        const originalHeight = image.height;
        const canvas = createCanvas(this.options.targetWidth, this.options.targetHeight);
        const ctx = canvas.getContext("2d");
        const processingSteps = [];
        // Step 1: Scale to target resolution
        ctx.drawImage(image, 0, 0, this.options.targetWidth, this.options.targetHeight);
        processingSteps.push(`scaled_to_${this.options.targetWidth}x${this.options.targetHeight}`);
        // Step 2: Normalize theme (convert to consistent color space)
        if (this.options.theme === "auto" || this.options.theme) {
            this.normalizeTheme(ctx, this.options.targetWidth, this.options.targetHeight);
            processingSteps.push("theme_normalized");
        }
        // Step 3: Remove animation artifacts (blur static elements)
        if (this.options.removeAnimations) {
            this.removeAnimationArtifacts(ctx, this.options.targetWidth, this.options.targetHeight);
            processingSteps.push("animations_removed");
        }
        // Step 4: Normalize fonts (apply consistent font rendering)
        this.normalizeFonts(ctx, this.options.targetWidth, this.options.targetHeight);
        processingSteps.push("fonts_normalized");
        // Step 5: Remove random IDs (pixel-level noise reduction)
        if (this.options.removeRandomIds) {
            this.removeRandomIdArtifacts(ctx, this.options.targetWidth, this.options.targetHeight);
            processingSteps.push("random_ids_removed");
        }
        // Convert to buffer
        const outputBuffer = this.options.outputFormat === "jpeg"
            ? canvas.toBuffer("image/jpeg", { quality: this.options.quality / 100 })
            : canvas.toBuffer("image/png");
        processingSteps.push(`output_${this.options.outputFormat}`);
        return {
            buffer: outputBuffer,
            metadata: {
                originalWidth,
                originalHeight,
                normalizedWidth: this.options.targetWidth,
                normalizedHeight: this.options.targetHeight,
                theme: this.options.theme || "auto",
                processingSteps,
            },
        };
    }
    /**
     * Normalize theme by adjusting brightness/contrast to standard levels
     */
    normalizeTheme(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        // Calculate average brightness
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            totalBrightness += brightness;
        }
        const avgBrightness = totalBrightness / (data.length / 4);
        // Adjust to target brightness (128)
        const targetBrightness = 128;
        const brightnessDiff = targetBrightness - avgBrightness;
        if (Math.abs(brightnessDiff) > 10) {
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, Math.max(0, data[i] + brightnessDiff));
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightnessDiff));
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightnessDiff));
            }
            ctx.putImageData(imageData, 0, 0);
        }
    }
    /**
     * Remove animation artifacts by applying slight blur to reduce flicker
     */
    removeAnimationArtifacts(ctx, width, height) {
        // Apply a very slight Gaussian-like blur to reduce animation noise
        ctx.filter = "blur(0.5px)";
        const tempCanvas = createCanvas(width, height);
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(ctx.canvas, 0, 0);
        ctx.filter = "none";
        ctx.drawImage(tempCanvas, 0, 0);
    }
    /**
     * Normalize fonts by ensuring consistent rendering
     */
    normalizeFonts(ctx, width, height) {
        // This is a placeholder for font normalization
        // In a real implementation, this would:
        // 1. Detect text regions using OCR
        // 2. Re-render text with consistent fonts
        // 3. Anti-alias consistently
        // For now, we apply a subtle sharpening filter
        ctx.filter = "contrast(1.05)";
        const tempCanvas = createCanvas(width, height);
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(ctx.canvas, 0, 0);
        ctx.filter = "none";
        ctx.drawImage(tempCanvas, 0, 0);
    }
    /**
     * Remove random ID artifacts by detecting and smoothing high-frequency noise
     */
    removeRandomIdArtifacts(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        // Simple noise reduction using median filter on small regions
        const tempData = new Uint8ClampedArray(data);
        const windowSize = 3;
        const halfWindow = Math.floor(windowSize / 2);
        for (let y = halfWindow; y < height - halfWindow; y++) {
            for (let x = halfWindow; x < width - halfWindow; x++) {
                const idx = (y * width + x) * 4;
                // Collect neighboring pixels
                const neighbors = [[], [], []];
                for (let dy = -halfWindow; dy <= halfWindow; dy++) {
                    for (let dx = -halfWindow; dx <= halfWindow; dx++) {
                        const nIdx = ((y + dy) * width + (x + dx)) * 4;
                        neighbors[0].push(tempData[nIdx]);
                        neighbors[1].push(tempData[nIdx + 1]);
                        neighbors[2].push(tempData[nIdx + 2]);
                    }
                }
                // Apply median filter
                data[idx] = this.median(neighbors[0]);
                data[idx + 1] = this.median(neighbors[1]);
                data[idx + 2] = this.median(neighbors[2]);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }
    median(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }
    /**
     * Normalize two screenshots for comparison
     */
    async normalizePair(screenshotA, screenshotB) {
        const [normalizedA, normalizedB] = await Promise.all([
            this.normalize(screenshotA),
            this.normalize(screenshotB),
        ]);
        return { normalizedA, normalizedB };
    }
    /**
     * Save normalized screenshot to file
     */
    async saveToFile(normalizedScreenshot, filePath) {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, normalizedScreenshot.buffer);
    }
}
export default ScreenshotNormalizer;
//# sourceMappingURL=screenshot-normalizer.js.map