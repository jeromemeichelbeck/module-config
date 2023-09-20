import { beforeEach, describe, expect, it } from 'vitest';
import { createModuleConfig } from '../src/index';
import { z } from 'zod';
let moduleConfig: any;

beforeEach(() => {
  moduleConfig = createModuleConfig([
    {
      key: 'name',
      type: 'text',
      schema: z.string(),
    },
    {
      key: 'age',
      type: 'number',
      schema: z.number().min(18),
      default: 42,
    },
  ]);
});

describe('createModuleConfig', () => {
  describe('set', () => {
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

    it('should throw an error when setting a value that does not respect the schema', () => {
      expect(() => moduleConfig.set('age', 17)).toThrowError();
    });

    it('should not throw an error when setting a value that does not respect the schema with the safe option', () => {
      expect(() =>
        moduleConfig.set('age', 17, { safe: true })
      ).not.toThrowError();
    });

    it('should throw an error when setting a value that does not exist', () => {
      expect(() => moduleConfig.set('foo', 'bar')).toThrowError();
    });

    it('should not throw an error when setting a value that does not exist with the safe option', () => {
      expect(() =>
        moduleConfig.set('foo', 'bar', { safe: true })
      ).not.toThrowError();
    });
  });

  describe('get', () => {
    it('should throw an error when getting a value that does not exist', () => {
      expect(() => moduleConfig.get('foo')).toThrowError();
    });

    it('should not throw an error when getting a value that does not exist with the safe option', () => {
      expect(() => moduleConfig.get('foo', { safe: true })).not.toThrowError();
    });

    it('should return undefined when getting a value that has not been set', () => {
      expect(moduleConfig.get('name')).toBeUndefined();
    });

    it('should return the default value when getting a value that has not been set', () => {
      expect(moduleConfig.get('age')).toBe(42);
    });
  });

  describe('safeSet', () => {
    it('should not throw an error when setting a value with the wrong type', () => {
      expect(() => moduleConfig.safeSet('age', '42')).not.toThrowError();
    });

    it('should not throw an error when setting a value that does not respect the schema', () => {
      expect(() => moduleConfig.safeSet('age', 17)).not.toThrowError();
    });

    it('should not throw an error when setting a value that does not exist', () => {
      expect(() => moduleConfig.safeSet('foo', 'bar')).not.toThrowError();
    });
  });

  describe('safeGet', () => {
    it('should not throw an error when getting a value that does not exist', () => {
      expect(() => moduleConfig.safeGet('foo')).not.toThrowError();
    });

    it('should return undefined when getting a value that has not been set', () => {
      expect(moduleConfig.safeGet('name')).toBeUndefined();
    });

    it('should return the default value when getting a value that has not been set', () => {
      expect(moduleConfig.safeGet('age')).toBe(42);
    });
  });

  describe('fromJson', () => {
    it('should set values correctly', () => {
      moduleConfig.fromJson('{ "name": "John", "age": 23 }');
      expect(moduleConfig.get('name')).toBe('John');
      expect(moduleConfig.get('age')).toBe(23);
    });

    it('should throw an error when setting a value with the wrong type', () => {
      expect(() =>
        moduleConfig.fromJson('{ "name": "John", "age": "42" }')
      ).toThrowError();
    });

    it('should throw an error when setting a value that does not respect the schema', () => {
      expect(() =>
        moduleConfig.fromJson('{ "name": "John", "age": 17 }')
      ).toThrowError();
    });

    it('should not throw an error when setting a value that does not respect the schema with the safe option', () => {
      expect(() =>
        moduleConfig.fromJson('{ "name": "John", "age": 17 }', { safe: true })
      ).not.toThrowError();
    });

    it('should throw an error when setting a value that does not exist', () => {
      expect(() => moduleConfig.fromJson('{ "foo": "bar" }')).toThrowError();
    });

    it('should not throw an error when setting a value that does not exist with the safe option', () => {
      expect(() =>
        moduleConfig.fromJson('{ "foo": "bar" }', { safe: true })
      ).not.toThrowError();
    });
  });

  describe('safeFromJson', () => {
    it('should not throw an error when setting a value with the wrong type', () => {
      expect(() =>
        moduleConfig.safeFromJson('{ "name": "John", "age": "42" }')
      ).not.toThrowError();
    });

    it('should not throw an error when setting a value that does not respect the schema', () => {
      expect(() =>
        moduleConfig.safeFromJson('{ "name": "John", "age": 17 }')
      ).not.toThrowError();
    });

    it('should not throw an error when setting a value that does not exist', () => {
      expect(() =>
        moduleConfig.safeFromJson('{ "foo": "bar" }')
      ).not.toThrowError();
    });
  });

  describe('toJson', () => {
    it('should return the correct JSON', () => {
      moduleConfig.set('name', 'John');
      moduleConfig.set('age', 23);
      expect(moduleConfig.toJson()).toBe('{"name":"John","age":23}');
    });

    it('should return the correct JSON with default values', () => {
      moduleConfig.set('name', 'John');
      expect(moduleConfig.toJson()).toBe('{"name":"John","age":42}');
    });
  });
});
