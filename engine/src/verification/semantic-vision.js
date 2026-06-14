"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticVision = void 0;
const canvas_1 = require("canvas");
/**
 * Semantic Vision - Step 7 of the visual verification pipeline
 * Uses Vision Language Models to describe UI and compare intent
 * Example: "Blue login button" vs "Blue sign-in button" = Pass
 */
class SemanticVision {
    constructor(options = {}) {
        this.options = {
            model: "default",
            ...options,
        };
    }
    /**
     * Describe a screenshot using semantic vision
     * Note: In production, this would call a VLM API (OpenAI, Anthropic, etc.)
     */
    async describeScreenshot(screenshot) {
        const image = await (0, canvas_1.loadImage)(screenshot);
        const canvas = (0, canvas_1.createCanvas)(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        // In production, this would send the image to a VLM
        // For now, return a placeholder description
        return {
            elements: this.detectSemanticElements(ctx, image.width, image.height),
            layout: this.analyzeLayout(ctx, image.width, image.height),
            colorScheme: this.analyzeColorScheme(ctx, image.width, image.height),
            overallDescription: "UI screenshot with various interactive elements",
        };
    }
    /**
     * Compare two screenshots semantically
     */
    async compareSemantic(screenshotA, screenshotB, expectedIntent, threshold = 0.8) {
        const [descriptionA, descriptionB] = await Promise.all([this.describeScreenshot(screenshotA), this.describeScreenshot(screenshotB)]);
        // Compare semantic descriptions
        const semanticMatch = this.calculateSemanticSimilarity(descriptionA, descriptionB);
        const intentMatch = this.calculateIntentMatch(descriptionB, expectedIntent);
        // Compare elements
        const elementMatches = this.compareElements(descriptionA.elements, descriptionB.elements);
        // Overall similarity
        const similarity = (semanticMatch + intentMatch) / 2;
        const passed = similarity >= threshold;
        return {
            similarity,
            passed,
            threshold,
            semanticMatch,
            intentMatch,
            elementMatches,
            details: {
                expectedDescription: descriptionA.overallDescription,
                actualDescription: descriptionB.overallDescription,
                confidence: Math.max(semanticMatch, intentMatch),
            },
        };
    }
    detectSemanticElements(ctx, width, height) {
        const elements = [];
        // Detect common UI elements based on color and shape patterns
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        // Look for button-like regions (rectangular, solid color)
        const buttonRegions = this.findButtonRegions(data, width, height);
        for (const region of buttonRegions) {
            elements.push({
                type: "button",
                description: `Button at (${region.x}, ${region.y})`,
                position: { x: region.x, y: region.y },
                confidence: 0.85,
            });
        }
        // Look for text input regions
        const inputRegions = this.findInputRegions(data, width, height);
        for (const region of inputRegions) {
            elements.push({
                type: "input",
                description: `Text input at (${region.x}, ${region.y})`,
                position: { x: region.x, y: region.y },
                confidence: 0.8,
            });
        }
        // Look for image regions
        const imageRegions = this.findImageRegions(data, width, height);
        for (const region of imageRegions) {
            elements.push({
                type: "image",
                description: `Image at (${region.x}, ${region.y})`,
                position: { x: region.x, y: region.y },
                confidence: 0.75,
            });
        }
        return elements;
    }
    analyzeLayout(ctx, width, height) {
        // Analyze layout structure
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        // Check for common layout patterns
        const hasHeader = this.detectHeader(data, width, height);
        const hasSidebar = this.detectSidebar(data, width, height);
        const hasFooter = this.detectFooter(data, width, height);
        if (hasHeader && hasSidebar && hasFooter)
            return "header-sidebar-footer";
        if (hasHeader && hasFooter)
            return "header-footer";
        if (hasSidebar)
            return "sidebar";
        return "standard";
    }
    analyzeColorScheme(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        let totalR = 0, totalG = 0, totalB = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
            totalR += data[i];
            totalG += data[i + 1];
            totalB += data[i + 2];
            count++;
        }
        const avgR = totalR / count;
        const avgG = totalG / count;
        const avgB = totalB / count;
        const brightness = (avgR + avgG + avgB) / 3;
        if (brightness > 200)
            return "light";
        if (brightness < 50)
            return "dark";
        return "mixed";
    }
    calculateSemanticSimilarity(descA, descB) {
        // Compare layouts
        const layoutMatch = descA.layout === descB.layout ? 1 : 0;
        // Compare color schemes
        const colorMatch = descA.colorScheme === descB.colorScheme ? 1 : 0.5;
        // Compare elements
        let elementMatch = 0;
        const maxElements = Math.max(descA.elements.length, descB.elements.length);
        if (maxElements > 0) {
            let matchedElements = 0;
            for (const elemA of descA.elements) {
                for (const elemB of descB.elements) {
                    if (elemA.type === elemB.type) {
                        matchedElements++;
                        break;
                    }
                }
            }
            elementMatch = matchedElements / maxElements;
        }
        return (layoutMatch + colorMatch + elementMatch) / 3;
    }
    calculateIntentMatch(description, expectedIntent) {
        // Simple keyword matching for intent
        const intentWords = expectedIntent.toLowerCase().split(/\s+/);
        const descriptionWords = description.overallDescription.toLowerCase().split(/\s+/);
        let matchedWords = 0;
        for (const word of intentWords) {
            if (descriptionWords.some((dw) => dw.includes(word) || word.includes(dw))) {
                matchedWords++;
            }
        }
        return intentWords.length > 0 ? matchedWords / intentWords.length : 0;
    }
    compareElements(elementsA, elementsB) {
        const matches = [];
        for (const elemA of elementsA) {
            let bestMatch = null;
            for (const elemB of elementsB) {
                if (elemA.type === elemB.type) {
                    const distance = Math.sqrt(Math.pow(elemA.position.x - elemB.position.x, 2) + Math.pow(elemA.position.y - elemB.position.y, 2));
                    const similarity = Math.max(0, 1 - distance / 100);
                    if (!bestMatch || similarity > bestMatch.similarity) {
                        bestMatch = { actual: elemB.description, similarity };
                    }
                }
            }
            if (bestMatch) {
                matches.push({
                    expected: elemA.description,
                    actual: bestMatch.actual,
                    similarity: bestMatch.similarity,
                });
            }
        }
        return matches;
    }
    findButtonRegions(data, width, height) {
        const regions = [];
        // Look for rectangular regions with solid colors (typical buttons)
        for (let y = 0; y < height - 30; y += 10) {
            for (let x = 0; x < width - 80; x += 10) {
                if (this.isButtonRegion(data, x, y, width, height)) {
                    regions.push({ x, y });
                }
            }
        }
        return regions;
    }
    isButtonRegion(data, x, y, width, height) {
        // Check for button-like characteristics
        const idx = (y * width + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        // Buttons typically have distinct colors
        return brightness < 200 && brightness > 50;
    }
    findInputRegions(data, width, height) {
        const regions = [];
        // Look for long rectangular regions (typical inputs)
        for (let y = 0; y < height - 30; y += 10) {
            for (let x = 0; x < width - 200; x += 10) {
                if (this.isInputRegion(data, x, y, width, height)) {
                    regions.push({ x, y });
                }
            }
        }
        return regions;
    }
    isInputRegion(data, x, y, width, height) {
        // Check for input-like characteristics
        const idx = (y * width + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        // Inputs typically have lighter backgrounds
        return brightness > 220;
    }
    findImageRegions(data, width, height) {
        const regions = [];
        // Look for regions with high color variation (typical images)
        for (let y = 0; y < height - 50; y += 20) {
            for (let x = 0; x < width - 50; x += 20) {
                if (this.isImageRegion(data, x, y, width, height)) {
                    regions.push({ x, y });
                }
            }
        }
        return regions;
    }
    isImageRegion(data, x, y, width, height) {
        // Check for image-like characteristics (high color variation)
        let variation = 0;
        const sampleSize = 10;
        for (let dy = 0; dy < sampleSize; dy++) {
            for (let dx = 0; dx < sampleSize; dx++) {
                const idx = ((y + dy) * width + (x + dx)) * 4;
                const nextIdx = ((y + dy) * width + (x + dx + 1)) * 4;
                const rDiff = Math.abs(data[idx] - data[nextIdx]);
                const gDiff = Math.abs(data[idx + 1] - data[nextIdx + 1]);
                const bDiff = Math.abs(data[idx + 2] - data[nextIdx + 2]);
                variation += (rDiff + gDiff + bDiff) / 3;
            }
        }
        return variation / (sampleSize * sampleSize) > 30;
    }
    detectHeader(data, width, height) {
        // Check for header-like region at top
        const headerHeight = Math.floor(height * 0.1);
        let headerPixels = 0;
        for (let y = 0; y < headerHeight; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                if (brightness < 200) {
                    headerPixels++;
                }
            }
        }
        return headerPixels > width * headerHeight * 0.3;
    }
    detectSidebar(data, width, height) {
        // Check for sidebar-like region on left
        const sidebarWidth = Math.floor(width * 0.2);
        let sidebarPixels = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < sidebarWidth; x++) {
                const idx = (y * width + x) * 4;
                const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                if (brightness < 200) {
                    sidebarPixels++;
                }
            }
        }
        return sidebarPixels > sidebarWidth * height * 0.3;
    }
    detectFooter(data, width, height) {
        // Check for footer-like region at bottom
        const footerHeight = Math.floor(height * 0.1);
        let footerPixels = 0;
        for (let y = height - footerHeight; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                if (brightness < 200) {
                    footerPixels++;
                }
            }
        }
        return footerPixels > width * footerHeight * 0.3;
    }
}
exports.SemanticVision = SemanticVision;
exports.default = SemanticVision;
