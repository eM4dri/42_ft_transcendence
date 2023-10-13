import { Test, TestingModule } from '@nestjs/testing';
import { HistoricGamesController } from './historic_games.controller';

describe('HistoricGamesController', () => {
  let controller: HistoricGamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoricGamesController],
    }).compile();

    controller = module.get<HistoricGamesController>(HistoricGamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
