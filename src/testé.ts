import { z } from 'zod';

type AcceptedValues = string | number | boolean;

type Item<T extends AcceptedValues> = {
  value: T;
  schema: z.Schema<T>;
};

type ValidateItem<TItem extends Item<any>[]> = {
  [I in keyof TItem]: TItem[I] extends {
    value: infer T1 extends AcceptedValues;
    schema: z.Schema<infer T2>;
  }
    ? { value: T2; schema: z.Schema<T1> }
    : never;
};

const itemsParser = <T extends Item<any>[] | [any]>(
  items: T & ValidateItem<T>,
) => {};

itemsParser([
  {
    value: 'string',
    schema: z.string(),
  },
  {
    value: 5,
    schema: z.number(),
  },
  {
    value: [5],
    schema: z.array(z.number()),
  },
  {
    value: 3,
    schema: z.string(),
  },
  {
    value: '3',
    schema: z.number(),
  },
  {
    value: false,
    schema: z.boolean(),
  },
]);
