let input ;
const FALSE = {
  type: "bool",
  value: false,
}

const PRECEDENCE = {
  "=": 1,
  "||": 2,
  "&&": 3,
  "<": 7, ">": 7, "<=": 7, "==": 7, "!=": 7,
  "+": 10, "-": 10,
  "*": 20, "/": 20, "%": 20,
};


// TODO WHAT!?!? 2 times looking for token
const isPunctuation = char => {
  const token = input.peek();
  return token && token.type == "punc" && (!char || token.value == char) && token;
}

const isKeyword = keyword  => {
  const token = input.peek();
  return token && token.type == "kw" && (!keyword || token.value == keyword) && token;
}

const isOperator = operator => {
  const token = input.peek();
  return token && token.type == "op" && (!operator || token.value == operator) && token;
}

const skipPunctuation = char => {
  if (isPunctuation(char)) input.next();
  else input.croak(`Expecting punctuation: "${char}"`)
}

const skipKeyword = keyword => {
  if (isKeyword(keyword)) input.next();
  else input.croak(`Expecting keyword: "${keyword}"`)
}

const skipOperator = operator => {
  if (isOperator(operator)) input.next();
  else input.croak(`Expecting operator: "${operator}"`)
}

const unexpected = () => {
  input.croak(`Unexpected token: "${JSON.stringify(input.peek())}"`);
}

const maybeBinary = (left, myPrecedence) => {
  const token = isOperator();
  if(token) {
    const hisPrecedence = PRECEDENCE[token.value];
    if(hisPrecedence > myPrecedence) {
      input.next();
      const right = maybeBinary(parseAtom(), hisPrecedence);
      const binary = {
        type: token.value == "=" ? "assign" : "binary",
        operator: token.value,
        left,
        right,
      };
      return maybeBinary(binary, myPrecedence);
    }
  }
  return left;
}

const delimited = (start, stop, separator, parser) => {
  const elements = [];
  let first = true;
  skipPunctuation(start);
  while(!input.eof()) {
    if (isPunctuation(stop)) break;
    if (first) first = false; else skipPunctuation(separator);
    if (isPunctuation(stop)) break;
    elements.push(parser());
  }
  skipPunctuation(stop);
  return elements;
}

const parseCall = func => ({
  type: "call",
  func,
  args: delimited("(", ")", ",", parseExpression),
})

const parseVarname = () => {
  const name = input.next();
  if(name.type != "var") input.croak("Expecting variable name");
  return name.value;
}

const parseIf = () => {
  skipKeyword("if");
  const condition = parseExpression();
  if(!isPunctuation) skipKeyword("then");
  const then = parseExpression;
  const response = {
    type: "if",
    condition,
    then,
  }
  if (isKeyword("else")) {
    response.else = parseExpression;
  }
  return response;
}

const parseLambda = () => ({
  type: "lambda",
  vars: delimited("(", ")", ",", parseVarname),
  body: parseExpression(),
});

const parseBool = () => ({
  type: "bool",
  value: input.next().value,
})

const maybeCall = expression => {
  expression = expression();
  return isPunctuation("(") ? parseCall(expression) : expression;
}

const parseAtom = () => {
  return maybeCall(() => {
    if (isPunctuation("(")) {
      input.next();
      const expression = parseExpression();
      skipPunctuation(")");
      return expression;
    }
    if (isPunctuation("{")) return parseProg();
    if (isKeyword("if")) return parseIf();
    if (isKeyword("true") || isKeyword("false")) return parseBool();
    if (isKeyword("lambda") || isKeyword("λ")) {
      input.next();
      return parseLambda();
    }
    const token = input.next();
    if(token.type == "var" || token.type == "num" || token.type == "str") {
      return token;
    }
    unexpected();
  })
}

const parse_toplevel = () => {
  let program = [];
  while(!input.eof()) {
    program.push(parseExpression());
    if(!input.eof()) {
      skipPunctuation(";");
    }
  }
  return {
    type: "prog",
    program,
  }
}

const parseProg = () => {
  const prog = delimited("{", "}", ";", parseExpression);
  if(prog.length == 0) return FALSE;
  if(prog.length == 1) return prog[0];
  return {
    type: "prog",
    prog,
  }
}

const parseExpression = () => maybeCall(() => maybeBinary(parseAtom(), 0));

export default data => {
  input = data;
  return parse_toplevel();
}
