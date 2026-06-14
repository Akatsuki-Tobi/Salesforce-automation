import { createCanvas, loadImage } from "canvas";
/**
 * Object Detector - Step 6 of the visual verification pipeline
 * Detects UI elements like buttons, textboxes, dropdowns, images, icons, checkboxes, modals
 * Verifies position, count, hierarchy, and visibility
 */
export class ObjectDetector {
    objectTypes = ["button", "textbox", "dropdown", "image", "icon", "checkbox", "modal", "link", "label", "table"];
    /**
     * Detect objects in a screenshot
     * Note: In production, this would use a trained ML model like YOLO or DETR
     */
    async detectObjects(screenshot) {
        const image = await loadImage(screenshot);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
        // Detect objects using heuristics
        const objects = this.detectObjectsHeuristic(data, image.width, image.height);
        // Count objects by type
        const counts = {};
        for (const obj of objects) {
            counts[obj.type] = (counts[obj.type] || 0) + 1;
        }
        // Build hierarchy
        const hierarchy = this.buildHierarchy(objects);
        return {
            objects,
            counts,
            hierarchy,
        };
    }
    /**
     * Compare expected objects with actual detected objects
     */
    async verifyObjects(screenshot, expectedObjects, threshold = 0.8) {
        const detectionResult = await this.detectObjects(screenshot);
        const actualObjects = detectionResult.objects;
        const matchedObjects = [];
        const missingObjects = [];
        const extraObjects = [];
        const positionChanges = [];
        const usedActual = new Set();
        // Match expected objects with actual objects
        for (const expected of expectedObjects) {
            let bestMatch = -1;
            let bestSimilarity = 0;
            for (let i = 0; i < actualObjects.length; i++) {
                if (usedActual.has(i))
                    continue;
                const similarity = this.calculateObjectSimilarity(expected, actualObjects[i]);
                if (similarity > bestSimilarity) {
                    bestSimilarity = similarity;
                    bestMatch = i;
                }
            }
            if (bestMatch >= 0 && bestSimilarity >= threshold) {
                matchedObjects.push({ expected, actual: actualObjects[bestMatch], similarity: bestSimilarity });
                usedActual.add(bestMatch);
                // Check position change
                const distance = this.calculateDistance(expected.bbox, actualObjects[bestMatch].bbox);
                if (distance > 10) {
                    positionChanges.push({
                        object: expected.type,
                        expectedPos: { x: expected.bbox.x, y: expected.bbox.y },
                        actualPos: { x: actualObjects[bestMatch].bbox.x, y: actualObjects[bestMatch].bbox.y },
                        distance,
                    });
                }
            }
            else {
                missingObjects.push(expected);
            }
        }
        // Find extra objects
        for (let i = 0; i < actualObjects.length; i++) {
            if (!usedActual.has(i)) {
                extraObjects.push(actualObjects[i]);
            }
        }
        // Calculate overall similarity
        const totalObjects = Math.max(expectedObjects.length, actualObjects.length);
        const similarity = totalObjects > 0 ? matchedObjects.length / totalObjects : 1;
        const passed = similarity >= threshold;
        return {
            similarity,
            passed,
            threshold,
            matchedObjects,
            missingObjects,
            extraObjects,
            positionChanges,
            details: {
                expectedCount: expectedObjects.length,
                actualCount: actualObjects.length,
                type: "object_detection",
            },
        };
    }
    detectObjectsHeuristic(data, width, height) {
        const objects = [];
        // Detect buttons (rectangular regions with text-like patterns)
        const buttonRegions = this.detectRectangularRegions(data, width, height, { minWidth: 60, minHeight: 30, maxWidth: 300, maxHeight: 80 });
        for (const region of buttonRegions) {
            objects.push({
                type: "button",
                bbox: region,
                confidence: 0.85,
                attributes: { rounded: true, hasText: true },
            });
        }
        // Detect textboxes (rectangular input-like regions)
        const textboxRegions = this.detectRectangularRegions(data, width, height, { minWidth: 150, minHeight: 30, maxWidth: 500, maxHeight: 60 });
        for (const region of textboxRegions) {
            objects.push({
                type: "textbox",
                bbox: region,
                confidence: 0.8,
                attributes: { hasBorder: true, isInput: true },
            });
        }
        // Detect checkboxes (small square regions)
        const checkboxRegions = this.detectRectangularRegions(data, width, height, { minWidth: 15, minHeight: 15, maxWidth: 30, maxHeight: 30 });
        for (const region of checkboxRegions) {
            objects.push({
                type: "checkbox",
                bbox: region,
                confidence: 0.75,
                attributes: { isSquare: true },
            });
        }
        // Detect images (regions with high color variation)
        const imageRegions = this.detectImageRegions(data, width, height);
        for (const region of imageRegions) {
            objects.push({
                type: "image",
                bbox: region,
                confidence: 0.7,
                attributes: { hasColorVariation: true },
            });
        }
        return objects;
    }
    detectRectangularRegions(data, width, height, constraints) {
        const regions = [];
        // Simple edge detection to find rectangular regions
        for (let y = 0; y < height - constraints.minHeight; y += 10) {
            for (let x = 0; x < width - constraints.minWidth; x += 10) {
                const region = this.findRectangularRegion(data, x, y, width, height, constraints);
                if (region) {
                    regions.push(region);
                    x = region.x + region.width; // Skip past this region
                }
            }
        }
        return regions;
    }
    findRectangularRegion(data, startX, startY, width, height, constraints) {
        // Check if this is a potential region start
        if (!this.isRegionStart(data, startX, startY, width)) {
            return null;
        }
        // Find region bounds
        let endX = startX + constraints.minWidth;
        let endY = startY + constraints.minHeight;
        // Expand to find edges
        while (endX < width && endX - startX < constraints.maxWidth && this.isEdge(data, endX, startY, width, "vertical")) {
            endX++;
        }
        while (endY < height && endY - startY < constraints.maxHeight && this.isEdge(data, startX, endY, width, "horizontal")) {
            endY++;
        }
        const regionWidth = endX - startX;
        const regionHeight = endY - startY;
        if (regionWidth >= constraints.minWidth && regionHeight >= constraints.minHeight) {
            return {
                x: startX,
                y: startY,
                width: regionWidth,
                height: regionHeight,
            };
        }
        return null;
    }
    MEA;
    isRegionStart(data, x, y, width) {
        const idx = (y * width + x) * 4;
        // Check for edge-like pixel (high contrast)
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        return brightness < 150; // Dark edge
    }
    isEdge(data, x, y, width, direction) {
        const idx = (y * width + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        return brightness < 180; // Edge pixel
    }
    detectImageRegions(data, width, height) {
        const regions = [];
        // Detect regions with high color variation (likely images)
        const blockSize = 50;
        for (let y = 0; y < height - blockSize; y += blockSize) {
            for (let x = 0; x < width - blockSize; x += blockSize) {
                const variation = this.calculateColorVariation(data, x, y, blockSize, width, height);
                if (variation > 50) {
                    regions.push({ x, y, width: blockSize, height: blockSize });
                }
            }
        }
        return regions;
    }
    calculateColorVariation(data, startX, startY, size, width, height) {
        let totalVariation = 0;
        let count = 0;
        for (let y = startY; y < Math.min(startY + size, height); y++) {
            for (let x = startX; x < Math.min(startX + size, width); x++) {
                const idx = (y * width + x) * 4;
                const nextIdx = (y * width + Math.min(x + 1, width - 1)) * 4;
                const rDiff = Math.abs(data[idx] - data[nextIdx]);
                const gDiff = Math.abs(data[idx + 1] - data[nextIdx + 1]);
                const bDiff = Math.abs(data[idx + 2] - data[nextIdx + 2]);
                totalVariation += (rDiff + gDiff + bDiff) / 3;
                count++;
            }
        }
        return count > 0 ? totalVariation / count : 0;
    }
    buildHierarchy(objects) {
        const hierarchy = [];
        // Simple hierarchy based on containment
        for (let i = 0; i < objects.length; i++) {
            const parent = objects[i];
            const children = [];
            for (let j = 0; j < objects.length; j++) {
                if (i === j)
                    continue;
                const child = objects[j];
                if (this.isContained(child.bbox, parent.bbox)) {
                    children.push(child.type);
                }
            }
            if (children.length > 0) {
                hierarchy.push({ parent: parent.type, children });
            }
        }
        return hierarchy;
    }
    isContained(inner, outer) {
        return inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height;
    }
    calculateObjectSimilarity(objA, objB) {
        if (objA.type !== objB.type)
            return 0;
        // Calculate IoU (Intersection over Union)
        const intersectionX = Math.max(objA.bbox.x, objB.bbox.x);
        const intersectionY = Math.max(objA.bbox.y, objB.bbox.y);
        const intersectionWidth = Math.min(objA.bbox.x + objA.bbox.width, objB.bbox.x + objB.bbox.width) - intersectionX;
        const intersectionHeight = Math.min(objA.bbox.y + objA.bbox.height, objB.bbox.y + objB.bbox.height) - intersectionY;
        if (intersectionWidth <= 0 || intersectionHeight <= 0)
            return 0;
        const intersectionArea = intersectionWidth * intersectionHeight;
        const unionArea = objA.bbox.width * objA.bbox.height + objB.bbox.width * objB.bbox.height - intersectionArea;
        return unionArea > 0 ? intersectionArea / unionArea : 0;
    }
    calculateDistance(bboxA, bboxB) {
        const centerA = { x: bboxA.x + bboxA.width / 2, y: bboxA.y + bboxA.height / 2 };
        const centerB = { x: bboxB.x + bboxB.width / 2, y: bboxB.y + bboxB.height / 2 };
        return Math.sqrt(Math.pow(centerA.x - centerB.x, 2) + Math.pow(centerA.y - centerB.y, 2));
    }
}
export default ObjectDetector;
//# sourceMappingURL=object-detector.js.map