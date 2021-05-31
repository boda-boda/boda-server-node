import { Injectable } from '@nestjs/common';
import { Client as ElasticSearchClient } from '@elastic/elasticsearch';
import { CreateOuterCareWorkerRequest } from 'src/outer-care-worker/dto/create-outer-care-worker-request';
import SearchRequest from 'src/outer-care-worker/dto/search-request.dto';

@Injectable()
export class SearchService {
  private elasticSearchClient: ElasticSearchClient;
  private outerCareWorkerIndex: string;

  public constructor() {
    this.elasticSearchClient = new ElasticSearchClient({
      node: process.env.ELASTIC_NODE,
      auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
      },
    });
    this.outerCareWorkerIndex = process.env.ELASTIC_CARE_WORKER_INDEX;
  }

  public createOuterCareWorker(cwr: CreateOuterCareWorkerRequest, id: string) {
    cwr.id = id;

    return this.elasticSearchClient.index({
      index: this.outerCareWorkerIndex,
      body: cwr,
    });
  }

  public searchOuterCareWorker(searchRequest: SearchRequest) {
    const filter = this.createFilter(searchRequest);

    return this.elasticSearchClient.search({
      index: this.outerCareWorkerIndex,
      body: {
        from: searchRequest.from,
        size: searchRequest.size,
        query: {
          bool: {
            filter,
          },
        },
      },
    });
  }

  public searchOuterCareWorkerById(id: string) {
    return this.elasticSearchClient.search({
      index: this.outerCareWorkerIndex,
      body: {
        query: {
          term: {
            'id.keyword': id,
          },
        },
      },
    });
  }

  private createFilter(searchRequest: SearchRequest) {
    const filter = [];

    if (searchRequest.schedule) {
      filter.push({
        terms: {
          'outerCareWorker.schedule.keyword': ['', searchRequest.schedule],
        },
      });
    }

    if (searchRequest.city) {
      filter.push({
        terms: {
          'outerCareWorkerAreas.city.keyword': ['', searchRequest.city],
        },
      });
    }

    if (searchRequest.gu) {
      filter.push({
        terms: {
          'outerCareWorkerAreas.gu.keyword': ['', searchRequest.gu],
        },
      });
    }

    if (searchRequest.dong) {
      filter.push({
        terms: {
          'outerCareWorkerAreas.dong.keyword': ['', searchRequest.dong],
        },
      });
    }

    if (searchRequest.capabilities?.length) {
      searchRequest.capabilities.forEach((capa) =>
        filter.push({
          term: {
            'outerCareWorkerCapabilities.keyword': capa,
          },
        }),
      );
    }

    if (searchRequest.religions?.length) {
      searchRequest.religions.forEach((relig) =>
        filter.push({
          term: {
            'outerCareWorker.religion.keyword': relig,
          },
        }),
      );
    }

    return filter;
  }
}
