# 構文

複数行で記述するのは`<string>`,`<block>`の二つだけである  

## 文字
```bnf
<empty-text> ::= ''
<eol> ::= '\n' | '\r\n'
<space> ::= ' '
<text> ::= <char>+
; <text> の中に <eol> は現れてはいけない
```

### ファイル
```bnf
<file> ::= <title> <eol> <content>
<title> ::= '#' <space> <title-text>
<title-text> ::= <title-text-elm>+
<title-text-elm> ::= <text> | <inline>
```

### グループ
```bnf
<group> ::= <heading> <eol> <content>
; <group> は次の <heading-level> が等しい <heading> の手前で終了する
<heading> ::= '#' <heading-level> <space> <title-text>
<heading-level> ::= ( '1' | '2' | '3' | '4' )
<content> ::= <content-elm>+
; <content> の最後は <eol> でない
<content-elm> ::= <group> | <block> | <inline> | <string> | <eol>
```

### 要素
```bnf
<block> ::= '{{{' <block-type> ':' <block-option> <eol> <block-content> <eol> '}}}' <eol>
<inline> ::= '{' <inline-type> ':' <inline-content> '}' 
<string> ::= ( <text> | <eol> ' ' )+
; <string> の最後は <eol> ' ' でない
```