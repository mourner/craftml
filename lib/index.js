var _ = require('lodash'),
    parse = require('./parse'),
    meta = require('./meta'),
    Scope = require('./scope'),
    Solid = require('./solid'),
    Promise = require('bluebird')

function _loadPrimitives() {
    return require('./builtins')
}

import render from './render'
import Craft from './craft'

function _initScope() {
    return _loadPrimitives()
        .then(function(primitives) {
            var scope = new Scope()
            scope.crafts = _.clone(primitives)
            _.forIn(primitives, (src, name) =>{
                scope.crafts[name] = new Craft(src)
            })
            _.extend(scope, primitives)
            return scope
        })
}

function _toSolid(context) {
    return _initScope()
        .then(function(scope) {

            if (context && context.parameters){
                scope.parameters = context.parameters
            }
            context = _preprocess(context)
            // console.time("parse")
            return parse(context)
                .then(parsed =>{
                    // console.timeEnd("parse")
                    console.time("render")
                    return render(parsed, scope)
                })
        })
        .then(function(solid){
            // mirror wrt y=0 in order to show the solid in the "screen" perspective
            solid.mirrorY(0)
            return solid
        })
        // .catch(function(err){
            // console.log(err.startIndex)
        // })

}

var cssText = require('./css/default.css.js')

// replace the outter most <craft> with <g>
// <craft> ... </craft> ---> <g> ... </g>
function _preprocess(context){

    var xml1 = context.contents//.trim()
    var reg = new RegExp('<craft((.|[\r\n])*)\/craft>')
    cssText = cssText.split('\n').join(' ')
    xml1 = xml1.replace(reg, '<g><style>' + cssText + '</style><g    $1/g></g>')
    context.contents = xml1
    context.offset = cssText.length + 18
    return context
}

function preview(context) {

    return Promise.join(
            _toSolid(context),
            meta(context.contents))
        .spread(function(solid, meta) {

            var viewable = {}
            viewable.root = solid.preview()
            viewable.meta = meta

            console.timeEnd("render")
            return viewable
        })
}

function build(context) {
    return _toSolid(context)
        .then(solid => {
            console.time("compile")
            let csg = solid.compile()
            console.timeEnd("compile")
            return csg
        })
}

function preview1(context) {
    return _toSolid(context)
}

module.exports = {
    build: build,
    preview: preview,
    preview1: preview1
}
