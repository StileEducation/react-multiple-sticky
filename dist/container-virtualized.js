"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var react_virtualized_1 = require("react-virtualized");
var element_1 = require("./element");
var scheduled = false;

var StickyContainerVirtualized = function (_React$Component) {
    _inherits(StickyContainerVirtualized, _React$Component);

    function StickyContainerVirtualized(props) {
        _classCallCheck(this, StickyContainerVirtualized);

        var _this = _possibleConstructorReturn(this, (StickyContainerVirtualized.__proto__ || Object.getPrototypeOf(StickyContainerVirtualized)).call(this, props));

        _this.scrollHandler = function (params) {
            if (_this.props.onScroll) _this.props.onScroll();
            if (scheduled) return;
            scheduled = true;
            window.requestAnimationFrame(function () {
                _this.stickyHeaderHandler(params.scrollTop);
                scheduled = false;
            });
        };
        _this.stickyHeaderHandler = function (scrollTop) {
            if (scrollTop === 0) {
                if (_this.state.index !== null) {
                    _this.setState({
                        width: "100%",
                        index: null,
                        top: 0
                    });
                }
                return;
            }
            var scroll = 0;
            var index = 0;
            var idx = 0;
            var top = 0;
            var child = null;
            var list = React.Children.toArray(_this.props.children);
            var stickyHeight = _this.props.stickyElementHeight || _this.props.elementHeight;
            while (scrollTop > scroll) {
                child = list[idx];
                scroll += child.type === element_1.default ? stickyHeight : _this.props.elementHeight;
                if (child.type === element_1.default) {
                    index = idx;
                }
                idx++;
            }
            child = list[idx];
            if (child.type === element_1.default && scrollTop + stickyHeight > scroll) {
                top = scroll - (scrollTop + stickyHeight);
            }
            if (index !== _this.state.index || top !== _this.state.top) {
                var width = ReactDOM.findDOMNode(_this.refs.list).clientWidth + "px";
                _this.setState({
                    width: width,
                    index: index,
                    top: top
                });
            }
        };
        _this.getCover = function () {
            if (_this.state.index === null || _this.state.top !== 0) return null;
            var style = {
                width: _this.state.width,
                height: _this.props.stickyElementHeight || _this.props.elementHeight,
                position: "absolute",
                top: 0,
                left: 0,
                background: "white",
                zIndex: 10
            };
            return React.createElement("div", { style: style });
        };
        _this.getSticky = function () {
            if (_this.state.index === null) return null;
            var list = React.Children.toArray(_this.props.children);
            var sticky = list[_this.state.index];
            if (!sticky) {
                return null;
            }
            var style = {
                width: _this.state.width,
                position: "absolute",
                top: _this.state.top,
                zIndex: 20
            };
            return React.createElement("div", { className: _this.props.stickyClassName, style: style }, React.createElement(element_1.default, sticky.props));
        };
        _this.getChildren = function () {
            var stickyHeight = _this.props.stickyElementHeight || _this.props.elementHeight;
            var list = React.Children.toArray(_this.props.children);
            var renderRow = function renderRow(_ref) {
                var index = _ref.index,
                    key = _ref.key,
                    style = _ref.style;

                var child = list[index];
                var finalStyle = _extends({}, style, child.props.style);
                return React.cloneElement(child, _extends({}, child.props, { style: finalStyle }));
            };
            var rowHeight = function rowHeight(_ref2) {
                var index = _ref2.index;

                var child = list[index];
                return child.type === element_1.default ? stickyHeight : _this.props.elementHeight;
            };
            var scrollHandler = _this.props.disableStickyHeader ? _this.props.onScroll : _this.scrollHandler;
            return React.createElement(react_virtualized_1.List, { ref: "list", width: _this.props.width, height: _this.props.height, rowCount: list.length, rowHeight: rowHeight, rowRenderer: renderRow, overscanRowCount: _this.props.overscanRowCount, onScroll: scrollHandler, style: { outline: "none", overflowX: "hidden" } });
        };
        _this.state = {
            width: "100%",
            index: null,
            top: 0
        };
        return _this;
    }

    _createClass(StickyContainerVirtualized, [{
        key: "render",
        value: function render() {
            var style = _extends({}, { overflowY: "auto", position: "relative", zIndex: 100 }, this.props.style);
            var contentStyle = _extends({}, { position: "relative" }, this.props.contentStyle);
            return React.createElement("div", { ref: "container", style: style, className: this.props.className }, React.createElement("div", { className: this.props.contentClassName, style: contentStyle }, this.props.disableStickyHeader ? null : this.getCover(), this.props.disableStickyHeader ? null : this.getSticky(), this.getChildren()));
        }
    }, {
        key: "refresh",
        value: function refresh() {
            this.stickyHeaderHandler(ReactDOM.findDOMNode(this.refs.list).scrollTop);
        }
    }, {
        key: "scrollToTop",
        value: function scrollToTop() {
            ReactDOM.findDOMNode(this.refs.list).scrollTop = 0;
        }
    }, {
        key: "currentStickyElementIdentifier",
        value: function currentStickyElementIdentifier() {
            if (this.state.index === null) {
                return;
            }
            var list = React.Children.toArray(this.props.children);
            var currentStickyElement = list[this.state.index];
            if (!currentStickyElement) {
                return;
            }
            return currentStickyElement.props.identifier;
        }
    }]);

    return StickyContainerVirtualized;
}(React.Component);

exports.default = StickyContainerVirtualized;