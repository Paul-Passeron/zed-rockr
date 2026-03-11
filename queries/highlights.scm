; ── Keywords ────────────────────────────────────────────────────────────────

[
  "fun"
  "return"
  "let"
  "const"
  "mod"
  "struct"
  "impl"
  "interface"
  "for"
  "while"
  "if"
  "else"
  "in"
  "type"
] @keyword

; ── Include directive ────────────────────────────────────────────────────────

"@include" @keyword.import

; ── Built-in operators / special syntax ─────────────────────────────────────

"@sizeof" @function.builtin

; ── Boolean literals ─────────────────────────────────────────────────────────

(bool_lit) @boolean

; ── Number literals ──────────────────────────────────────────────────────────

(int_lit) @number

; ── String / char literals ───────────────────────────────────────────────────

(str_lit) @string
(char_lit) @character
(escape_sequence) @escape

; ── Comments ─────────────────────────────────────────────────────────────────

(line_comment) @comment
(block_comment) @comment

; ── Function definitions ─────────────────────────────────────────────────────

(fun_def name: (identifier) @function)
(fun_sig name: (identifier) @function)

; ── Function / method calls ──────────────────────────────────────────────────

(call_expr callee: (identifier) @function.call)
(method_call_expr method: (identifier) @function.method)
(static_call_expr method: (identifier) @function.method)

; ── Type names ───────────────────────────────────────────────────────────────

(named_type (identifier) @type)
(pointer_type "*" @operator (identifier) @type)

; ── Struct definition ────────────────────────────────────────────────────────

(struct_def name: (identifier) @type)
(struct_field name: (identifier) @property)

; ── Struct literal ───────────────────────────────────────────────────────────

(struct_lit_field name: (identifier) @property)

; ── Impl blocks ──────────────────────────────────────────────────────────────

"for" @keyword       ; re-capture "for" in impl context (already covered above)

; ── Interface ────────────────────────────────────────────────────────────────

(interface_decl name: (identifier) @type)

; ── Module ───────────────────────────────────────────────────────────────────

(module_decl name: (identifier) @namespace)

; ── Template parameters ──────────────────────────────────────────────────────

(template_param name: (identifier) @type.parameter)

; ── Function parameters ──────────────────────────────────────────────────────

(fun_param name: (identifier) @variable.parameter)

; ── Field access ─────────────────────────────────────────────────────────────

(field_access_expr field: (identifier) @property)

; ── Let / const patterns ─────────────────────────────────────────────────────

(let_decl pat: (identifier) @variable)
(const_decl pat: (identifier) @constant)

; ── Operators ────────────────────────────────────────────────────────────────

[
  "+"  "-"  "*"  "/"  "%"
  "==" "!=" "<"  "<=" ">"  ">="
  "&&" "||"
  "&"  "|"  "^"
  "!"  ".."
  "+=" "-=" "*=" "/=" "%="
  "="  "=>"
  "::"
  "@"  "$"
] @operator

; ── Punctuation ──────────────────────────────────────────────────────────────

["(" ")" "[" "]" "{" "}"] @punctuation.bracket
["," ";" ":"]             @punctuation.delimiter

; ── Wildcards / inferred ─────────────────────────────────────────────────────

(wildcard_pattern) @constant.builtin
(inferred_type)    @type.builtin

; ── Include path identifiers ─────────────────────────────────────────────────

(include_decl path: (identifier) @namespace)

; ── Generic identifiers (fallback) ───────────────────────────────────────────

(identifier) @variable
