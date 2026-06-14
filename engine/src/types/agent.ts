export enum AgentState {
  OBSERVE = "OBSERVE",
  PLAN = "PLAN",
  VALIDATE = "VALIDATE",
  EXECUTE = "EXECUTE",
  VERIFY = "VERIFY",
  REFLECT = "REFLECT",
  RECOVER = "RECOVER",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}

export interface BrowserTab {
  tabId: string;
  title: string;
  url: string;
  purpose: string;
}

export interface ActionRecord {
  id: string;
  action: string;
  params: Record<string, unknown>;
  result: string;
  timestamp: number;
}

export interface Observation {
  url: string;
  title: string;
  timestamp: number;
  screenshotPath: string;
  dom: DOMNode[];
  accessibilityTree: unknown;
  visibleText: string;
  forms: FormInfo[];
  breadcrumbs: string[];
}

export interface DOMNode {
  tag: string;
  role?: string;
  text?: string;
  ariaLabel?: string;
  placeholder?: string;
  visible: boolean;
  disabled: boolean;
  selector: string;
  xpath: string;
}

export interface FormInfo {
  name?: string;
  action?: string;
  inputs: Array<{
    name?: string;
    type?: string;
    placeholder?: string;
    label?: string;
  }>;
}

export interface WorldModel {
  goal: string;
  browser: {
    currentUrl: string;
    pageTitle: string;
    activeTab: string;
    openTabs: BrowserTab[];
  };
  memory: {
    completedActions: ActionRecord[];
    failedActions: ActionRecord[];
    discoveredFacts: string[];
  };
  environment: {
    authenticated: boolean;
    blocked: boolean;
    blockingReason?: string;
  };
  observations: Observation[];
  status: {
    state: AgentState;
    stepCount: number;
  };
  // RAG fields
  knowledgeContext?: RetrievedContext[];
  knowledgeGaps?: KnowledgeGap[];
  searchedQueries?: string[];
  ragBudget?: {
    searchesUsed: number;
    pagesScraped: number;
    documentsStored: number;
    startTime: number;
  };
}

export interface PlannerOutput {
  thought: string;
  confidence: number;
  expected_outcome: string;
  action: string;
  params: Record<string, unknown>;
  is_complete: boolean;
  knowledgeQuery?: string;
  retrievedContextUsed?: boolean;
}

// ==================== RAG Types ====================

export enum LearningState {
  KNOWN = "KNOWN",
  UNKNOWN = "UNKNOWN",
  SEARCHING = "SEARCHING",
  LEARNING = "LEARNING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED"
}

export enum KnowledgeType {
  DOCUMENTATION = "DOCUMENTATION",
  WORKFLOW = "WORKFLOW",
  CONFIGURATION = "CONFIGURATION",
  ERROR_FIX = "ERROR_FIX",
  UI_PATTERN = "UI_PATTERN",
  REFERENCE = "REFERENCE"
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface KnowledgeScore {
  sourceAuthority: number;
  relevance: number;
  freshness: number;
  confidence: number;
}

export interface KnowledgeChunk {
  chunkId: string;
  content: string;
  source: string;
  url?: string;
  title?: string;
  timestamp: number;
  knowledgeType: KnowledgeType;
  embedding?: number[];
  metadata?: Record<string, unknown>;
}

export interface KnowledgeGap {
  description: string;
  query: string;
  detectedAtStep: number;
  resolved: boolean;
}

export interface RetrievedContext {
  chunks: KnowledgeChunk[];
  query: string;
  retrievalLatencyMs: number;
}

// ==================== RAG Budget Constants ====================

export const RAG_MAX_SEARCHES = 3;
export const RAG_MAX_SCRAPED_PAGES = 10;
export const RAG_MAX_RAG_DOCUMENTS = 20;
export const RAG_MAX_CONTEXT_TOKENS = 15000;
export const RAG_MAX_RESEARCH_TIME = 120000; // ms
export const RAG_CONFIDENCE_THRESHOLD = 0.70;
export const RAG_TOP_K = 5;

// Domain authority weights
export const DOMAIN_WEIGHTS: Record<string, number> = {
  "trailhead.salesforce.com": 10,
  "developer.salesforce.com": 10,
  "salesforce.com": 10,
  "help.salesforce.com": 10,
  "github.com": 7,
  "stackoverflow.com": 6,
  "community.salesforce.com": 6
};

import { JSDOM } from 'jsdom'
import { SemanticVisionResult } from './semantic-vision'
import { ObjectDetectionResult } from './object-detector'

declare let DOMUtils

declare let VisionUtils

export class DOMVisionFusion {
  constructor(private dom: string, private screenshot: Buffer, private semanticVision: SemanticVisionResult, private objectDetection: ObjectDetectionResult) {}

  async alignDOMWithVision(): Promise<Map<Element, VisionRegion>> {
    const dom = new JSDOM(this.dom)
    const elements = Array.from(dom.window.document.body.children)
    
    return Promise.all(elements.map(async (element) => {
      const bbox = VisionUtils.getElementBoundingBox(element)
      const matchingRegion = this.objectDetection.regions.find(region =>
        VisionUtils.boundingBoxesIntersect(bbox, region.bbox)
      )
      
      if (matchingRegion) {
        const semanticLabel = this.semanticVision.labels.find(label =>
          label.regionId === matchingRegion.id
        )?.text || 'Unknown'
        
        return {
          element,
          visionRegion: {
            ...matchingRegion,
            semanticLabel,
            screenshotCrop: VisionUtils.cropScreenshot(this.screenshot, matchingRegion.bbox)
          }
        }
      }
      
      return { element, visionRegion: null }
    }
  }
}
