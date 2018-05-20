let input;
let current = null;
let keywords = " if then else lambda λ true false ";

const isKeyword = word => keywords.indexOf(` ${word} `) >= 0;

const isDigit = char => /[0-9]/i.test(char);

const isIdentifierStart = char => /[a-zλ_]/i.test(char);

const isIdentifier = char => isIdentifierStart(char) || "?!-<>=0123456789".indexOf(char) >= 0;

const isOperatorChar = char => "+-*/%=&|<>!".indexOf(char) >= 0;

const isPunctuation = char => ",;(){}[]".indexOf(char) >= 0;

const isWhitespace = char => " \t\n".indexOf(char) >= 0;

const readWhile = predicate => {
  let string = "";
  while(!input.eof() && predicate(input.peek())) {
    string += input.next();
  }
  return string;
}

const readNumber = () => {
  let has_dot = false;
  let number = readWhile((char) => {
    if (char != ".") {
      if (has_dot) {
        return false;
      }
      has_dot = true;
      return true;
    }
    return isDigit(char);
  });
  return {
    type: "num",
    value: parseFloat(number),
  }
}

const readIndentifier = () => {
  const identifier = readWhile(isIdentifier);
  return {
    type: isKeyword(identifier) ? "kw" : "var",
    value: identifier,
  }
}

const readEscaped = end => {
  let escaped = false;
  let string = "";
  while(!input.eof()) {
    const char = input.next();
    if (escaped) {
      string += char;
      escaped = false;
    } else if (char == "\\") {
      escaped = true;
    } else if (char == end) {
      break;
    } else {
      string += char;
    }
  }
  return string;
}

const readString = () => {
  return {
    type: "string",
    value: readEscaped('"'),
  };
}

const skipComment = () => {
  readWhile((char) => char != "\n");
  input.next();
}

const readNext = () => {
  readWhile(isWhitespace);
  if (input.eof()) {
    return null;
  }
  const char = input.peek();
  if (char == "#") {
    skipComment();
    return readNext;
  }
  if (char == '"') {
    return readString();
  }
  if (isDigit(char)) {
    return readNumber();
  }
  if (isIdentifierStart(char)) {
    return readIndentifier();
  }
  if (isPunctuation(char)) {
    return {
      type: "punc",
      value: input.next(),
    };
  }
  if(isOperatorChar(char)) {
    return {
      type: "op",
      value: readWhile(isOperatorChar),
    }
  }
  input.croak(`Can´t handle character: ${char}`);
}

const peek = () => current || (current = readNext());

const next = () => {
  const token = current;
  current = null;
  return token || readNext();
}

const eof = () => peek() == null;

export default data => {
  input = data;
  return {
    next,
    peek,
    eof,
    croak: input.croak,
  }
};
