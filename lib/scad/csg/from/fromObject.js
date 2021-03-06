var fromPolygons = require('./fromPolygons'),
    G = require('../../geometry')

// create from an untyped object with identical property names:
module.exports = function fromObject(obj) {
	var polygons = obj.polygons.map(function(p) {
		return G.Polygon.fromObject(p);
	});
	var csg = fromPolygons(polygons);
	csg = csg.canonicalized();
	return csg;
}
