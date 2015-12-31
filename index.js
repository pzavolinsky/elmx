var fs = require("fs");
var parse = require("./dist/parser");

var path = process.argv[2];
if (!path) {
  console.error("Usage: elmx file.elmx");
  process.exit(-1);
}

var elmx = fs.readFileSync(path, { encoding: 'UTF-8' });
var elm = parse(elmx);
console.log(elm);
