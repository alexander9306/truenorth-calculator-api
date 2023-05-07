import { Test, TestingModule } from '@nestjs/testing';
import { RandomService } from './random.service';
import { HttpService } from '@nestjs/axios';

const mockHttpService = () => ({
  axiosRef: {
    post: jest.fn(),
  },
});

describe('RandomService', () => {
  let service: RandomService;
  let httpService: ReturnType<typeof mockHttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RandomService,
        {
          provide: HttpService,
          useFactory: mockHttpService,
        },
      ],
    }).compile();

    service = module.get(RandomService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateString', () => {
    it('should generate randomString', async () => {
      const randomString = '64Nlkerxa789r';
      const resultData = {
        result: {
          random: {
            data: [randomString],
          },
        },
      };

      httpService.axiosRef.post.mockResolvedValue({
        data: resultData,
      });

      const result = await service.generateString();

      expect(result).toEqual(randomString);
    });
  });
});
