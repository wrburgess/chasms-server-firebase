import AutoId from '../../src/utilities/AutoId';

describe('utilities/AutoId', () => {
  it('creates a 20-character string', () => {
    const id = AutoId.newId();
    console.log('id.length', id.length);
    expect(id.length).toEqual(20);
  });
});
