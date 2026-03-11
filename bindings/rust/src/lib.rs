use tree_sitter::Language;

extern "C" {
    fn tree_sitter_rockr() -> Language;
}

/// Returns the tree-sitter [`Language`] for Rockr.
pub fn language() -> Language {
    unsafe { tree_sitter_rockr() }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_grammar_loads() {
        let lang = language();
        assert!(lang.version() > 0);
    }
}
