/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "rockr",

  extras: ($) => [/\s/, $.line_comment, $.block_comment],

  conflicts: ($) => [[$.named_type, $.named_type]],

  word: ($) => $.identifier,

  rules: {
    // ─── Top level ──────────────────────────────────────────────────────────
    source_file: ($) =>
      repeat(choice($.include_decl, $._top_level_item)),

    include_decl: ($) =>
      seq("@include", field("path", $._include_path)),

    _include_path: ($) =>
      choice($.identifier, seq($.identifier, "::", $._include_path)),

    _top_level_item: ($) =>
      choice(
        $.module_decl,
        $.fun_def,
        $.interface_decl,
        $.const_decl,
        $.impl_block,
        $.struct_def,
      ),

    // ─── Module ─────────────────────────────────────────────────────────────
    module_decl: ($) =>
      seq(
        "mod",
        field("name", $.identifier),
        "{",
        repeat($._top_level_item),
        "}",
      ),

    // ─── Struct ─────────────────────────────────────────────────────────────
    struct_def: ($) =>
      seq(
        "struct",
        field("name", $.identifier),
        optional($._template_params),
        "{",
        repeat($.struct_field),
        "}",
      ),

    struct_field: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        field("ty", $._type_expr),
        ";",
      ),

    // ─── Function ───────────────────────────────────────────────────────────
    fun_def: ($) =>
      seq(
        "fun",
        field("name", $.identifier),
        optional($._template_params),
        "(",
        field("params", commaSep($.fun_param)),
        ")",
        ":",
        field("return_type", $._type_expr),
        field("body", $.block),
      ),

    fun_param: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        field("ty", $._type_expr),
      ),

    fun_sig: ($) =>
      seq(
        "fun",
        field("name", $.identifier),
        optional($._template_params),
        "(",
        commaSep($.fun_param),
        ")",
        ":",
        field("return_type", $._type_expr),
        ";",
      ),

    _template_params: ($) =>
      seq("<", commaSep1($.template_param), ">"),

    template_param: ($) =>
      seq(
        field("name", $.identifier),
        optional(seq(":", colonSep1($._type_expr))),
      ),

    // ─── Interface ──────────────────────────────────────────────────────────
    interface_decl: ($) =>
      seq(
        "interface",
        field("name", $.identifier),
        optional($._template_params),
        "{",
        repeat($._interface_item),
        "}",
      ),

    _interface_item: ($) => choice($.interface_type_item, $.fun_sig),

    interface_type_item: ($) =>
      seq(
        "type",
        field("name", $.identifier),
        optional(seq(":", colonSep1($._type_expr))),
        ";",
      ),

    // ─── Const ──────────────────────────────────────────────────────────────
    const_decl: ($) =>
      seq(
        "const",
        field("pat", $._pattern),
        ":",
        field("ty", $._type_expr),
        "=>",
        field("value", $._expr),
        ";",
      ),

    // ─── Impl ───────────────────────────────────────────────────────────────
    impl_block: ($) =>
      seq(
        "impl",
        optional($._template_params),
        optional(seq(field("interface", $._type_expr), "for")),
        field("implemented", $._type_expr),
        "{",
        repeat($._impl_item),
        "}",
      ),

    _impl_item: ($) =>
      choice(
        seq(
          "type",
          field("name", $.identifier),
          "=",
          field("ty", $._type_expr),
          ";",
        ),
        $.fun_def,
      ),

    // ─── Statements ─────────────────────────────────────────────────────────
    block: ($) => seq("{", repeat($._stmt), "}"),

    _stmt: ($) =>
      choice(
        $.return_stmt,
        $.if_stmt,
        $.while_stmt,
        $.for_stmt,
        $.let_decl,
        $.block,
        $.assign_stmt,
        $.compound_assign_stmt,
        $.expr_stmt,
      ),

    return_stmt: ($) => seq("return", optional($._expr), ";"),

    if_stmt: ($) =>
      seq(
        "if",
        field("cond", $._expr),
        field("then", $.block),
        optional(
          seq("else", field("else", choice($.block, $.if_stmt))),
        ),
      ),

    while_stmt: ($) =>
      seq("while", field("cond", $._expr), field("body", $.block)),

    for_stmt: ($) =>
      seq(
        "for",
        field("element", $._pattern),
        "in",
        field("iterator", $._expr),
        field("body", $.block),
      ),

    let_decl: ($) =>
      seq(
        "let",
        field("pat", $._pattern),
        optional(seq(":", field("ty", $._any_type_expr))),
        "=",
        field("value", $._expr),
        ";",
      ),

    assign_stmt: ($) =>
      seq(field("lhs", $._expr), "=", field("rhs", $._expr), ";"),

    compound_assign_stmt: ($) =>
      seq(
        field("lhs", $._expr),
        field("op", $.compound_assign_op),
        field("rhs", $._expr),
        ";",
      ),

    compound_assign_op: ($) => choice("+=", "-=", "*=", "/=", "%="),

    expr_stmt: ($) => seq($._expr, ";"),

    // ─── Expressions ────────────────────────────────────────────────────────
    _expr: ($) =>
      choice(
        $.binary_expr,
        $.unary_expr,
        $.postfix_expr,
        $.call_expr,
        $.method_call_expr,
        $.static_call_expr,
        $.index_expr,
        $.field_access_expr,
        $.struct_lit,
        $.range_expr,
        $.name_resolved_expr,
        $.paren_expr,
        $.sizeof_expr,
        $.identifier,
        $.int_lit,
        $.char_lit,
        $.str_lit,
        $.bool_lit,
      ),

    binary_expr: ($) =>
      choice(
        prec.left(
          10,
          seq($._expr, field("op", choice("+", "-")), $._expr),
        ),
        prec.left(
          11,
          seq($._expr, field("op", choice("*", "/", "%")), $._expr),
        ),
        prec.left(
          1,
          seq($._expr, field("op", choice("==", "!=")), $._expr),
        ),
        prec.left(
          1,
          seq(
            $._expr,
            field("op", choice("<", "<=", ">", ">=")),
            $._expr,
          ),
        ),
        prec.left(3, seq($._expr, field("op", "&&"), $._expr)),
        prec.left(2, seq($._expr, field("op", "||"), $._expr)),
        prec.left(7, seq($._expr, field("op", "&"), $._expr)),
        prec.left(6, seq($._expr, field("op", "|"), $._expr)),
        prec.left(6, seq($._expr, field("op", "^"), $._expr)),
      ),

    range_expr: ($) =>
      prec.left(
        4,
        seq(field("from", $._expr), "..", field("to", $._expr)),
      ),

    unary_expr: ($) =>
      prec(
        15,
        choice(
          seq("&", $._expr),
          seq("-", $._expr),
          seq("!", $._expr),
          seq("@", $._expr),
        ),
      ),

    postfix_expr: ($) =>
      prec(20, choice(seq($._expr, "$"), seq($._expr, "@"))),

    call_expr: ($) =>
      prec(
        20,
        seq(
          field("callee", $._expr),
          "(",
          field("args", commaSep($._expr)),
          ")",
        ),
      ),

    // prec(21): one above field_access_expr so '(' resolves to method call
    method_call_expr: ($) =>
      prec(
        21,
        seq(
          field("object", $._expr),
          ".",
          field("method", $.identifier),
          "(",
          field("args", commaSep($._expr)),
          ")",
        ),
      ),

    static_call_expr: ($) =>
      prec(
        21,
        seq(
          field("ty", $.named_type),
          "::",
          field("method", $.identifier),
          "(",
          field("args", commaSep($._expr)),
          ")",
        ),
      ),

    index_expr: ($) =>
      prec(
        20,
        seq(
          field("object", $._expr),
          "[",
          field("index", $._expr),
          "]",
        ),
      ),

    field_access_expr: ($) =>
      prec(
        20,
        seq(
          field("object", $._expr),
          ".",
          field("field", $.identifier),
        ),
      ),

    name_resolved_expr: ($) =>
      prec.right(1, seq($.identifier, "::", $._expr)),

    paren_expr: ($) => seq("(", commaSep($._expr), ")"),

    sizeof_expr: ($) => seq("@sizeof", "(", $._type_expr, ")"),

    struct_lit: ($) =>
      prec(
        3,
        seq(
          field("ty", $._type_expr),
          "{",
          commaSep($.struct_lit_field),
          "}",
        ),
      ),

    struct_lit_field: ($) =>
      seq(
        ".",
        field("name", $.identifier),
        ":",
        field("value", $._expr),
      ),

    // ─── Types ──────────────────────────────────────────────────────────────
    _type_expr: ($) => choice($.named_type, $.pointer_type),

    _any_type_expr: ($) => choice($._type_expr, $.inferred_type),

    named_type: ($) =>
      prec(
        2,
        choice(
          seq($.identifier, "<", commaSep1($._any_type_expr), ">"),
          seq($.identifier, "::", $._type_expr),
          $.identifier,
        ),
      ),

    pointer_type: ($) => seq("*", $._type_expr),

    inferred_type: ($) => token("_"),

    // ─── Patterns ───────────────────────────────────────────────────────────
    _pattern: ($) =>
      choice(
        $.wildcard_pattern,
        $.constructor_pattern,
        $.tuple_pattern,
        $.name_resolved_pattern,
        $.identifier,
      ),

    wildcard_pattern: ($) => "_",

    constructor_pattern: ($) =>
      seq($.identifier, "(", commaSep($._pattern), ")"),

    tuple_pattern: ($) => seq("(", commaSep($._pattern), ")"),

    name_resolved_pattern: ($) => seq($.identifier, "::", $._pattern),

    // ─── Primitives ─────────────────────────────────────────────────────────
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    int_lit: ($) => /[0-9]+/,

    char_lit: ($) =>
      seq("'", choice(/[^'\\]/, $.escape_sequence), "'"),

    str_lit: ($) =>
      seq('"', repeat(choice(/[^"\\]+/, $.escape_sequence)), '"'),

    escape_sequence: ($) =>
      token(
        seq(
          "\\",
          choice(
            "n",
            "t",
            "r",
            "\\",
            '"',
            "'",
            "0",
            /x[0-9a-fA-F]{2}/,
          ),
        ),
      ),

    bool_lit: ($) => choice("true", "false"),

    // ─── Comments ───────────────────────────────────────────────────────────
    line_comment: ($) => token(seq("//", /.*/)),

    block_comment: ($) =>
      token(seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
  },
});

/**
 * @param {RuleOrLiteral} rule
 */
function commaSep(rule) {
  return optional(commaSep1(rule));
}

/**
 * @param {RuleOrLiteral} rule
 */
function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)), optional(","));
}

/**
 * @param {RuleOrLiteral} rule
 */
function colonSep1(rule) {
  return seq(rule, repeat(seq("+", rule)));
}
