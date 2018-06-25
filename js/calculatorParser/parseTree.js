const parseTree = (tree) => {
  const name = tree.type;
  const children = tree.values ? tree.values.map(child => parseTree(child)) : null;
  return {
    name,
    ...(children ? {children} : {})
  }
}
