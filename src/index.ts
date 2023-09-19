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
    value: TFieldValue
  ) => {
    const field = getFieldFromKey(key);
    if (!field) {
      throw new Error(`Field with key ${key} not found`);
    }

    values.set(key, field.schema.parse(value));
    return { set, get };
  };

  const get = <
    TFieldKey extends TField['key'],
    TFieldValue extends z.infer<
      Extract<(typeof fields)[number], { key: TFieldKey }>['schema']
    >
  >(
    key: TFieldKey
  ) => {
    const field = getFieldFromKey(key);
    if (!field) {
      throw new Error(`Field with key ${key} not found`);
    }

    return values.get(key) as TFieldValue | undefined;
  };

  return { set, get };
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
]);

moduleConfig.set('name', 'John').set('age', 42);

const name = moduleConfig.get('name'); // string
const age = moduleConfig.get('age'); // number

console.log(name, age);
