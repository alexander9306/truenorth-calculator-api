export interface RandomAPIResponse {
  jsonrpc: string;
  result: Result;
  id: number;
}

export interface Result {
  random: Random;
  bitsUsed: number;
  bitsLeft: number;
  requestsLeft: number;
  advisoryDelay: number;
}

export interface Random {
  data: string[];
  completionTime: Date;
}
