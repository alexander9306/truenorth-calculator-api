export interface RandomAPIOptions {
  jsonrpc: string;
  method: string;
  params: Params;
  id: number;
}

export interface Params {
  apiKey: string;
  n: number;
  length: number;
  characters: string;
  replacement?: boolean;
}
