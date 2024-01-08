# トークナイザの状態遷移

## 全体図
```mermaid
stateDiagram-v2
```
## 部分
```mermaid
stateDiagram-v2
start --> doctitle_1: sharp&'sharp
start --> subtitle_1: sharp&'!sharp
start --> Error: *

doctitle_1 --> doctitle_2: *
doctitle_2 --> doctitle.blank: space
doctitle_2 --> block: LF
doctitle_2 --> doctitle.main: *
doctitle.blank --> doctitle.blank: space
doctitle.blank --> block: LF
doctitle.blank --> doctitle.main: *
doctitle.main --> block: LF
doctitle.main --> doctitle.main: *

block --> Error: *
```