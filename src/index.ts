import { z } from 'zod';

type AccepptedType = string | number | boolean | undefined;

type Field<T extends AccepptedType> = {
  key: string;
  schema: z.ZodType<T>;
};

export const createModuleConfig = <
  const TField extends Field<TValue>,
  TValue extends AccepptedType
>(
  fields: TField[]
) => {
  const getValue = <
    K extends TField['key'],
    U extends z.infer<Extract<(typeof fields)[number], { key: K }>['schema']>
  >(
    key: K
  ) => 'some key to retreive' as unknown as U | undefined;
  return { getValue };
};

const getData = createModuleConfig([
  {
    key: 'Field1',
    schema: z.string(),
  },
  {
    key: 'Field2',
    schema: z.number(),
  },
]);

const value1 = getData.getValue('Field1');
//      ^?
const value2 = getData.getValue('Field2');
//      ^?
console.log({ value1, value2 });
