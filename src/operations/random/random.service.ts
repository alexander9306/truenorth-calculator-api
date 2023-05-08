import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RandomAPIResponse } from './interfaces/random-api-response.interface';
import {
  Params,
  RandomAPIOptions,
} from './interfaces/random-api-options.interface';

@Injectable()
export class RandomService {
  private readonly url = 'https://api.random.org/json-rpc/2/invoke';
  private readonly apiKey = process.env.RANDOM_ORG_API_KEY;

  constructor(private httpService: HttpService) {}

  async generateString() {
    const { data } = await this.httpService.axiosRef.post<RandomAPIResponse>(
      this.url,
      this.getParams('generateStrings'),
    );

    return data.result.random.data[0];
  }

  private getParams(
    method: RandomAPIOptions['method'],
    params?: Partial<Params>,
  ): RandomAPIOptions {
    return {
      jsonrpc: '2.0',
      id: 42,
      method,
      params: {
        n: 1,
        length: 10,
        characters: '64Nlkerxa789rtuvas1235dawer',
        ...params,
        apiKey: this.apiKey,
      },
    };
  }
}
