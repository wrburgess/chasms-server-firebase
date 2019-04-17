import AutoId from '../../src/utilities/AutoId';

describe('utilities/AutoId', () => {
  it('creates a 20-character string', () => {
    const id = AutoId.newId();
    expect(id.length).toEqual(20);
  });
});
