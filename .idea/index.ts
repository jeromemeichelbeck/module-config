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

moduleConfig.safeSet('name', 'John').safeSet('age', '17',);
moduleConfig.safeSet('lol', 'nimp');

const name = moduleConfig.safeGet('name'); // string
const age = moduleConfig.safeGet('age'); // number
const nimp = moduleConfig.safeGet('lol'); // string

console.log(name, age, nimp);
