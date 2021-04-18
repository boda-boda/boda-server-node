import { Injectable } from '@nestjs/common';
import { Client as ElasticSearchClient } from '@elastic/elasticsearch';
import { CreateOuterCareWorkerRequest } from 'src/outer-care-worker/dto/create-outer-care-worker-request';
import SearchRequest from 'src/outer-care-worker/dto/search-request.dto';

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

  public createOuterCareWorker(cwr: CreateOuterCareWorkerRequest, id: string) {
    cwr.id = id;

    return this.elasticSearchClient.index({
      index: 'care-worker',
      body: cwr,
    });
  }

  public searchOuterCareWorker(searchRequest: SearchRequest) {
    const filter = this.createFilter(searchRequest);

    return this.elasticSearchClient.search({
      index: 'care-worker',
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
      index: 'care-worker',
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
          'careWorkerSchedule.keyword': ['', searchRequest.schedule],
        },
      });
    }

    if (searchRequest.city) {
      filter.push({
        terms: {
          'careWorkerAreas.city.keyword': ['', searchRequest.city],
        },
      });
    }

    if (searchRequest.gu) {
      filter.push({
        terms: {
          'careWorkerAreas.gu.keyword': ['', searchRequest.gu],
        },
      });
    }

    if (searchRequest.dong) {
      filter.push({
        term: {
          'careWorkerAreas.dong.keyword': ['', searchRequest.dong],
        },
      });
    }

    if (searchRequest.capabilities?.length) {
      searchRequest.capabilities.forEach((capa) =>
        filter.push({
          term: {
            'careWorkerCapabilities.keyword': capa,
          },
        }),
      );
    }

    if (searchRequest.religions?.length) {
      searchRequest.religions.forEach((relig) =>
        filter.push({
          terms: {
            'careWorkerReligions.keyword': relig,
          },
        }),
      );
    }

    return filter;
  }
}
