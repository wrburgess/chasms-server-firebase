import * as faker from 'faker';

class AssetFactory {
  id: string;
  sourceUrl: string;
  storagePath: string;

  constructor({
    id = faker.random.uuid(),
    sourceUrl = `${faker.internet.url()}/images/${faker.random.uuid()}.jpg`,
    storagePath = '',
  }) {
    this.id = id;
    this.sourceUrl = sourceUrl;
    this.storagePath = storagePath;
  }
}

export default AssetFactory;
