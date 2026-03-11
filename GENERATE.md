# Generating the parser

The `src/parser.c` file is produced by the [Tree-sitter CLI](https://tree-sitter.github.io/tree-sitter/creating-parsers#installation).

```bash
# 1. Install the CLI
npm install -g tree-sitter-cli

# 2. From the tree-sitter-rockr directory
cd tree-sitter-rockr
tree-sitter generate

# This writes:
#   src/parser.c
#   src/tree_sitter/parser.h
```

Once generated, commit both files. Zed compiles `parser.c` at extension-install time
using its bundled C compiler — no toolchain is needed on the end user's machine.

## Running tests

```bash
tree-sitter test          # runs test/corpus/*.txt
tree-sitter parse path/to/file.rkr   # ad-hoc parse
```
