"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var element_1 = require("./element");
var scheduled = false;

var StickyContainer = function (_React$Component) {
    _inherits(StickyContainer, _React$Component);

    function StickyContainer(props) {
        _classCallCheck(this, StickyContainer);

        var _this = _possibleConstructorReturn(this, (StickyContainer.__proto__ || Object.getPrototypeOf(StickyContainer)).call(this, props));

        _this.onScrollHandler = function () {
            if (scheduled) {
                return;
            }
            scheduled = true;
            window.requestAnimationFrame(function () {
                _this.stickyHeaderHandler();
                scheduled = false;
            });
        };
        _this.stickyHeaderHandler = function () {
            var container = _this.refs.container;
            var state = {
                ref: null,
                height: 0,
                width: 0
            };
            if (_this.props.scrollDirection === "X") {
                state.left = null;
                if (container.scrollLeft === 0) {
                    _this.setState(state);
                    return;
                }
            } else {
                state.top = null;
                if (container.scrollTop === 0) {
                    _this.setState(state);
                    return;
                }
            }
            var sticky = null;
            var node = state;
            Object.keys(_this.refs).filter(function (ref) {
                return ref.startsWith("sticky_");
            }).forEach(function (ref) {
                var element = ReactDOM.findDOMNode(_this.refs[ref]);
                if (_this.props.scrollDirection === "X") {
                    var offsetLeft = element.offsetLeft;
                    if (container.scrollLeft + 2 >= offsetLeft) {
                        if (node && node.left && node.left >= offsetLeft) {
                            return;
                        }
                        node = {
                            ref: ref,
                            left: offsetLeft - element.offsetWidth,
                            height: element.getBoundingClientRect().height,
                            width: element.getBoundingClientRect().width
                        };
                        sticky = element;
                    } else if (sticky) {
                        if (container.scrollLeft + sticky.offsetWidth >= offsetLeft) {
                            state.left = offsetLeft - sticky.offsetWidth;
                        }
                    }
                } else {
                    var offsetTop = element.offsetTop;
                    if (container.scrollTop + 2 >= offsetTop) {
                        if (node && node.top && node.top >= offsetTop) {
                            return;
                        }
                        node = {
                            ref: ref,
                            top: offsetTop - element.offsetHeight,
                            height: element.getBoundingClientRect().height,
                            width: element.getBoundingClientRect().width
                        };
                        sticky = element;
                    } else if (sticky) {
                        if (container.scrollTop + sticky.offsetHeight >= offsetTop) {
                            state.top = offsetTop - sticky.offsetHeight;
                        }
                    }
                }
            });
            if (node && node.ref) {
                if (_this.props.scrollDirection === "X" && node.ref === _this.state.ref && state.left === _this.state.left) {
                    return;
                } else if (_this.props.scrollDirection !== "X" && node.ref === _this.state.ref && state.top === _this.state.top) {
                    return;
                }
                state.ref = node.ref;
                state.height = node.height;
                state.width = node.width;
            }
            _this.setState(state);
        };
        _this.getCover = function () {
            if (!_this.state.ref) return null;
            var style = {
                width: _this.state.width + "px",
                height: _this.state.height + "px",
                position: "fixed",
                top: _this.getContainerTopPosition(),
                left: _this.getContainerLeftPosition(),
                background: "white",
                zIndex: 10
            };
            if (_this.props.scrollDirection === "X") {
                style.display = "inline-block";
            }
            return React.createElement("div", { style: style });
        };
        _this.getSticky = function () {
            if (!_this.state.ref) return null;
            var inTransition = _this.props.scrollDirection === "X" ? _this.state.left !== null : _this.state.top !== null;
            var sticky = _this.refs[_this.state.ref];
            if (!sticky) {
                return null;
            }
            var style = {
                width: _this.state.width + "px",
                height: _this.state.height + "px",
                position: inTransition ? "absolute" : "fixed",
                zIndex: 20
            };
            if (_this.props.scrollDirection === "X") {
                style.left = inTransition ? _this.state.left : _this.getContainerLeftPosition();
                style.display = "inline-block";
                if (_this.refs.container && _this.refs.container.scrollTop !== 0) {
                    style.top = -1 * (_this.refs.container.scrollTop - _this.getContainerTopPosition());
                }
            } else {
                style.top = inTransition ? _this.state.top : _this.getContainerTopPosition();
                if (_this.refs.container && _this.refs.container.scrollLeft !== 0) {
                    style.left = -1 * (_this.refs.container.scrollLeft - _this.getContainerLeftPosition());
                }
            }
            var className = inTransition ? _this.props.stickyTransitionClassName : _this.props.stickyClassName;
            return React.createElement("div", { className: className, style: style }, React.createElement(element_1.default, _extends({}, sticky.props, {
                style: _extends({}, sticky.props.style || {}, {
                    visibility: "visible"
                })
            })));
        };
        _this.getChildren = function () {
            return React.Children.map(_this.props.children, function (child, idx) {
                if (child.type === element_1.default) {
                    return React.cloneElement(child, {
                        ref: "sticky_" + idx,
                        style: {
                            position: "relative",
                            visibility: _this.state.ref === "sticky_" + idx ? "hidden" : "visible",
                            zIndex: _this.state.ref === "sticky_" + idx ? 5 : 15,
                            display: _this.props.scrollDirection === "X" ? "inline-block" : "block"
                        }
                    });
                }
                return child;
            });
        };
        _this.state = {
            ref: null,
            top: 0,
            left: 0,
            height: 0,
            width: 0
        };
        return _this;
    }

    _createClass(StickyContainer, [{
        key: "render",
        value: function render() {
            var _extends2;

            var style = _extends({}, (_extends2 = {}, _defineProperty(_extends2, "overflow" + (this.props.scrollDirection || "Y"), "auto"), _defineProperty(_extends2, "position", "relative"), _defineProperty(_extends2, "zIndex", 100), _extends2), this.props.style);
            var contentStyle = _extends({}, { position: "relative" }, this.props.contentStyle);
            return React.createElement("div", { ref: "container", style: style, onScroll: this.onScrollHandler, className: this.props.className }, React.createElement("div", { className: this.props.contentClassName, style: contentStyle }, this.getCover(), this.getSticky(), this.getChildren()));
        }
    }, {
        key: "refresh",
        value: function refresh() {
            this.onScrollHandler();
        }
    }, {
        key: "resetScroll",
        value: function resetScroll() {
            if (this.props.scrollDirection === "X") {
                this.scrollToLeft();
            } else {
                this.scrollToTop();
            }
        }
    }, {
        key: "scrollToLeft",
        value: function scrollToLeft() {
            this.refs.container.scrollLeft = 0;
        }
    }, {
        key: "scrollToTop",
        value: function scrollToTop() {
            this.refs.container.scrollTop = 0;
        }
    }, {
        key: "currentStickyElementIdentifier",
        value: function currentStickyElementIdentifier() {
            var currentStickyElement = this.refs[this.state.ref];
            if (!currentStickyElement) {
                return;
            }
            return currentStickyElement.props.identifier;
        }
    }, {
        key: "getContainerTopPosition",
        value: function getContainerTopPosition() {
            return this.refs.container.getBoundingClientRect().top;
        }
    }, {
        key: "getContainerLeftPosition",
        value: function getContainerLeftPosition() {
            return this.refs.container.getBoundingClientRect().left;
        }
    }]);

    return StickyContainer;
}(React.Component);

exports.default = StickyContainer;