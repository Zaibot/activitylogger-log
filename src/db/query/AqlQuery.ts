import { Cursor, Database } from 'arangojs';

export type AqlQuery = (literals: TemplateStringsArray, ...placeholders: any[]) => Promise<Cursor>;
export const aqlQuery: (db: Database) => AqlQuery = (db: Database) => (literals: TemplateStringsArray, ...placeholders: any[]) => {
  const bindings: any = {};
  let query = literals[0];
  for (let i = 1; i < literals.length; i++) {
    bindings[`_${i}`] = placeholders[i - 1];
    query += `@_${i}`;
    query += literals[i];
  }
  return db.query(query, bindings);
};
