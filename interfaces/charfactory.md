[struct-view](../README.md) / [Exports](../modules.md) / CharFactory

# Interface: CharFactory

## Hierarchy

* [*PropertyFactory*](propertyfactory.md)<string\>

* [*ArrayPropertyFactory*](arraypropertyfactory.md)<string\>

  ↳ **CharFactory**

## Callable

▸ **CharFactory**<K\>(`name`: K): [*Decorator*](decorator.md)<Record<K, string\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`K` | *string* |

#### Parameters:

Name | Type |
:------ | :------ |
`name` | K |

**Returns:** [*Decorator*](decorator.md)<Record<K, string\>\>

Defined in: [factories.ts:3](https://github.com/patrickroberts/struct-view/blob/main/src/factories.ts#L3)

▸ **CharFactory**(`length`: *number*): [*PropertyFactory*](propertyfactory.md)<string\>

#### Parameters:

Name | Type |
:------ | :------ |
`length` | *number* |

**Returns:** [*PropertyFactory*](propertyfactory.md)<string\>

Defined in: [factories.ts:7](https://github.com/patrickroberts/struct-view/blob/main/src/factories.ts#L7)
