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

export const createModuleConfig = <
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
    key: 'optin',
    type: 'checkbox',
    // @ts-expect-error
    schema: z.number(),
  },
]);

const value1 = moduleConfig.getValue('name');
//      ^?
const value2 = moduleConfig.getValue('optin');
//      ^?
// @ts-expect-error
const value3 = moduleConfig.getValue('o');
//      ^?
