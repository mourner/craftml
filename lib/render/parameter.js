import Promise from 'bluebird'
import _ from 'lodash'

export default function render_parameter($scope) {

    let {name, type, alias, default: defaultVal} = this.src.attribs

    var val
    if (!(name in $scope.parameters)) {
        // not set by the caller
        // use the default value
        if ('default' in this.src.attribs){
            val = parseAsType(defaultVal, type)

        } else if (type == 'json'){

            val = JSON.parse(this.src.children[0].data)

        }

    } else {

        var rawValue = $scope.parameters[name]
        val = parseAsType(rawValue, type)
    }

    if (val === undefined) {
        val = ''
    } else {
        $scope.parameters[name] = val
    }

    if (alias){
        $scope.parameters[alias] = val
    }

    this.role = 'define'
}

function parseAsType(val, type) {
    if (type === 'int' || type === 'float') {

        return Number(val)

    } else if (type === 'string') {

        return '' + val

    } else if (type === 'percent') {


        if (_.isString(val)) {

            var p = val.match(/(\d+)%/)
            if (p) {

                return Number(p[1])
            } else {
                return Number(val)
            }

        } else {

            return val
        }
    } else if (type === 'size') {

        var size = parseSize(val)
        return size

    } else if (type === 'json') {

        return eval(val)

    } else if (type === 'expression') {

        return eval(val)

    } else if (type === 'measure') {

        if (_.isString(val)) {


            var p = val.match(/(\d+)%/)
            if (p) {
                return {
                    unit: 'percent',
                    value: Number(p[1])
                }
            } else if (val.length > 0) { // non-empty

                return {
                    unit: 'mm',
                    value: Number(val)
                }
            }



        } else {

            return {
                unit: 'mm',
                value: val
            }
        }


    } else {

        // is it an expression?
        var m
        if (_.isString(val) && (m = val.match(/{{(.*)}}/))) {
            // if so, eval it
            var expr = m[1]
            return eval(expr)
        } else {

            // return as is
            return val

        }

    }
}


function parseSize(val) {
    // size: 10 20 30

    if (_.isString(val)){

        var toks = val.trim().split(' ')
        // TODO: assert(toks.length === 3)

        return {
            x: Number(toks[0]),
            y: Number(toks[1]),
            z: Number(toks[2])
        }
    } else {
        return undefined
    }
}
