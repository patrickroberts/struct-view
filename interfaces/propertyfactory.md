[struct-view](../README.md) / [Exports](../modules.md) / PropertyFactory

# Interface: PropertyFactory<T\>

## Type parameters

Name |
:------ |
`T` |

## Hierarchy

* **PropertyFactory**

  ↳ [*ArithmeticFactory*](arithmeticfactory.md)

  ↳ [*CharFactory*](charfactory.md)

## Callable

▸ **PropertyFactory**<K\>(`name`: K): [*Decorator*](decorator.md)<Record<K, T\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`K` | *string* |

#### Parameters:

Name | Type |
:------ | :------ |
`name` | K |

**Returns:** [*Decorator*](decorator.md)<Record<K, T\>\>

Defined in: [factories.ts:3](https://github.com/patrickroberts/struct-view/blob/main/src/factories.ts#L3)
