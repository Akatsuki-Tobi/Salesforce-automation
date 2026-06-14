"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMVisionFusion = exports.DOMAIN_WEIGHTS = exports.RAG_TOP_K = exports.RAG_CONFIDENCE_THRESHOLD = exports.RAG_MAX_RESEARCH_TIME = exports.RAG_MAX_CONTEXT_TOKENS = exports.RAG_MAX_RAG_DOCUMENTS = exports.RAG_MAX_SCRAPED_PAGES = exports.RAG_MAX_SEARCHES = exports.KnowledgeType = exports.LearningState = exports.AgentState = void 0;
var AgentState;
(function (AgentState) {
    AgentState["OBSERVE"] = "OBSERVE";
    AgentState["PLAN"] = "PLAN";
    AgentState["VALIDATE"] = "VALIDATE";
    AgentState["EXECUTE"] = "EXECUTE";
    AgentState["VERIFY"] = "VERIFY";
    AgentState["REFLECT"] = "REFLECT";
    AgentState["RECOVER"] = "RECOVER";
    AgentState["COMPLETE"] = "COMPLETE";
    AgentState["FAILED"] = "FAILED";
})(AgentState || (exports.AgentState = AgentState = {}));
// ==================== RAG Types ====================
var LearningState;
(function (LearningState) {
    LearningState["KNOWN"] = "KNOWN";
    LearningState["UNKNOWN"] = "UNKNOWN";
    LearningState["SEARCHING"] = "SEARCHING";
    LearningState["LEARNING"] = "LEARNING";
    LearningState["VERIFIED"] = "VERIFIED";
    LearningState["REJECTED"] = "REJECTED";
})(LearningState || (exports.LearningState = LearningState = {}));
var KnowledgeType;
(function (KnowledgeType) {
    KnowledgeType["DOCUMENTATION"] = "DOCUMENTATION";
    KnowledgeType["WORKFLOW"] = "WORKFLOW";
    KnowledgeType["CONFIGURATION"] = "CONFIGURATION";
    KnowledgeType["ERROR_FIX"] = "ERROR_FIX";
    KnowledgeType["UI_PATTERN"] = "UI_PATTERN";
    KnowledgeType["REFERENCE"] = "REFERENCE";
})(KnowledgeType || (exports.KnowledgeType = KnowledgeType = {}));
// ==================== RAG Budget Constants ====================
exports.RAG_MAX_SEARCHES = 3;
exports.RAG_MAX_SCRAPED_PAGES = 10;
exports.RAG_MAX_RAG_DOCUMENTS = 20;
exports.RAG_MAX_CONTEXT_TOKENS = 15000;
exports.RAG_MAX_RESEARCH_TIME = 120000; // ms
exports.RAG_CONFIDENCE_THRESHOLD = 0.70;
exports.RAG_TOP_K = 5;
// Domain authority weights
exports.DOMAIN_WEIGHTS = {
    "trailhead.salesforce.com": 10,
    "developer.salesforce.com": 10,
    "salesforce.com": 10,
    "help.salesforce.com": 10,
    "github.com": 7,
    "stackoverflow.com": 6,
    "community.salesforce.com": 6
};
const jsdom_1 = require("jsdom");
class DOMVisionFusion {
    constructor(dom, screenshot, semanticVision, objectDetection) {
        this.dom = dom;
        this.screenshot = screenshot;
        this.semanticVision = semanticVision;
        this.objectDetection = objectDetection;
    }
    async alignDOMWithVision() {
        const dom = new jsdom_1.JSDOM(this.dom);
        const elements = Array.from(dom.window.document.body.children);
        return Promise.all(elements.map(async (element) => {
            const bbox = VisionUtils.getElementBoundingBox(element);
            const matchingRegion = this.objectDetection.regions.find(region => VisionUtils.boundingBoxesIntersect(bbox, region.bbox));
            if (matchingRegion) {
                const semanticLabel = this.semanticVision.labels.find(label => label.regionId === matchingRegion.id)?.text || 'Unknown';
                return {
                    element,
                    visionRegion: {
                        ...matchingRegion,
                        semanticLabel,
                        screenshotCrop: VisionUtils.cropScreenshot(this.screenshot, matchingRegion.bbox)
                    }
                };
            }
            return { element, visionRegion: null };
        }));
    }
}
exports.DOMVisionFusion = DOMVisionFusion;
