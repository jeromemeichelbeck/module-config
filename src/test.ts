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

type Field<T extends FieldType, U = z.Schema<AcceptedValues<T>>> = {
  key: string;
  type: T;
  schema: U;
};

type ValidateFields<TFields extends Field<FieldType>[] | [any]> = {
  [I in keyof TFields]: TFields[I] extends Field<
    infer T1 extends FieldType,
    z.Schema<AcceptedValues<infer T2>>
  >
    ? Field<T2, z.Schema<AcceptedValues<T1>>>
    : never;
};

const createModuleConfig = <
  const TField extends Field<TFieldType>,
  TFieldType extends FieldType,
>(
  fields: TField[],
) => {
  const getValue = <
    TFieldKey extends TField['key'],
    TFieldValue extends z.infer<
      Extract<(typeof fields)[number], { key: TFieldKey }>['schema']
    >,
  >(
    key: TFieldKey,
  ) => 'some key to retreive' as unknown as TFieldValue | undefined;
  return { getValue };
};

const moduleConfig = createModuleConfig([
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
    // @ts-expect-error
    schema: z.boolean(),
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

const value1 = moduleConfig.getValue('name');
//      ^?
const value2 = moduleConfig.getValue('optin');
//      ^?
