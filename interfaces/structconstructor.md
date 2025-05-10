[struct-view](../README.md) / [Exports](../modules.md) / StructConstructor

# Interface: StructConstructor<T\>

## Type parameters

Name |
:------ |
`T` |

## Hierarchy

* **StructConstructor**

  ↳ [*StructType*](structtype.md)

## Table of contents

### Constructors

- [constructor](structconstructor.md#constructor)

### Properties

- [BYTES\_PER\_INSTANCE](structconstructor.md#bytes_per_instance)
- [prototype](structconstructor.md#prototype)

### Methods

- [from](structconstructor.md#from)

## Constructors

### constructor

\+ **new StructConstructor**(`buffer?`: ArrayBufferLike, `byteOffset?`: *number*, `byteLength?`: *number*): [*Struct*](../types/struct.md)<T\>

#### Parameters:

Name | Type |
:------ | :------ |
`buffer?` | ArrayBufferLike |
`byteOffset?` | *number* |
`byteLength?` | *number* |

**Returns:** [*Struct*](../types/struct.md)<T\>

Defined in: [struct.ts:7](https://github.com/patrickroberts/struct-view/blob/main/src/struct.ts#L7)

## Properties

### BYTES\_PER\_INSTANCE

• `Readonly` **BYTES\_PER\_INSTANCE**: *number*

Defined in: [struct.ts:13](https://github.com/patrickroberts/struct-view/blob/main/src/struct.ts#L13)

___

### prototype

• `Readonly` **prototype**: [*Struct*](../types/struct.md)<T\>

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

Defined in: [struct.ts:11](https://github.com/patrickroberts/struct-view/blob/main/src/struct.ts#L11)
