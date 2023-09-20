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

type AcceptedField = {
  [K in FieldType]: Field<K>;
}[FieldType];

type GetSetOptions = {
  safe?: boolean;
};

export const createModuleConfig = <const TField extends AcceptedField>(
  fields: TField[]
) => {
  const values = new Map();

  const getFieldFromKey = (key: string) => {
    return fields.find((field) => field.key === key);
  };

  const set = <
    TFieldKey extends TField['key'],
    TFieldValue extends z.infer<
      Extract<(typeof fields)[number], { key: TFieldKey }>['schema']
    >
  >(
    key: TFieldKey,
    value: TFieldValue,
    options: GetSetOptions = { safe: false }
  ) => {
    const field = getFieldFromKey(key);
    if (!field) {
      if (options.safe) {
        return { set, get };
      }
      throw new Error(`Field with key ${key} not found`);
    }

    const parsedValue = field.schema.safeParse(value);

    if (!parsedValue.success) {
      if (options.safe) {
        return { set, get };
      }
      throw new Error(`Value ${value} is not valid for field ${key}`);
    }

    values.set(key, parsedValue.data);
    return { set, get };
  };

  const get = <
    TFieldKey extends TField['key'],
    TFieldValue extends z.infer<
      Extract<(typeof fields)[number], { key: TFieldKey }>['schema']
    >
  >(
    key: TFieldKey,
    options: GetSetOptions = { safe: false }
  ) => {
    const field = getFieldFromKey(key);
    if (!field) {
      if (options.safe) {
        return undefined;
      }
      throw new Error(`Field with key ${key} not found`);
    }

    return values.get(key) as TFieldValue | undefined;
  };

  return { set, get };
};