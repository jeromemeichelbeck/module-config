import { beforeAll, describe, expect, it } from 'vitest';
import { createModuleConfig } from '../src/index';
import { z } from 'zod';

let moduleConfig: any;

beforeAll(() => {
  moduleConfig = createModuleConfig([
    {
      key: 'name',
      type: 'text',
      schema: z.string(),
    },
    {
      key: 'age',
      type: 'number',
      schema: z.number(),
    },
  ]);
});

describe('createModuleConfig', () => {
  it('should set a value correctly', () => {
    moduleConfig.set('name', 'John');
    expect(moduleConfig.get('name')).toBe('John');
  });

  it('should set a value correctly', () => {
    moduleConfig.set('age', 42);
    expect(moduleConfig.get('age')).toBe(42);
  });

  it('should throw an error when setting a value with the wrong type', () => {
    expect(() => moduleConfig.set('age', '42')).toThrowError();
  });
});
