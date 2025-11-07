import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

const ES_NODE = process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200';
const ES_USER = process.env.ELASTIC_USERNAME || 'elastic';
const ES_PASSWORD = process.env.ELASTIC_PASSWORD;

export const es = new Client({
  node: ES_NODE,
  auth: {
    username: ES_USER,
    password: ES_PASSWORD,
  },
  maxRetries: 3,
  requestTimeout: 60000,
  sniffOnStart: false,
  sniffInterval: false,
  ssl: {
    rejectUnauthorized: false,
  },
});

// --- Utility function to wait for Elasticsearch ---
export const waitForElasticsearch = async (retries = 10, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const health = await es.cluster.health();
      console.log('Elasticsearch is ready:', health.status);
      return true;
    } catch (err) {
      console.log(`Elasticsearch not ready, retrying in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('Elasticsearch not available after multiple retries');
};
