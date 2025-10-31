import { es } from '../config/es.config.js';
import { logger } from './logger.js';

export const addDocument = async (indexName, document, id = undefined) => {
  if (!indexName) throw new Error('Index name is required');

  if (!document || typeof document !== 'object') {
    throw new Error('Valid document is required');
  }

  try {
    const response = await es.index({
      index: indexName,
      id,
      document,
      refresh: true,
    });

    logger.info(
      `Document added to index "${indexName}" with ID: ${response._id}`
    );
    return response;
  } catch (error) {
    logger.error(
      'Error adding document:',
      error.meta?.body?.error || error.message
    );
    return null;
  }
};

export const countDocument = async (indexName, query = { match_all: {} }) => {
  if (!indexName) throw new Error('Index name is required');

  try {
    const { count } = await es.count({
      index: indexName,
      query,
    });

    logger.info(`Found ${count} documents in "${indexName}"`);

    return count;
  } catch (error) {
    const errMsg = error?.meta?.body?.error?.reason || error.message;

    logger.error(`Error counting documents in "${indexName}":`, errMsg);

    if (error?.meta?.statusCode === 404) {
      logger.warn(`Index "${indexName}" not found.`);
      return 0;
    }

    return null;
  }
};

export const deleteDocument = async (indexName, documentId) => {
  if (!indexName) throw new Error('Index name is required');

  if (!documentId) throw new Error('Document ID is required');

  try {
    const response = await es.delete({
      index: indexName,
      id: documentId,
      refresh: true,
    });

    logger.info(
      `Document with ID "${documentId}" deleted from "${indexName}".`
    );
    return response?.result;
  } catch (error) {
    const status = error?.meta?.statusCode;

    if (status === 404) {
      logger.warn(
        `Document not found (ID: ${documentId}) in index "${indexName}".`
      );
      return null;
    }

    logger.error(
      'Error deleting document:',
      error.meta?.body?.error || error.message
    );
    return null;
  }
};

export const getDocument = async (indexName, documentId) => {
  if (!indexName) throw new Error('Index name is required');

  if (!documentId) throw new Error('Document ID is required');

  try {
    const { _source } = await es.get({
      index: indexName,
      id: documentId,
    });

    logger.info(`Document fetched from "${indexName}" with ID: ${documentId}`);

    return _source;
  } catch (error) {
    const status = error?.meta?.statusCode;

    if (status === 404) {
      logger.warn(
        `Document not found (ID: ${documentId}) in index "${indexName}"`
      );
      return null;
    }

    logger.error(
      `Error fetching document (ID: ${documentId}):`,
      error.meta?.body?.error || error.message
    );
    return null;
  }
};

export const updateDocument = async (indexName, documentId, updatedFields) => {
  if (!indexName) throw new Error('Index name is required');

  if (!documentId) throw new Error('Document ID is required');

  if (!updatedFields || typeof updatedFields !== 'object')
    throw new Error('Updated fields are required');

  try {
    const response = await es.update({
      index: indexName,
      id: documentId,
      doc: updatedFields,
      refresh: true,
    });

    logger.info(
      `Document with ID "${documentId}" updated successfully in "${indexName}".`
    );

    return response;
  } catch (error) {
    const status = error?.meta?.statusCode;

    if (status === 404) {
      logger.warn(
        `Document not found (ID: ${documentId}) in index "${indexName}".`
      );
      return null;
    }

    logger.error(
      `Error updating document (ID: ${documentId}):`,
      error.meta?.body?.error || error.message
    );
    return null;
  }
};

export const createIndex = async (indexName, mappings = {}, settings = {}) => {
  try {
    if (!indexName) {
      logger.warn('IndexName is required');
      return;
    }

    const isExists = await es.indices.exists({ index: indexName });

    if (isExists) {
      logger.warn('Index already Exists');
      return;
    }

    const newIndex = await es.indices.create({
      index: indexName,
      mappings,
      settings,
    });

    logger.info(`Index: ${indexName} Created successfully.`, newIndex);
  } catch (error) {
    logger.error('Error creating Index:', error);
  }
};

export const deleteIndex = async (indexName) => {
  try {
    if (!indexName) {
      logger.info('Index name is required');
      return;
    }

    const exists = await es.indices.exists({ index: indexName });

    if (!exists) {
      logger.warn(`Index "${indexName}" does not exist`);
      return;
    }

    const response = await es.indices.delete({ index: indexName });
    logger.info(`Index "${indexName}" deleted successfully`, response);
  } catch (error) {
    logger.error('Error deleting index:', error);
  }
};

export const isIndexExists = async (indexName) => {
  if (!indexName) {
    logger.error('Index name is required to check existence');
    return false;
  }

  try {
    const exists = await es.indices.exists({ index: indexName });

    return exists;
  } catch (error) {
    logger.error(
      `Error checking if index "${indexName}" exists:`,
      error.meta?.body?.error || error.message
    );
    return false;
  }
};

export const searchPost = async (indexName, query, options = {}) => {
  try {
    if (!indexName) throw new Error('Index name is required');

    if (!query) throw new Error('Query is required');

    const isExists = await isIndexExists(indexName);

    if (!isExists) {
      throw new Error("Index didn't Exist");
    }

    const { from = 0, size = 10, sort } = options;

    const response = await es.search({
      index: indexName,
      query: query,
      from: from,
      size: size,
      sort: sort,
    });

    return {
      total: response.hits.total,
      hits: response.hits.hits.map((hit) => hit._source) || [],
    };
  } catch (error) {
    logger.error(
      'Error searching documents:',
      error.meta?.body?.error || error.message
    );
    return null;
  }
};
