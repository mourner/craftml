import q from '../../query'
import union from '../union'
import _ from 'lodash'
import Solid from '../'

function checkOverlap(a,b){
    return b.position.x < (a.position.x + a.size.x) && a.position.x < (b.position.x + b.size.x) &&
        b.position.y < (a.position.y + a.size.y) && a.position.y < (b.position.y + b.size.y) &&
        b.position.z < (a.position.z + a.size.z) && a.position.z < (b.position.z + b.size.z)
}

// A subtract B
// A intersect B
export function cut_helper($solid, solids, solidsToCut, method){
    let $ = q($solid)//[0])

    let solidsToCutFrom = _.difference(solids, solidsToCut)
    solidsToCut = _.difference(solidsToCut, solidsToCutFrom)

    // A : [polyhedron]
    // B : [polyhedron]
    //
    // A subtract/intersect B
    //
    let A =
        _.flatten(_.map(solidsToCutFrom, s => {
            return $(s).find('polyhedron').get()
        }))

    let B =
        _.flatten(_.map(solidsToCut, s => {
            return $(s).find('polyhedron').get()
        }))

    // remove polyhedrons already cut previously
    _.remove(A, {'role': 'cut'})
    _.remove(B, {'role': 'cut'})

    if (method == 'subtract'){
        // remove those in A that do not overlap with anyone in B
        _.remove(A, a => {
            return !_.any(B, b => {return checkOverlap(a, b)})
        })

    } else if (method == 'intersect'){

        // remove those in A that do not overlap with anyone in B
        _.remove(A, a => {
            if (!_.any(B, b => {return checkOverlap(a, b)})){
                // cut immediately since it's not inside the intersection
                a.role = 'cut'
                a.style.visibility = 'hidden'
                return true
            } else {
                return false
            }
        })

    }

    let csg0 = union(_.pluck(B,'csg'))
    let csg1 = union(_.pluck(A,'csg'))

    // apply 'subtract' or 'intersect'
    // note: do not reTesselated and canonicalize
    // for some reason, reTesselation would create some dangling triangles
    let csg = csg1[method + 'Sub'](csg0, false, false)

    _.forEach(B, r => {
        r.role = 'cut'
        r.style.visibility = 'hidden'
    })

    _.forEach(A, r => {
        r.role = 'cut'
        r.style.visibility = 'hidden'
    })

    _.forEach(solidsToCut, r => {
        r.role = 'cut'
        r.style.visibility = 'hidden'
    })

    // attach the resulting csg to the first selected solid
    // <g l="select(a) cut(b)"> --> c has the style of a

    let s = solidsToCutFrom[0]
    s.role = 'group'    // undo role = 'cut'
    s.style.visibility = 'visible'  // undo visibility = 'hidden'
    delete s.style.visibility
    s.add(csg)
}

export default function cut($solid, solids, solidsToCut){

    cut_helper($solid, solids, solidsToCut, 'subtract')
}
