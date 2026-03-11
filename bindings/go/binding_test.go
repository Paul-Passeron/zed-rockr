package tree_sitter_rockr_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-rockr"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_rockr.Language())
	if language == nil {
		t.Errorf("Error loading Rockr grammar")
	}
}
