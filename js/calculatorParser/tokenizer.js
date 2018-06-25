const tokenizer = input => {
  let current = null;
  const keywords = " read write ";

  const isKeyword = word => keywords.indexOf(` ${word} `) >= 0;

  const isDigit = char => /[0-9]/i.test(char);

  const isIdentifierStart = char => /[a-zλ_]/i.test(char);

  const isIdentifier = char => isIdentifierStart(char) || "?!-<>=0123456789".indexOf(char) >= 0;

  const isOperatorChar = char => "+-*/:=".indexOf(char) >= 0;

  const isWhitespace = char => " \t\n".indexOf(char) >= 0;

  const isPunctuation = char => "()".indexOf(char) >= 0;

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
      type: "number",
      value: parseFloat(number),
    }
  }

  const readIndentifier = () => {
    const response = {};
    const identifier = readWhile(isIdentifier);
    if(isKeyword(identifier)) {
      response.type = identifier;
      response.value = identifier;
    } else {
      response.type = "id";
      response.value = identifier;
    }
    return response;
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

  const readNext = () => {
    readWhile(isWhitespace);
    if (input.eof()) {
      return {
        type: "$$",
        value: null
      };
    }
    const char = input.peek();
    if (isDigit(char)) {
      return readNumber();
    }
    if (isIdentifierStart(char)) {
      return readIndentifier();
    }
    if (isPunctuation(char)) {
      return {
        type: char,
        value: char,
      };
    }

    if(isOperatorChar(char)) {
      const operator = readWhile(isOperatorChar);
      return {
        type: operator,
        value: operator,
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

  return {
    next,
    peek,
    eof,
    croak: input.croak,
  }
}
