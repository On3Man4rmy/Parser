const inputStream = input => {
  let line = 1;
  let pos = 0;
  let col = 0;

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

  return {
    next,
    peek,
    eof,
    croak,
  }
}

export default inputStream;
