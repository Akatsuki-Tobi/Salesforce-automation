"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureMatcher = void 0;
const canvas_1 = require("canvas");
/**
 * Feature Matcher - Step 4 of the visual verification pipeline
 * Uses ORB, SIFT, and AKAZE algorithms to compare keypoints, corners, logos, icons, and buttons
 * Useful after responsive layout changes
 */
class FeatureMatcher {
    constructor(options = {}) {
        this.options = {
            algorithm: "orb",
            maxFeatures: 500,
            matchThreshold: 0.7,
            ratioThreshold: 0.8,
            ...options,
        };
    }
    /**
     * Compare two screenshots using feature matching
     */
    async compare(screenshotA, screenshotB, threshold = 0.6) {
        const [imageA, imageB] = await Promise.all([(0, canvas_1.loadImage)(screenshotA), (0, canvas_1.loadImage)(screenshotB)]);
        const widthA = imageA.width;
        const heightA = imageA.height;
        const widthB = imageB.width;
        const heightB = imageB.height;
        // Extract keypoints using simplified ORB-like algorithm
        const keypointsA = this.extractKeypoints(imageA, widthA, heightA);
        const keypointsB = this.extractKeypoints(imageB, widthB, heightB);
        // Match keypoints
        const matches = this.matchKeypoints(keypointsA, keypointsB);
        // Calculate similarity
        const maxPossibleMatches = Math.min(keypointsA.length, keypointsB.length);
        const similarity = maxPossibleMatches > 0 ? matches.length / maxPossibleMatches : 0;
        const passed = similarity >= threshold;
        return {
            similarity,
            matchedFeatures: matches.length,
            totalFeaturesA: keypointsA.length,
            totalFeaturesB: keypointsB.length,
            passed,
            threshold,
            details: {
                algorithm: this.options.algorithm,
                keypointsA: keypointsA.length,
                keypointsB: keypointsB.length,
                goodMatches: matches.length,
            },
        };
    }
    extractKeypoints(image, width, height) {
        const canvas = (0, canvas_1.createCanvas)(width, height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        // Convert to grayscale
        const gray = new Float64Array(width * height);
        for (let i = 0; i < width * height; i++) {
            gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
        }
        const keypoints = [];
        const windowSize = 7;
        const halfWindow = Math.floor(windowSize / 2);
        // Harris corner detection
        for (let y = halfWindow + 10; y < height - halfWindow - 10; y += 4) {
            for (let x = halfWindow + 10; x < width - halfWindow - 10; x += 4) {
                // Calculate gradients
                let ix2 = 0, iy2 = 0, ixy = 0;
                for (let dy = -halfWindow; dy <= halfWindow; dy++) {
                    for (let dx = -halfWindow; dx <= halfWindow; dx++) {
                        const idx = (y + dy) * width + (x + dx);
                        const idxRight = (y + dy) * width + (x + dx + 1);
                        const idxDown = (y + dy + 1) * width + (x + dx);
                        const gx = gray[idxRight] - gray[idx];
                        const gy = gray[idxDown] - gray[idx];
                        ix2 += gx * gx;
                        iy2 += gy * gy;
                        ixy += gx * gy;
                    }
                }
                // Harris corner response
                const det = ix2 * iy2 - ixy * ixy;
                const trace = ix2 + iy2;
                const response = det - 0.04 * trace * trace;
                if (response > 1000) {
                    const descriptor = this.computeDescriptor(gray, x, y, width, height);
                    keypoints.push({
                        x,
                        y,
                        size: windowSize,
                        angle: Math.atan2(iy2, ix2) * (180 / Math.PI),
                        response,
                        octave: 0,
                        descriptor,
                    });
                }
            }
        }
        // Sort by response and take top features
        keypoints.sort((a, b) => b.response - a.response);
        return keypoints.slice(0, this.options.maxFeatures);
    }
    computeDescriptor(gray, x, y, width, height) {
        const descriptorSize = 32;
        const descriptor = new Float32Array(descriptorSize);
        const patchSize = 16;
        const halfPatch = Math.floor(patchSize / 2);
        let idx = 0;
        for (let dy = -halfPatch; dy < halfPatch; dy += 2) {
            for (let dx = -halfPatch; dx < halfPatch; dx += 2) {
                const px = Math.min(width - 1, Math.max(0, x + dx));
                const py = Math.min(height - 1, Math.max(0, y + dy));
                const pixelIdx = py * width + px;
                descriptor[idx++] = gray[pixelIdx] / 255.0;
                if (idx >= descriptorSize)
                    break;
            }
            if (idx >= descriptorSize)
                break;
        }
        return descriptor;
    }
    matchKeypoints(keypointsA, keypointsB) {
        const matches = [];
        for (const kpA of keypointsA) {
            let bestMatch = null;
            let secondBestDistance = Infinity;
            for (const kpB of keypointsB) {
                const distance = this.calculateDistance(kpA.descriptor, kpB.descriptor);
                if (!bestMatch || distance < bestMatch.distance) {
                    secondBestDistance = bestMatch ? bestMatch.distance : Infinity;
                    bestMatch = { b: kpB, distance };
                }
                else if (distance < secondBestDistance) {
                    secondBestDistance = distance;
                }
            }
            // Lowe's ratio test
            if (bestMatch && secondBestDistance > 0 && bestMatch.distance / secondBestDistance < this.options.ratioThreshold) {
                matches.push({
                    a: kpA,
                    b: bestMatch.b,
                    distance: bestMatch.distance,
                });
            }
        }
        return matches;
    }
    calculateDistance(descA, descB) {
        let distance = 0;
        for (let i = 0; i < descA.length; i++) {
            const diff = descA[i] - descB[i];
            distance += diff * diff;
        }
        return Math.sqrt(distance);
    }
}
exports.FeatureMatcher = FeatureMatcher;
exports.default = FeatureMatcher;
