'use strict';

var React = require('react')
var Tabs  = require('react-basic-tabs')
var copy  = require('copy-utils').copy
var TabsFactory = React.createFactory(Tabs)

var ARROW_DEFAULTS = {
    color : 'rgb(237, 227, 227)',
    width : 6,
    height: 6
}

function emptyFn(){}

var TabPanel = React.createClass({

    displayName: 'TabPanel',

    getDefaultProps: function() {
        return {
            defaultStripStyle: {
                textOverflow: 'ellipsis',
                overflow    : 'hidden',
                whiteSpace  : 'nowrap'
            },

            scrollerFactory: function(props, side) {
                var style = copy(props.style)
                var borderWidth = style.borderWidth

                style.borderWidth = 0
                style.borderStyle = 'solid'
                style['border' + (side=='left'? 'Right': 'Left') + 'Width'] = borderWidth

                var arrowStyle  = props.arrowStyle? copy(props.arrowStyle): {}
                var arrowWidth  = props.arrowWidth  ||  arrowStyle.width || ARROW_DEFAULTS.width
                var arrowHeight = props.arrowHeight || arrowStyle.height || ARROW_DEFAULTS.height
                var arrowColor  = props.arrowColor || arrowStyle.color || ARROW_DEFAULTS.color

                copy({
                    borderTop   : arrowHeight + 'px solid transparent',
                    borderBottom: arrowHeight + 'px solid transparent',
                    borderLeftWidth  : arrowWidth,
                    borderRightWidth : arrowWidth
                }, arrowStyle)

                if (side == 'right'){
                    arrowStyle.borderLeftColor = arrowColor
                }

                if (side == 'left'){
                    arrowStyle.borderRightColor = arrowColor
                }

                delete arrowStyle.width
                delete arrowStyle.height

                return (
                    <div {...props}>
                        <div className="arrow" data-side={side} style={arrowStyle} />
                    </div>
                )
            },

            stripFactory: function(props, Strip) {
                return (
                    <div key="stripWrap" style={{overflow: 'hidden'}}>
                        {Strip(props)}
                    </div>
                )
            }
        }
    },

    getInitialState: function() {
        return {

        }
    },

    render: function() {
        var props = copy(this.props)

        props.onChange = this.handleChange
        this.prepareIndex(props, this.state)

        if (props.arrowColor){
            props.scrollerProps = props.scrollerProps || {}
            props.scrollerProps.arrowColor = props.arrowColor
        }

        props.stripStyle = copy(props.stripStyle, props.defaultStripStyle)

        return TabsFactory(props)
    },

    prepareIndex: function(props, state) {
        if (props.hasOwnProperty('defaultActiveIndex')){
            props.activeIndex = props.defaultActiveIndex
            if (typeof state.activeIndex != 'undefined'){
                props.activeIndex = state.activeIndex
            }
        }
    },

    handleChange: function(index) {
        if (this.props.hasOwnProperty('defaultActiveIndex')){
            this.setState({
                activeIndex: index
            })
        }

        ;(this.props.onChange || emptyFn)(index)
    }

})

module.exports = TabPanel