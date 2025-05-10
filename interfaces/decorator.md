[struct-view](../README.md) / [Exports](../modules.md) / Decorator

# Interface: Decorator<T\>

## Type parameters

Name |
:------ |
`T` |

## Hierarchy

* **Decorator**

  ↳ [*StructType*](structtype.md)

## Callable

▸ **Decorator**<U\>(`Base`: [*StructConstructor*](structconstructor.md)<U\>, `byteOffset`: *number*): [*StructConstructor*](structconstructor.md)<T & U\>

#### Type parameters:

Name |
:------ |
`U` |

#### Parameters:

Name | Type |
:------ | :------ |
`Base` | [*StructConstructor*](structconstructor.md)<U\> |
`byteOffset` | *number* |

**Returns:** [*StructConstructor*](structconstructor.md)<T & U\>

Defined in: [decorator.ts:3](https://github.com/patrickroberts/struct-view/blob/main/src/decorator.ts#L3)
