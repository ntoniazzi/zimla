module.exports = function (source, map, meta) {
    const callback = this.async();

    let config = JSON.parse(source);
    let dir = this.context;

    // console.log("this is howler-loader", map, meta);

    let files = [];
    config.src.forEach((ref, index) => {
        // console.log("  calling resolve(%s, %s) for %o", dir, ref, index);
        let filename = dir + '/' + ref;
        let varName = "__HOWLER_SRC_" + files.length;
        let importName = "__HOWLER_IMPORT_" + files.length;
        files.push({file: filename, var: varName, import: importName});
        config.src[index] = varName;
    });

    let imports = "// imports\n";
    let vars = "// vars\n";
    let exports = "// export\n";

    files.forEach(item => {
        // this.addDependency(item.file);
        imports += `import ${item.import} from "file-loader!${item.file}";\n`;
        vars += `var ${item.var} = ${item.import};\n`;
    });

    let s = JSON.stringify(config);
    exports += `export default ${s.replace(/"(__HOWLER.*?)"/, "$1")};\n`

    let code = `${imports}${vars}${exports}`;
    // console.log(code);

    callback(null, code);
}
