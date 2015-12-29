var state = null;

function isRoot() {
  return !state;
}

function setHasChildren() {
  if (!state) return;
  state.hasChildren = true;
}

function isFirst() {
  return state && (
    !state.parent
    || !state.parent.hasChildren && state.parent.children.length == 1
  );
}

function enter(name) {
  var node = { name: name, children: [], parent: state }
  if (state) state.children.push(node);
  state = node;
}

function exit() {
  state = state.parent;
}

module.exports =
  { isRoot
  , isFirst
  , enter
  , exit
  , setHasChildren
  };
