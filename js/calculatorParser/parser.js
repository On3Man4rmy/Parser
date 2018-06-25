const node = type => ({
  type,
  values: []
});

const parser = input => {
  const parse_error = () => {
    input.croak(`Unexpected token: "${input.peek().value}"`);
  }

  const readNext = type => {
    if (input.peek().type == type) return input.next();
    else input.croak(`Expecting type: "${type}"`)
  }

  const program = () => {
    const response = node('program');
    switch (input.peek().type) {
      case 'id':
      case 'read':
      case 'write':
        response.values.push(stmt_list());
        response.values.push(readNext('$$'));
        break;
      default:
        parse_error();
    }
    return response;
  }

  const stmt_list = () => {
    const response = node('stmt_list');
    switch (input.peek().type) {
      case 'id':
      case 'read':
      case 'write':
        response.values.push(stmt());
        response.values.push(stmt_list());
        break;
      case '$$':
        break;
      default:
        parse_error();
    }
    return response;
  }

  const stmt = () => {
    const response = node('stmt');
    switch (input.peek().type) {
      case 'id':
        response.values.push(readNext('id'));
        readNext(':=');
        response.values.push(expr());
        break;
      case 'read':
        response.values.push(readNext('read'));
        response.values.push(readNext('id'));
        break;
      case 'write':
        response.values.push(readNext('write'));
        response.values.push(expr());
        break;
      default:
        parse_error();
    }
    return response;
  }

  const expr = () => {
    const response = node('expr');
    switch (input.peek().type) {
      case 'id':
      case 'number':
      case '(':
        response.values.push(term());
        response.values.push(term_tail());
        break;
      default:
        parse_error();
    }
    return response;
  }

  const term_tail = () => {
    const response = node('term_tail');
    switch (input.peek().type) {
      case '+':
      case '-':
        response.values.push(add_op());
        response.values.push(term());
        response.values.push(term_tail());
        break;
      case ')':
      case 'id':
      case 'read':
      case 'write':
      case '$$':
        break;
      default:
        parse_error();
    }
    return response;
  }

  const term = () => {
    const response = node('term');
    switch (input.peek().type) {
      case 'id':
      case 'number':
      case '(':
        response.values.push(factor());
        response.values.push(factor_tail());
        break;
      default:
        parse_error();
    }
    return response;
  }

  const factor_tail = () => {
    const response = node('factor_tail');
    switch (input.peek().type) {
      case '*':
      case '/':
        response.values.push(mult_op());
        response.values.push(factor());
        response.values.push(factor_tail());
        break;
      case ')':
      case '+':
      case '-':
      case 'id':
      case 'read':
      case 'write':
      case '$$':
        break;
      default:
        parse_error();
    }
    return response;
  }

  const factor = () => {
    const response = node('factor');
    switch (input.peek().type) {
      case 'id':
        response.values.push(readNext('id'));
        break;
      case 'number':
        response.values.push(readNext('number'));
        break;
      case '(':
        response.values.push(readNext('('));
        response.values.push(expr());
        response.values.push(readNext(')'));
        break;
      default:
        parse_error();
    }
    return response;
  }

  const add_op = () => {
    const response = node('factor');
    switch (input.peek().type) {
      case '+':
        response.values.push(readNext('+'));
        break;
      case '-':
        response.values.push(readNext('-'));
        break;
      default:
        parse_error();
    }
    return response;
  }

  const mult_op = () => {
    const response = node('factor');
    switch (input.peek().type) {
      case '*':
        response.values.push(readNext('*'));
        break;
      case '/':
        response.values.push(readNext('/'));
        break;
      default:
        parse_error();
    }
    return response;
  }

  const parse = () => program();


  return parse;
}
