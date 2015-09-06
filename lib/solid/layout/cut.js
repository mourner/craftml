import q from '../../query'
import union from '../union'
import _ from 'lodash'
import Solid from '../'

export function cut_helper($solid, solids, solidsToCut, method){
    let $ = q(solids[0])

    let csgsToCut =
        _.flatten(_.map(solidsToCut, s => {
            return $(s).find('polyhedron').get()
        }))

    let solidsToCutFrom = _.difference(solids, solidsToCut)
    solidsToCut = _.difference(solidsToCut, solidsToCutFrom)
    // console.log(_.pluck(solidsToCutFrom, 'name'))
    // console.log(_.pluck(solidsToCut, 'name'))

    let csgsToCutFrom =
        _.flatten(_.map(solidsToCutFrom, s => {
            return $(s).find('polyhedron').get()
        }))

    // _.remove(csgsToCut, {'role': 'cut'})
    _.remove(csgsToCutFrom, {'role': 'cut'})

    var csg0 = union(_.pluck(csgsToCut,'csg'))
    var csg1 = union(_.pluck(csgsToCutFrom,'csg'))


    // do not reTesselated and canonicalize
    // for some reason, reTesselation would create some dangling triangles
    var csg = csg1[method + 'Sub'](csg0, false, false)
    //  var csg = csg1[method](csg0)//, false, false)

    let rest = _.difference($solid.children, solidsToCutFrom)

    _.forEach(csgsToCut, r => {
        r.role = 'cut'
        // set display to none unless it's already been set by the stylesheet
        // console.log(r.name, r.style.display)
        if (!r.style.visibility) {
            r.style.visibility = 'hidden'
        }
    })
    _.forEach(solidsToCut, r => {
        r.role = 'cut'
        // set display to none unless it's already been set by the stylesheet
        if (!r.style.visibility) {
            r.style.visibility = 'hidden'
        }
    })

    _.forEach(solidsToCutFrom, s => {
        // s.removeAll()
        // _.forEach(s.children, c => {

        $(s).find('polyhedron').each(function(){
            this.role = 'cut'
        })

        $(s).find('*').each(function(){
            this.role = 'cut'
        })

        if (!s.style.visibility) {
            $(s).css('visibility','hidden')
        }
    })


    // attach the resulting csg to the first selected solid
    // <g l="select(a) cut(b)"> --> c has the style of a

    let s = solidsToCutFrom[0]
    s.role = 'group'    // undo role = 'cut'
    s.style.visibility = 'visible'  // undo visibility = 'hidden'
    s.add(csg)
}

export default function cut($solid, solids, solidsToCut){

    cut_helper($solid, solids, solidsToCut, 'subtract')
}
