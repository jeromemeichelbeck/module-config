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

type AccepptedValues<K extends FieldType> = FieldTypeMapping[K];

type Field<K extends FieldType> = {
  key: string;
  type: K;
  schema: z.ZodType<AccepptedValues<K>>;
};

export const createModuleConfig = <
  const TField extends Field<TFieldType>,
  TFieldType extends FieldType
>(
  fields: TField[]
) => {
  const getValue = <
    TFieldKey extends TField['key'],
    TFieldValue extends z.infer<Extract<(typeof fields)[number], { key: TFieldKey }>['schema']>
  >(
    key: TFieldKey
  ) => 'some key to retreive' as unknown as TFieldValue | undefined;
  return { getValue };
};

const moduleConfig = createModuleConfig([
  {
    key: 'name',
    type: 'text',
    schema: z.boolean(),
  },
  {
    key: 'optin',
    type: 'checkbox',
    schema: z.string(),
  },
]);

const value1 = moduleConfig.getValue('name');
      // ^?
const value2 = moduleConfig.getValue('optin');
      // ^? 