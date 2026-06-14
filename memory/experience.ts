export interface Experience {
  id: string;
  timestamp: number;
  task?: string;
  goal?: string;
  result?: string;
  code_diff?: string;
  failure_reason?: string;
  lessons?: string[];
  tags?: string[];
  importance: number;
  embedding: number[];
}
