import inputStream from "./parser/inputStream.js";
import tokenizer from "./parser/tokenizer.js";
import parser from "./parser/parser.js";
const input = document.getElementById("input");
const output = document.getElementById("output");

const parse = (string) => parser(tokenizer(inputStream(string)));
const sourceCode =
`sum = lambda(a, b) {
  a + b;
};
print(sum(1, 2));`

// http://lisperator.net/pltut/parser/the-parser
console.log(`Thanks to Lisperator.net for the tutorial and source code :D\n`);
console.log(`Source:\n${sourceCode}\n`)
console.log(`Evaluated:`);
console.log(parse(sourceCode));

input.addEventListener("input", (e) => {
  output.textContent = JSON.stringify(parse(e.currentTarget.value));
});
