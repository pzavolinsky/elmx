const R = require("ramda");
const expr = require("./expression");

const events = R.compose(
  R.fromPairs,
  R.map(n => [n,true])
)([ 'onClick'
  , 'onDoubleClick'
  , 'onMouseDown'
  , 'onMouseUp'
  , 'onMouseEnter'
  , 'onMouseLeave'
  , 'onMouseOver'
  , 'onMouseOut'
  , 'onInput'
  , 'onCheck'
  , 'onSubmit'
  , 'onSubmitOptions'
  , 'onBlur'
  , 'onFocus'
  ]);

function count(what, where) {
  const m = where.match(new RegExp(what, "g"));
  return m ? m.length : 0;
}

function missingCloseBracket(data) {
  throw "Missing '}' in value for attribute '"+data.name+"'";
}

function reduceAttrs(data, attr) {
  const [name, value] = attr;

  const depth = data.depth + count("{", value) - count("}", value);
  if (depth < 0) {
    throw "Extra '}' in '"+value+"' for attribute " + (name || data.name);
  }

  if (!data.depth) {
    if (depth > 0) return { depth, name, values: [value], items: data.items };
    if (depth == 0) return { depth, items: R.append(attr, data.items) };
  }

  if (name !== '') return missingCloseBracket(data);

  const values = R.append(value, data.values);

  if (depth > 0) return R.merge(data, { depth, values: values });

  const item = [data.name, values.join(' ')];
  return { depth, items: R.append(item, data.items) };
}

function mapAttribute(attr) {
  const [name, value] = attr;

  if (name === '') return expr.get(value);

  const attrValue = expr.get(value) || (`"${value}"`);

  return events[name]
    ? `Html.Events.${name} ${attrValue}`
    : `Html.Attributes.attribute "${name}" ${attrValue}`;
}

function parse(attrs) {
  return R.compose(
    R.map(mapAttribute),
    data => data.depth
      ? missingCloseBracket(data)
      : data.items,
    R.reduce(reduceAttrs, { depth: 0, items: [] }),
    R.map(([n,v]) => v === '' ? ['',n] : [n,v]),
    R.toPairs
  )(attrs);
}

module.exports = parse
