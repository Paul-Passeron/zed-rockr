fn main() {
    let src_dir = std::path::Path::new("../../src");
    let mut c_config = cc::Build::new();
    c_config.include(src_dir);
    c_config
        .flag_if_supported("-Wno-unused-variable")
        .flag_if_supported("-Wno-unused-parameter")
        .flag_if_supported("-std=c99");
    #[cfg(target_env = "msvc")]
    c_config.flag("-utf-8");

    let parser_path = src_dir.join("parser.c");
    c_config.file(parser_path);
    c_config.compile("tree-sitter-rockr");
    println!("cargo:rerun-if-changed=../../src/parser.c");
}
