import { z } from 'zod';
import { createModuleConfig } from '../src/index';

const moduleConfig = createModuleConfig([
  {
    key: 'name',
    type: 'text',
    schema: z.string(),
  },
  {
    key: 'age',
    type: 'number',
    schema: z.number().min(18),
  },
]);

moduleConfig.set('name', 'John').set('age', '17', { safe: true });
moduleConfig.set('lol', 'nimp', { safe: true });

const name = moduleConfig.get('name'); // string
const age = moduleConfig.get('age'); // number
const nimp = moduleConfig.get('lol', { safe: true }); // string

console.log(name, age, nimp);
