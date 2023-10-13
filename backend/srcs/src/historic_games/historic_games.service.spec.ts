import { Test, TestingModule } from '@nestjs/testing';
import { HistoricGamesService } from './historic_games.service';

describe('HistoricGamesService', () => {
  let service: HistoricGamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoricGamesService],
    }).compile();

    service = module.get<HistoricGamesService>(HistoricGamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
