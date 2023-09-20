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
  schema: z.ZodSchema<AccepptedValues<K>>;
};

type AcceptedField = {
  [K in FieldType]: Field<K>;
}[FieldType];

type GetSetOptions = {
  safe?: boolean;
};

type FieldValue<
  TField extends Field<FieldType>,
  TFieldKey extends Field<FieldType>['key']
> = z.infer<Extract<TField, { key: TFieldKey }>['schema']>;

type ModuleConfig<TField extends AcceptedField> = {
  set: <
    TFieldKey extends TField['key'],
    TFieldValue extends FieldValue<TField, TFieldKey>
  >(
    key: TFieldKey,
    value: TFieldValue,
    options?: GetSetOptions
  ) => ModuleConfig<TField>;
  safeSet: <
    TFieldKey extends TField['key'],
    TFieldValue extends FieldValue<TField, TFieldKey>
  >(
    key: TFieldKey,
    value: TFieldValue
  ) => ModuleConfig<TField>;
  get: <
    TFieldKey extends TField['key'],
    TFieldValue extends FieldValue<TField, TFieldKey>
  >(
    key: TFieldKey,
    options?: GetSetOptions
  ) => TFieldValue | undefined;
  safeGet: <
    TFieldKey extends TField['key'],
    TFieldValue extends FieldValue<TField, TFieldKey>
  >(
    key: TFieldKey
  ) => TFieldValue | undefined;
};

export const createModuleConfig = <const TField extends AcceptedField>(
  fields: TField[]
): ModuleConfig<TField> => {
  const values = new Map();

  const getFieldFromKey = (key: string) => {
    return fields.find((field) => field.key === key);
  };

  function set<
    TFieldKey extends TField['key'],
    TFieldValue extends FieldValue<TField, TFieldKey>
  >(
    key: TFieldKey,
    value: TFieldValue,
    options: GetSetOptions = { safe: false }
  ) {
    const field = getFieldFromKey(key);
    if (!field) {
      if (options.safe) {
        return { set, get, safeGet, safeSet };
      }
      throw new Error(`Field with key ${key} not found`);
    }

    const parsedValue = field.schema.safeParse(value);

    if (!parsedValue.success) {
      if (options.safe) {
        return { set, get, safeGet, safeSet };
      }
      throw new Error(`Value ${value} is not valid for field ${key}`);
    }

    values.set(key, parsedValue.data);

    return { set, get, safeGet, safeSet };
  }

  function safeSet<
    TFieldKey extends TField['key'],
    TFieldValue extends FieldValue<TField, TFieldKey>
  >(key: TFieldKey, value: TFieldValue) {
    return set(key, value, { safe: true });
  }

  function get<
    TFieldKey extends TField['key'],
    TFieldValue extends FieldValue<TField, TFieldKey>
  >(key: TFieldKey, options: GetSetOptions = { safe: false }) {
    const field = getFieldFromKey(key);
    if (!field) {
      if (options.safe) {
        return undefined;
      }
      throw new Error(`Field with key ${key} not found`);
    }

    return values.get(key) as TFieldValue | undefined;
  }

  function safeGet<
    TFieldKey extends TField['key'],
    TFieldValue extends FieldValue<TField, TFieldKey>
  >(key: TFieldKey) {
    return get(key, { safe: true }) as TFieldValue | undefined;
  }

  return { set, get, safeGet, safeSet };
};
