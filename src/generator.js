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
  if (expr.text) return `Html.text "${expr.text.replace(/"/g, '\\"')}"`;
  if (expr.textExpr) return `Html.text ${expr.textExpr}`;
  if (expr.whitespace !== undefined) return expr.whitespace;
  throw `Invalid expression: ${JSON.stringify(expr)}`
}

function generateAttributeList(simple,compound) {
  let all = [
      `[${simple.join(", ")}]`,
      ...compound
  ];
  if (!simple.length && compound.length) all = all.slice(1);
  return (all.length == 1)
    ? all[0]
    : `(${all.join(" ++ ")})`;
}

function generate({ expr, name, parent, attributes, children }) {
  if (expr) return generateExpression(expr);

  if (!parent) {
    return children.map(generate).join("");
  }

  const [compound,simple] = R.partition(x => x
    ? x.match(/^:.*/)
    : false,
    attributes);
  const attrs = generateAttributeList(
    simple,
    compound.map(x => x.slice(1)));
  const childItems = parseChildren(children);
  return `Html.${name} ${attrs} ${childItems}`;
}

generate.parseChildrenList = parseChildrenList;

module.exports = generate;
