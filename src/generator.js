const R = require('ramda');

function groupChildren(list) {
  const [before, [item, ...after]] = R.splitWhen(i => i.list, list);
  if (!item) return [before];
  if (!after) return [before, item];
  return [before, item].concat(groupChildren(after));
}

function parseChildrenList(list) {
  const items = groupChildren(list)
    .filter(group => group.length !== 0)
    .map(group => group.list || `[${group.join('')}]`);

  return items.length == 1
    ? items[0]
    : `(${items.join(' ++ ')})`;
}

function parseChildren(children) {
  let first = true;

  const ret = children.map(c => {
    const { expr } = c;
    if (expr) {
      if (expr.whitespace !== undefined) return expr.whitespace;
      if (expr.list) {
        first = true;
        return expr;
      }
    }
    let prefix = "";
    if (first) {
      first = false;
    } else {
      prefix = ", ";
    }
    return prefix + generate(c);
  });

  return (R.any(i => i.list, ret))
    ? parseChildrenList(ret)
    : `[${ret.join("")}]`;
}

function generateExpression(expr) {
  if (expr.code) return expr.code;
  if (expr.text) return `Html.text "${expr.text}"`;
  if (expr.textExpr) return `Html.text ${expr.textExpr}`;
  if (expr.whitespace !== undefined) return expr.whitespace;
  throw `Invalid expression: ${JSON.stringify(expr)}`
}

function generate(state) {
  const { expr } = state;
  if (expr) return generateExpression(expr);

  if (!state.parent) {
    return state.children.map(generate).join("");
  }

  const name = state.name;
  const attributes = state.attributes.join(", ");
  const children = parseChildren(state.children);

  return `Html.${name} [${attributes}] ${children}`;
}

generate.parseChildrenList = parseChildrenList;

module.exports = generate;
