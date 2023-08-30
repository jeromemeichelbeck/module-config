import { z } from 'zod'

type Field<T extends string | number> = {
  key: string
  type: 'truc' | 'machin'
  value: T
  schema: z.ZodType<T>
}

const prout: Field<string> = {
  key: 'name',
  type: 'truc',
  value: 'string',
  schema: z.string(),
}

export const createModuleConfig = <
  T extends Field<K>[],
  K extends string | number
>(
  fields: T
) => {}

const moduleConfig = createModuleConfig([
  {
    key: 'name',
    type: 'truc',
    value: 'truc',
    schema: z.string(),
  },
  {
    key: 'puceau',
    type: 'truc',
    value: 12,
    schema: z.string(),
  },
])
