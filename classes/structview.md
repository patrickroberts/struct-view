[struct-view](../README.md) / [Exports](../modules.md) / StructView

# Class: StructView<T\>

## Type parameters

Name | Default |
:------ | :------ |
`T` | {} |

## Table of contents

### Constructors

- [constructor](structview.md#constructor)

### Properties

- [BYTES\_PER\_INSTANCE](structview.md#bytes_per_instance)

### Accessors

- [buffer](structview.md#buffer)
- [byteLength](structview.md#bytelength)
- [byteOffset](structview.md#byteoffset)

### Methods

- [toJSON](structview.md#tojson)
- [from](structview.md#from)

## Constructors

### constructor

\+ **new StructView**<T\>(`buffer?`: ArrayBufferLike, `byteOffset?`: *number*, `byteLength?`: *number*): [*StructView*](structview.md)<T\>

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | {} |

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`buffer` | ArrayBufferLike | - |
`byteOffset` | *number* | 0 |
`byteLength` | *number* | - |

**Returns:** [*StructView*](structview.md)<T\>

Defined in: [struct-view.ts:26](https://github.com/patrickroberts/struct-view/blob/main/src/struct-view.ts#L26)

## Properties

### BYTES\_PER\_INSTANCE

▪ `Static` **BYTES\_PER\_INSTANCE**: *number*= 0

Defined in: [struct-view.ts:8](https://github.com/patrickroberts/struct-view/blob/main/src/struct-view.ts#L8)

## Accessors

### buffer

• get **buffer**(): ArrayBufferLike

**Returns:** ArrayBufferLike

Defined in: [struct-view.ts:39](https://github.com/patrickroberts/struct-view/blob/main/src/struct-view.ts#L39)

___

### byteLength

• get **byteLength**(): *number*

**Returns:** *number*

Defined in: [struct-view.ts:47](https://github.com/patrickroberts/struct-view/blob/main/src/struct-view.ts#L47)

___

### byteOffset

• get **byteOffset**(): *number*

**Returns:** *number*

Defined in: [struct-view.ts:43](https://github.com/patrickroberts/struct-view/blob/main/src/struct-view.ts#L43)

## Methods

### toJSON

▸ **toJSON**(): T

**Returns:** T

Defined in: [struct-view.ts:52](https://github.com/patrickroberts/struct-view/blob/main/src/struct-view.ts#L52)

___

### from

▸ `Static`**from**(`array`: ArrayBufferView, `byteOffset`: *number*, `byteLength?`: *number*): [*Struct*](../types/struct.md)<unknown\>

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`array` | ArrayBufferView | - |
`byteOffset` | *number* | - |
`byteLength` | *number* | 0 |

**Returns:** [*Struct*](../types/struct.md)<unknown\>

Defined in: [struct-view.ts:10](https://github.com/patrickroberts/struct-view/blob/main/src/struct-view.ts#L10)
