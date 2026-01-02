export const postMapping = {
  settings: {
    number_of_shards: 2,
    number_of_replicas: 1,
    analysis: {
      filter: {
        edge_ngram_filter: {
          type: 'edge_ngram',
          min_gram: 2,
          max_gram: 20,
        },
        synonym_filter: {
          type: 'synonym',
          synonyms: ['AI, Artificial Intelligence', 'JS, JavaScript'],
        },
      },
      analyzer: {
        edge_ngram_analyzer: {
          tokenizer: 'standard',
          filter: ['lowercase', 'edge_ngram_filter'],
        },
        synonym_analyzer: {
          tokenizer: 'standard',
          filter: ['lowercase', 'synonym_filter'],
        },
      },
    },
  },
  mappings: {
    properties: {
      postId: { type: 'keyword' },
      userId: { type: 'keyword' },
      content: {
        type: 'text',
        analyzer: 'edge_ngram_analyzer',
        search_analyzer: 'synonym_analyzer',
      },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
    },
  },
};
