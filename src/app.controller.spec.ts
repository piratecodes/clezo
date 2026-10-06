import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('Gateway Check', () => {
    it('should return gateway status', () => {
      expect(appController.getGateway()).toEqual({
        system: "Clezo Express Laundry Gateway",
        status: "online 🟢",
        message: "Watchdog is awake and secure.",
        developer: {
          agency: "Straxcel Business Solutions",
          website: "https://straxcel.com"
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe('V1 Engine Check', () => {
    it('should return v1 engine status', () => {
      expect(appController.getV1Engine()).toEqual({
        success: true,
        system: "Clezo Express Laundry Core API v1",
        status: "operational 🟢",
        version: "1.0.0",
        message: "Watchdog is awake and secure.",
        developer: {
          agency: "Straxcel Business Solutions",
          website: "https://straxcel.com"
        },
        timestamp: expect.any(String),
      });
    });
  });
});
