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
  const TField extends { [K in FieldType]: Field<K> }[FieldType]
>(
  fields: TField[]
) => {
  const values = new Map();

  const set = <
    TFieldKey extends TField['key'],
    TFieldValue extends z.infer<
      Extract<(typeof fields)[number], { key: TFieldKey }>['schema']
    >
  >(
    key: TFieldKey,
    value: TFieldValue
  ) => values.set(key, value);

  const get = <
    TFieldKey extends TField['key'],
    TFieldValue extends z.infer<
      Extract<(typeof fields)[number], { key: TFieldKey }>['schema']
    >
  >(
    key: TFieldKey
  ) => values.get(key) as TFieldValue | undefined;

  return { set, get };
};
