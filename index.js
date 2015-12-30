var fs = require("fs");
var parse = require("./dist/parser");

var path = process.argv[2];
if (!path) {
  console.error("Usage: elmx file.elmx");
  process.exit(-1);
}

var elm = parse(fs.readFileSync(path));
console.log(elm);
