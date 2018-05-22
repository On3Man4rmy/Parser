/*import inputStream from "./parser/inputStream.js";
import tokenizer from "./parser/tokenizer.js";
import parser from "./parser/parser.js";
import * as d3 from "../node_modules/d3";*/
const input = document.getElementById("input");
const output = document.getElementById("output");
const chart = document.getElementById("chart");
const parse = (string) => parser(tokenizer(inputStream(string)));
const treeView = tree();
const sourceCode =
`sum = lambda(a, b) {
  a + b;
};
print(sum(1, 2));`

input.addEventListener("input", (e) => {
  const data = parse(e.currentTarget.value).parseTree();
  updateChart(data);
});

const updateChart = data => {
  treeView(data);
}

// http://lisperator.net/pltut/parser/the-parser
console.log(`Thanks to Lisperator.net for the tutorial and source code :D\n`);
const dataTree = parse(input.value).parseTree();
const dataObject = parse(input.value).parseObject();
console.log(dataTree);
console.log(dataObject);
updateChart(dataTree);
