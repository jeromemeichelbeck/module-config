type DependsOnT<T> = {
  value: T;
};

type Item<T> = {
  key: string;
  value: T;
  dep: DependsOnT<T>;
};

type MyUnion = 'a' | 'b'

type MyType = Item<MyUnion> 

type TransformUnionToItems<T extends PropertyKey> = {
  [P in T]: Item<P>;
}[T];

type TransformedItems = TransformUnionToItems<MyUnion>;


const itemParser = <T extends Item<string | number>>(items: T[]) => {};

const parsedItems = itemParser([
  {
    key: 'name',
    value: 'some name',
    dep: {
      value: 'some name',
    },
  },
  {
    key: 'age',
    value: 12,
    dep: {
      value: '12',
    },
  },
]);
