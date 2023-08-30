import { z } from 'zod';

type AcceptedValues = string | number | boolean;

type Item<T extends AcceptedValues> = {
  value: T;
  schema: z.Schema<T>;
};

const itemsParser = <const T extends Item<K>, K extends AcceptedValues>(
  items: T[]
) => {};

const parsedItems = itemsParser([
  {
    value: 12,
    //@ts-expect-error
    schema: z.string(),
  },
  {
    value: 'some other value',
    schema: z.string(),
  },
]);
