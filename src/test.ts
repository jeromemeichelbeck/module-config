import { z } from 'zod';

type AccepptedValues = string | number | boolean;

type Field<T extends AccepptedValues> = {
  key: string;
  schema: z.ZodType<T>;
  value: T;
};

const testField = {
  key: 'name',
  schema: z.number(),
  value: 'some name',
} satisfies Field<string>;

type Fields<T extends AccepptedValues[]> = Field<T[number]>[];

export const createModuleConfig = <const T extends Fields<[number, boolean]>>(
  fields: T
) => {
  return fields[0];
};

const moduleConfig = createModuleConfig([
  {
    key: 'name',
    schema: z.number(),
    value: 12,
  },
  {
    key: 'age',
    schema: z.string(),
    // ^?
    value: false,
  },
]);

const truc = moduleConfig