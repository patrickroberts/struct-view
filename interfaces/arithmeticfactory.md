[struct-view](../README.md) / [Exports](../modules.md) / ArithmeticFactory

# Interface: ArithmeticFactory<T\>

## Type parameters

Name | Type |
:------ | :------ |
`T` | Types |

## Hierarchy

* [*PropertyFactory*](propertyfactory.md)<*TypedArray*<T\>[*number*]\>

* [*ReadonlyArrayPropertyFactory*](readonlyarraypropertyfactory.md)<TypedArray<T\>\>

  ↳ **ArithmeticFactory**

## Callable

▸ **ArithmeticFactory**<K\>(`name`: K): [*Decorator*](decorator.md)<Record<K, *InstanceType*<TypedArrayConstructor<T\>\>[*number*]\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`K` | *string* |

#### Parameters:

Name | Type |
:------ | :------ |
`name` | K |

**Returns:** [*Decorator*](decorator.md)<Record<K, *InstanceType*<TypedArrayConstructor<T\>\>[*number*]\>\>

Defined in: [factories.ts:3](https://github.com/patrickroberts/struct-view/blob/main/src/factories.ts#L3)

▸ **ArithmeticFactory**(`length`: *number*): [*ReadonlyPropertyFactory*](readonlypropertyfactory.md)<InstanceType<TypedArrayConstructor<T\>\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`length` | *number* |

**Returns:** [*ReadonlyPropertyFactory*](readonlypropertyfactory.md)<InstanceType<TypedArrayConstructor<T\>\>\>

Defined in: [factories.ts:15](https://github.com/patrickroberts/struct-view/blob/main/src/factories.ts#L15)
