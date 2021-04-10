import { Injectable } from '@nestjs/common';
import { Client as ElasticSearchClient } from '@elastic/elasticsearch';

@Injectable()
export class SearchService {
  private elasticSearchClient: ElasticSearchClient;

  public constructor() {
    this.elasticSearchClient = new ElasticSearchClient({
      node: process.env.ELASTIC_NODE,
      auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
      },
    });
  }

  public async createOuterCareWorker(body: any) {
    await this.elasticSearchClient.index({
      index: 'care-worker',
      body: body,
    });
  }
}
