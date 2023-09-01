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
  multiselect: string[] | number[];
};

type FieldType = keyof FieldTypeMapping;

type AcceptedValues<T extends FieldType> = FieldTypeMapping[T];

type Item<T extends FieldType, U = z.Schema<AcceptedValues<T>>> = {
  key: string;
  type: T;
  // value: AcceptedValues<T>;
  schema: U;
};

type ValidateItems<TItems extends Item<FieldType>[] | [any]> = {
  [I in keyof TItems]: TItems[I] extends Item<
    infer T1 extends FieldType,
    z.Schema<AcceptedValues<infer T2>>
  >
    ? Item<T2, z.Schema<AcceptedValues<T1>>>
    : never;
};

const itemsParser = <TItems extends Item<FieldType>[] | [any]>(
  _: TItems & ValidateItems<TItems>,
) => {};

itemsParser([
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
  {
    key: 'preferedNumbers',
    type: 'multiselect',
    schema: z.array(z.number()),
  },
  {
    key: 'numberOfCrushes',
    type: 'select',
    schema: z.number(),
  },
  {
    key: 'numberOfCrashes',
    type: 'radio',
    schema: z.number(),
  },
  {
    key: 'optin',
    type: 'checkbox',
    schema: z.boolean(),
  },
]);
