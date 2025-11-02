//LINK services\search-service\doc\examples\documents.service.example.md

import {
  indexDocumentRepository,
  indexDocumentByIdRepository,
  getDocumentByIdRepository,
  deleteDocumentRepository,
  updateDocumentByIdRepository,
  bulkUpdateDocumentsRepository,
  checkDocumentExistsRepository,
} from "../repositories/documents.repository.js";

export const createDocService = async (index, document) => {
  return await indexDocumentRepository(index, document);
};

export const createDocByIdService = async (index, id, document) => {
  const exists = await checkDocumentExistsRepository(index, id);
  if (exists) {
    const error = new Error();
    error.status = 409;
    throw error;
  }
  return await indexDocumentByIdRepository(index, id, document);
};

export const getDocByIdService = async (index, id) => {
  const result = await getDocumentByIdRepository(index, id);
  return result._source;
};

export const deleteDocService = async (index, id) => {
  const exists = await checkDocumentExistsRepository(index, id);
  if (exists) {
    return await deleteDocumentRepository(index, id);
  } else {
    const error = new Error("Doc does not exist .");
    error.status = 404;
    throw error;
  }
};

export const updateDocByIdService = async (index, id, fieldsToUpdate, force = false) => {
  return await updateDocumentByIdRepository(index, id, fieldsToUpdate, force);
};

export const bulkUpdateDocsService = async (index, documents) => {
  if (!documents || !documents.length) return { items: [], errors: false };

  const checks = await Promise.all(
    documents.map(async (doc) => {
      const exists = await checkDocumentExistsRepository(index, doc.id);
      return exists ? doc : null;
    })
  );

  const existingDocs = checks.filter(Boolean);
  if (existingDocs.length === 0) return { items: [], errors: false };

  const result = await bulkUpdateDocumentsRepository(index, existingDocs);

  if (result.errors) {
    const errors = result.items.filter((item) => item.update?.error).map((item) => ({ id: item.update._id, error: item.update.error }));
    throw new Error(`Bulk update errors: ${JSON.stringify(errors)}`);
  }

  return result;
};
