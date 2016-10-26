// {value} where value is code
export interface CodeItem {
  type: 'code',
  value: string
}
// {value} where value is whitespace
export interface WhitespaceItem {
  type: 'whitespace'
  value: string
}

export type ConstItem = CodeItem | WhitespaceItem;

// [item, item, ...]
export interface ConstList {
  type: 'const'
  items: ConstItem[]
}

// {:name}
export interface ElmList {
  type: 'elm'
  name: string
}

export type ListItem = ConstList | ElmList;

export type List = ListItem[];
