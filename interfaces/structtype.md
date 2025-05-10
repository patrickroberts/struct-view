[struct-view](../README.md) / [Exports](../modules.md) / StructType

# Interface: StructType<T\>

## Type parameters

Name |
:------ |
`T` |

## Hierarchy

* [*StructConstructor*](structconstructor.md)<T\>

* [*Decorator*](decorator.md)<T\>

* [*ReadonlyPropertyFactory*](readonlypropertyfactory.md)<[*Struct*](../types/struct.md)<T\>\>

* [*ReadonlyArrayPropertyFactory*](readonlyarraypropertyfactory.md)<readonly [*Struct*](../types/struct.md)<T\>[]\>

  ↳ **StructType**

## Callable

▸ **StructType**<U\>(`Base`: [*StructConstructor*](structconstructor.md)<U\>, `byteOffset`: *number*): [*StructConstructor*](structconstructor.md)<T & U\>

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

▸ **StructType**<K\>(`name`: K): [*Decorator*](decorator.md)<Readonly<Record<K, [*Struct*](../types/struct.md)<T\>\>\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`K` | *string* |

#### Parameters:

Name | Type |
:------ | :------ |
`name` | K |

**Returns:** [*Decorator*](decorator.md)<Readonly<Record<K, [*Struct*](../types/struct.md)<T\>\>\>\>

Defined in: [factories.ts:11](https://github.com/patrickroberts/struct-view/blob/main/src/factories.ts#L11)

▸ **StructType**(`length`: *number*): [*ReadonlyPropertyFactory*](readonlypropertyfactory.md)<readonly [*Struct*](../types/struct.md)<T\>[]\>

#### Parameters:

Name | Type |
:------ | :------ |
`length` | *number* |

**Returns:** [*ReadonlyPropertyFactory*](readonlypropertyfactory.md)<readonly [*Struct*](../types/struct.md)<T\>[]\>

Defined in: [factories.ts:15](https://github.com/patrickroberts/struct-view/blob/main/src/factories.ts#L15)

## Table of contents

### Constructors

- [constructor](structtype.md#constructor)

### Properties

- [BYTES\_PER\_INSTANCE](structtype.md#bytes_per_instance)
- [prototype](structtype.md#prototype)

### Methods

- [from](structtype.md#from)

## Constructors

### constructor

\+ **new StructType**(`buffer?`: ArrayBufferLike, `byteOffset?`: *number*, `byteLength?`: *number*): [*Struct*](../types/struct.md)<T\>

#### Parameters:

Name | Type |
:------ | :------ |
`buffer?` | ArrayBufferLike |
`byteOffset?` | *number* |
`byteLength?` | *number* |

**Returns:** [*Struct*](../types/struct.md)<T\>

Inherited from: [StructConstructor](structconstructor.md)

Defined in: [struct.ts:7](https://github.com/patrickroberts/struct-view/blob/main/src/struct.ts#L7)

## Properties

### BYTES\_PER\_INSTANCE

• `Readonly` **BYTES\_PER\_INSTANCE**: *number*

Inherited from: [StructConstructor](structconstructor.md).[BYTES_PER_INSTANCE](structconstructor.md#bytes_per_instance)

Defined in: [struct.ts:13](https://github.com/patrickroberts/struct-view/blob/main/src/struct.ts#L13)

___

### prototype

• `Readonly` **prototype**: [*Struct*](../types/struct.md)<T\>

Inherited from: [StructConstructor](structconstructor.md).[prototype](structconstructor.md#prototype)

Defined in: [struct.ts:7](https://github.com/patrickroberts/struct-view/blob/main/src/struct.ts#L7)

## Methods

### from

▸ **from**(`array`: ArrayBufferView, `byteOffset?`: *number*, `byteLength?`: *number*): [*Struct*](../types/struct.md)<T\>

#### Parameters:

Name | Type |
:------ | :------ |
`array` | ArrayBufferView |
`byteOffset?` | *number* |
`byteLength?` | *number* |

**Returns:** [*Struct*](../types/struct.md)<T\>

Inherited from: [StructConstructor](structconstructor.md)

Defined in: [struct.ts:11](https://github.com/patrickroberts/struct-view/blob/main/src/struct.ts#L11)
