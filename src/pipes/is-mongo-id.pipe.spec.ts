import { IsMongoIdPipe } from "./is-mongo-id.pipe";

describe('ValidateMonogoIdPipe', () => {
  it('should be defined', () => {
    expect(new IsMongoIdPipe()).toBeDefined();
  });
});
