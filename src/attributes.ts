import { RawAttribute, Attribute } from './types';

interface AttributeBuffer {
  depth: number
  name: string
  values: string[]
}
interface Data {
  attrs: RawAttribute[]
  buffer?: AttributeBuffer
}

function count(what:string, where:string):number {
  const m = where.match(new RegExp(what, 'g'));
  return m ? m.length : 0;
}

function reduceAttrs(data:Data, attr:RawAttribute):Data {
  const { name, value } = attr;
  const { buffer } = data;

  const currentDepth = buffer
    ? buffer.depth
    : 0;

  const depth = currentDepth + count('{', value) - count('}', value);
  if (depth < 0) {
    throw `Extra '}' in '${value}' for attribute ${
      name || buffer && buffer.name}`;
  }

  if (!buffer) {
    if (depth == 0) return { attrs: data.attrs.concat([attr]) };
    if (depth > 0) return {
      buffer: {
        depth,
        name,
        values: [value]
      },
      attrs: data.attrs
    };
    return data; // unreachable
  }

  if (name !== '') throw `Missing '}' in attribute value before '${name}'`;
  // since name is '', this attr is a continuation of buffer

  const values = buffer.values.concat([value]);

  if (depth > 0) return {
    attrs: data.attrs,
    buffer: {
      depth,
      name: buffer.name,
      values // append value to buffer
    }
  };

  const item:RawAttribute = { name: buffer.name, value: values.join(' ') };
  return { attrs: data.attrs.concat([item]) };
}

const parse = ({ name, value }:RawAttribute):Attribute =>
  name
  ? value.match(/^\{.*\}$/)
    ? { type: 'expr', name, value: value.slice(1, value.length - 1) }
    : { type: 'const', name, value }
  : value.match(/^\{:.*\}$/)
    ? { type: 'list', value: value.slice(2, value.length - 1) }
    : value.match(/^\{.*\}$/)
      ? { type: 'var', value: value.slice(1, value.length - 1) }
      : { type: 'empty', value };

export default function(attrs:RawAttribute[]):Attribute[] {
  const data = attrs
    .map(a => a.value === '' ? { name: '', value: a.name } : a) // flip empty
    .reduce(reduceAttrs, { attrs: [] });
  if (data.buffer) throw `Missing '}' in attribute value`;
  return data.attrs.map(parse);
}
