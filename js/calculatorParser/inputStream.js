//Source: http://lisperator.net/pltut/parser/input-stream
const inputStream = input => {
  let line = 1;
  let pos = 0;
  let col = 0;

  // Read and goto next character
  const next = () => {
    const char = input.charAt(pos++);
    // on newline goto next line and start again from first character
    if (char == "\n") {
      line++;
      col = 0;
    } else {
      col++;
    }
    return char;
  };

  // Read next character
  const peek = () => input.charAt(pos);

  // End of file
  const eof = () => peek() == "";

  // Create error message with current line and column
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
