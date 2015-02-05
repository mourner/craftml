var _ = require('lodash'),
    $$$ = require('craft-scad')

module.exports = Solid

function Solid() {
    this.children = []
    this.layout = {
        x: 0,
        y: 0,
        z: 0
    }
    this.csg
}

Solid.prototype.fitToChildren = function() {

    var xrange = {}
    var yrange = {}
    var zrange = {}
    xrange.min = _.min(this.children.map(function(c) {
        return c.layout.x
    }))
    xrange.max = _.max(this.children.map(function(c) {
        return c.layout.x + c.layout.width
    }))
    yrange.min = _.min(this.children.map(function(c) {
        return c.layout.y
    }))
    yrange.max = _.max(this.children.map(function(c) {
        return c.layout.y + c.layout.height
    }))
    zrange.min = _.min(this.children.map(function(c) {
        return c.layout.z
    }))
    zrange.max = _.max(this.children.map(function(c) {
        return c.layout.z + c.layout.depth
    }))

    this.layout.height = yrange.max - yrange.min
    this.layout.width = xrange.max - xrange.min
    this.layout.depth = zrange.max - zrange.min

    // this.layout.x = -xrange.min
    // this.layout.y = -yrange.min
    // this.layout.z = -zrange.min

    this.layout.size = {
        x: xrange.max - xrange.min,
        y: yrange.max - yrange.min,
        z: zrange.max - zrange.min
    }
}

Solid.prototype.toStl = toStl
Solid.prototype.toStls = toStls

function toStl() {
    var csgs = []
    collect_csgs(this, csgs)
    return $$$.union(csgs).toStlString()
}

function toStls(){
    var csgs = []
    collect_csgs(this, csgs)
    return csgs.map(function(csg){
        return csg.toStlString()
    })
}

function collect_csgs(solid, acc) {
    if (solid.csg) {
        return acc.push(solid.csg)
    } else {
        return solid.children.forEach(function(s) {
            return collect_csgs(s, acc)
        })
    }
}