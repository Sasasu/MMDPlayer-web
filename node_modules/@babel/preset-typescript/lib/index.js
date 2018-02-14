"use strict";

exports.__esModule = true;
exports.default = _default;

var _pluginTransformTypescript = _interopRequireDefault(require("@babel/plugin-transform-typescript"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return {
    plugins: [_pluginTransformTypescript.default]
  };
}