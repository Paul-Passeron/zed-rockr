; ── Scope definitions ────────────────────────────────────────────────────────

(fun_def) @local.scope
(block)   @local.scope
(for_stmt) @local.scope

; ── Definitions ──────────────────────────────────────────────────────────────

(fun_def   name: (identifier) @local.definition)
(fun_param name: (identifier) @local.definition)
(let_decl  pat: (identifier) @local.definition)
(const_decl pat: (identifier) @local.definition)
(struct_def name: (identifier) @local.definition)
(module_decl name: (identifier) @local.definition)
(interface_decl name: (identifier) @local.definition)
(template_param name: (identifier) @local.definition)
(for_stmt element: (identifier) @local.definition)

; ── References ───────────────────────────────────────────────────────────────

(identifier) @local.reference
