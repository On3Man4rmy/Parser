let pos = 0;
let line = 1;
let col = 0;
let input;

const next = () => {
  const char = input.charAt(pos++);
  if (char == "\n") {
    line++;
    col = 0;
  } else {
    col++;
  }
  return char;
};

const peek = () => input.charAt(pos);

const eof = () => peek() == "";

const croak = msg => {
  throw new Error(`${msg} (${line}:${col})`);
}

export default data => {
  input = data;
  return {
    next,
    peek,
    eof,
    croak,
  }
};
