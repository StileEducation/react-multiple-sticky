"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");

var StickyElement = function (_React$Component) {
    _inherits(StickyElement, _React$Component);

    function StickyElement() {
        _classCallCheck(this, StickyElement);

        return _possibleConstructorReturn(this, (StickyElement.__proto__ || Object.getPrototypeOf(StickyElement)).apply(this, arguments));
    }

    _createClass(StickyElement, [{
        key: "render",
        value: function render() {
            return React.createElement("div", { style: this.props.style, className: this.props.className }, this.props.children);
        }
    }]);

    return StickyElement;
}(React.Component);

exports.default = StickyElement;

var StickyElementContainer = function (_React$Component2) {
    _inherits(StickyElementContainer, _React$Component2);

    function StickyElementContainer() {
        _classCallCheck(this, StickyElementContainer);

        return _possibleConstructorReturn(this, (StickyElementContainer.__proto__ || Object.getPrototypeOf(StickyElementContainer)).apply(this, arguments));
    }

    _createClass(StickyElementContainer, [{
        key: "render",
        value: function render() {
            if (!this.props.children || this.props.children[0].type !== StickyElement) {
                throw new Error("First child of a StickyElementContainer must be a StickyElement!");
            }
            return React.createElement("div", _extends({}, this.props));
        }
    }]);

    return StickyElementContainer;
}(React.Component);

exports.StickyElementContainer = StickyElementContainer;