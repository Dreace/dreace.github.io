---
title: 使用 Python 实现 DES 算法
typora-root-url: ../../source/
date: 2020-07-07 16:15:36
tags:
  - Python
  - DES
categories:
  - Python
---

没有前言，直接进入正题，若需要关于 DES  的详细介绍，请看 [数据加密标准 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E8%B3%87%E6%96%99%E5%8A%A0%E5%AF%86%E6%A8%99%E6%BA%96)。若无特殊说明，本文章所有配图均来自维基百科。第一次使用工具函数时会进行详细介绍。本文章使用的全部代码可以在 [Gist](https://gist.github.com/Dreace/4fc39e0ec2615ad06554e4ef9b9c64b6) 上找到。

<!-- more -->

## 子密钥生成

![子密钥生成过程](/images/Use-Python-to-implement-the-DES-algorithm/250px-DES-key-schedule.png)

初始化时由外部提供密钥，若密钥长度不足 8 字节（64 位）可以在末尾使用 0 补足长度。

```python
if isinstance(key, str):
    key = key.encode()
if len(key) > 8:
    key = key[8:]
elif len(key) < 8:
    key += b"".join(b"\x00" for _ in range(8 - len(key)))
key_bit_list = self._bytes_to_bit_list(key)
```

提供的密钥可以是字符串或者是字节，若是字符串则需要编码得到字节，方便后续的处理，最后将长度裁剪或补足到 8 字节后转换成比特列表。字节到比特列表的函数如下：

```python
def _bytes_to_bit_list(input_bytes: bytes) -> List[int]:
    bit_list = [0] * 8 * len(input_bytes)
    index = 0
    for char_ascii in input_bytes:
        loc = 7
        while loc >= 0:
            bit_list[index] = 0 if char_ascii & (1 << loc) == 0 else 1
            loc -= 1
            index += 1
    return bit_list
```

字节使用 `for` 得到的元素是数字，这里命名为 `char_ascii`，从高位到低位依次取出 `char_ascii` 的每一位填充到比特列表中。

得到密钥的比特列表后需要使用 PC-1 生成两个 28 位半密钥（总共只使用了 56 位密钥，剩下的 8 位可以作为奇偶校验）。

```python
left_half_key_block = self._transform(key_bit_list, pc1_left_table)
right_half_key_block = self._transform(key_bit_list, pc1_right_table)
```

这里使用了一个置换工具函数，这个函数在 DES 算法中应该是最常用的了，通过查表进行变换。

```python
def _transform(raw_list: list, transform_table: List[int]) -> list:
    return list(map(lambda index: raw_list[index], transform_table))
```

在得到两个半密钥后下一步是生成 16 个子密钥，首先将两个半密钥循环左移（左移位数查表得）合并，再通过 PC-2 得到 48 位的子密钥。

```python
sub_key_list = []
for round_index in range(16):
    left_half_key_block = self._circle_left_shift(left_half_key_block, key_left_shift_bits[round_index])
    right_half_key_block = self._circle_left_shift(right_half_key_block, key_left_shift_bits[round_index])
    sub_key_list.append(self._transform(left_half_key_block + right_half_key_block, pc2_table))
self._sub_key_list = sub_key_list
```

`_circle_left_shift` 实现如下：

```python
def _circle_left_shift(input_list: list, bits: int) -> list:
    return input_list[bits:] + input_list[:bits]
```

将输入列表切片再合并实现循环左移效果。

## 分块加密

![整体结构](/images/Use-Python-to-implement-the-DES-algorithm/250px-DES-main-network.png)

一次 DES 加密针对 64 位的明文，首先将明文进行 IP 后再分为两部分。

```python
plain_block = self._transform(plain_block, ip_table)
left_half_block = plain_block[:32]
right_half_block = plain_block[32:]
```


将左半部分与右半部分经过 F 函数后的结果异或得到新的左半部分，原来的左半部分作为新的右半部分。如此进行十六次。

![F 函数](/images/Use-Python-to-implement-the-DES-algorithm/250px-DES-f-function.png)

```python
for round_index in range(16):
    left_half_block, right_half_block = right_half_block, \
                                        self._bit_list_xor(
                                            left_half_block,
                                            self._transform(
                                                self._s_box_transform(
                                                    self._bit_list_xor(
                                                        self._transform(right_half_block,
                                                                        extend_table),
                                                        self._sub_key_list[round_index]
                                                    )
                                                ), p_table
                                            )
                                        )
return self._transform(right_half_block + left_half_block, fp_table)
```

F 函数的过程：

1. 通过扩张置换将 32 位的半块扩展到 48 位
2. 与 48 位的子密钥进行异或
3. 每 6 位进行 S 盒变换，得到 4 位的输出，共 32 位
4. 最后再进行 P 置换

这里涉及到一个比特列表的异或操作，实现如下：

```python
def _bit_list_xor(left: list, right: list) -> List[str]:
    return list(map(lambda x, y: x ^ y, left, right))
```

和 S 盒变换工具函数：

```python
def _s_box_transform(input_list: list) -> list:
    transformed = [0 for _ in range(32)]
    transformed_index = 0
    r = 0
    while r < 48:
        m = (input_list[r] << 1) + input_list[r + 5]
        n = (input_list[r + 1] << 3) + (input_list[r + 2] << 2) + (input_list[r + 3] << 1) + (input_list[r + 4])
        s_value = s_box_tables[r // 6][(m << 4) + n]
        transformed[transformed_index] = (s_value & 8) >> 3
        transformed[transformed_index + 1] = (s_value & 4) >> 2
        transformed[transformed_index + 2] = (s_value & 2) >> 1
        transformed[transformed_index + 3] = s_value & 1
        r += 6
        transformed_index += 4
    return transformed
```

每次取出 6 六位，最高位和最低位计算 `m` 为行号，中间四位计算 `n` 为列号。为了方便处理这里将二维的 S 盒表格展开为一维数组，根据 `m` 和 `n` 取出 S 盒中元素。

最后将元素转换成比特填充到 `transformed` 中。

## 明文加密

加密函数接受字符串和字节作为参数，若明文长度不是 8 的整数倍字节则需要补足。

```python
if isinstance(plain_text, str):
    plain_text = plain_text.encode()
plain_text_len = len(plain_text)
if plain_text_len % 8:
    plain_text += b"".join(b"\x00" for _ in range(8 - plain_text_len % 8))
```

将明文分成 8 字节长的块后分别进行加密，全部块加密完成后得到若干个 64 位长的比特列表，将这些列表合并，再转换成字节。

```python
encrypted_blocks = []
for block in map(lambda s: plain_text[s:s + 8], range(0, plain_text_len, 8)):
    encrypted_blocks.append(self._encrypt_block(self._bytes_to_bit_list(block)))
encrypted_bit_list = list(chain(*encrypted_blocks))
return self._bit_list_to_bytes(encrypted_bit_list)
```

比特列表到字节函数如下：

```python
def _bit_list_to_bytes(bit_list: List[int]) -> bytes:
    char_ascii = 0
    byte_list = []
    for index, bit in enumerate(bit_list):
        char_ascii += bit << (7 - index % 8)
        if index % 8 == 7:
            byte_list.append(char_ascii)
            char_ascii = 0
    return bytes(byte_list)
```

## 解密

解密过程和加密过程完全相同，只不过子密钥使用顺序相反。

```python
def decrypt(self, cipher_text: bytes) -> str:
    self._sub_key_list.reverse()
    plain_text = self.encrypt(cipher_text)
    self._sub_key_list.reverse()
    return plain_text.decode().rstrip('\0')
```

