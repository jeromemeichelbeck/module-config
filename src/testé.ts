import { type } from 'os';
import { z } from 'zod';

type FieldTypeMapping = {
  text: string | number;
  password: string;
  email: string;
  number: number;
  textarea: string;
  checkbox: boolean;
  radio: string | number;
  select: string | number;
  // multiselect: string[] | number[]
};

type FieldType = keyof FieldTypeMapping;

type AcceptedValues<T extends FieldType> = FieldTypeMapping[T];

type Item<T extends FieldType, U = z.Schema<AcceptedValues<T>>> = {
  key: string;
  type: T;
  // value: AcceptedValues<T>;
  schema: U;
};

type ValidateItems<TItem> = {
  [I in keyof TItem]: TItem[I] extends Item<
    infer T1 extends FieldType,
    z.Schema<AcceptedValues<infer T2>>
  >
    ? Item<T2, z.Schema<AcceptedValues<T1>>>
    : never;
};

const itemsParser = <T extends Item<any>[] | [any]>(
  _: T & ValidateItems<T>,
) => {};

itemsParser([
  {
    key: 'name',
    type: 'text',
    schema: z.number(),
  },
  // {
  //   key: 'age',
  //   type: 'number',
  //   schema: z.number(),
  // },
  // {
  //   key: 'preferedNumbers',
  //   type: 'select',
  //   value: [7, 8, 23],
  //   schema: z.array(z.number()),
  // },
  // {
  //   key: 'numberOfCrushes',
  //   type: 'select',
  //   value: 3,
  //   schema: z.string(),
  // },
  // {
  //   key: 'numberOfCrashes',
  //   type: 'number',
  //   value: '3',
  //   schema: z.number(),
  // },
  // {
  //   key: 'optin',
  //   type: 'checkbox',
  //   value: false,
  //   schema: z.boolean(),
  // },
]);
