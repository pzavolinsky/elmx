const events:{[event:string]:boolean} =
  { onClick: true
  , onDoubleClick: true
  , onMouseDown: true
  , onMouseUp: true
  , onMouseEnter: true
  , onMouseLeave: true
  , onMouseOver: true
  , onMouseOut: true
  , onInput: true
  , onCheck: true
  , onSubmit: true
  , onSubmitOptions: true
  , onBlur: true
  , onFocus: true
  };

export default (name:string):boolean =>
  !!events[name];
