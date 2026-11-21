import { Test, TestingModule } from '@nestjs/testing';
import { GoogleCalendarController } from './google-calendar.controller';
import { GoogleCalendarService } from './google-calendar.service';

describe('GoogleCalendarController', () => {
  let controller: GoogleCalendarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleCalendarController],
      providers: [
        {
          provide: GoogleCalendarService,
          useValue: { saveTokens: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<GoogleCalendarController>(GoogleCalendarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
