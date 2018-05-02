'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (kibana) {
  
  return new kibana.Plugin({
    uiExports: {
      visTypes: ['plugins/markdown_data/markdown_data']
    }
  });
};

module.exports = exports['default'];
