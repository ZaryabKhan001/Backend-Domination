import { Client } from '@elastic/elasticsearch';

export const es = new Client({
  node: 'http://localhost:9200',
  maxRetries: 3,
  requestTimeout: 60000,
  sniffOnStart: false,
  sniffInterval: false,
});
