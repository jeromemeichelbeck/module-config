type AcceptedValueTypes = string | number | boolean

type DependsOnValue<T extends AcceptedValueTypes> = {
  foo: 'bar'
  test: T
}

type Item<T extends AcceptedValueTypes> = {
  value: T
  dependsOnValue: DependsOnValue<T>
}

type CheckValueMatchesTest<T extends Item<AcceptedValueTypes>> =
  T['value'] extends T['dependsOnValue']['test'] ? T : never

const parseItems = <T extends Item<AcceptedValueTypes>[]>(
  items: CheckValueMatchesTest<T>[]
) => {
  // Your parsing logic here
}

const test = parseItems([
  {
    value: 'test',
    dependsOnValue: {
      foo: 'bar',
      test: 'test',
    },
  },
  {
    value: 1,
    dependsOnValue: {
      foo: 'bar',
      test: 1,
    },
  },
])

// This will result in a type error
const testError = parseItems([
  {
    value: 2,
    dependsOnValue: {
      foo: 'bar',
      test: '2',
    },
  },
])
