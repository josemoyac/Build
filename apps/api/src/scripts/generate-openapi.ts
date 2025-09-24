import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { dump } from 'yaml';

const doc = {
  openapi: '3.0.3',
  info: {
    title: 'Build API',
    version: '0.1.0',
    description: 'Plataforma de licitaciones para construcción'
  },
  paths: {
    '/auth/login': { post: { summary: 'Login', responses: { '200': { description: 'OK' } } } },
    '/tenders': { get: { summary: 'Listar licitaciones', responses: { '200': { description: 'Listado de licitaciones' } } } }
  }
};

const output = resolve(process.cwd(), '../../openapi.yaml');
writeFileSync(output, dump(doc));
console.log(`OpenAPI spec escrita en ${output}`);
