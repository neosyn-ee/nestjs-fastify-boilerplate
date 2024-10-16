import { Test, TestingModule } from '@nestjs/testing';
import { ExamplefeatureController } from './examplefeature.controller';
import { ExamplefeatureService } from './examplefeature.service';

describe('AppController', () => {
  let examplefeatureController: ExamplefeatureController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ExamplefeatureController],
      providers: [ExamplefeatureService],
    }).compile();

    examplefeatureController = app.get<ExamplefeatureController>(ExamplefeatureController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(examplefeatureController.getExample()).toBe('Hello World!');
    });
  });
});
