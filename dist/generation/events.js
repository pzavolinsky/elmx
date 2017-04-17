"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events = { onClick: true,
    onDoubleClick: true,
    onMouseDown: true,
    onMouseUp: true,
    onMouseEnter: true,
    onMouseLeave: true,
    onMouseOver: true,
    onMouseOut: true,
    onInput: true,
    onCheck: true,
    onSubmit: true,
    onSubmitOptions: true,
    onBlur: true,
    onFocus: true
};
exports.default = function (name) {
    return !!events[name];
};
