import _ from 'lodash'

require('operative')
function _workerRun(op, method, code, context) {
    return function(code, context){
        return new Promise(function(resolve, reject) {
            op[method](code, context, function(err, ret){
                if (err)
                    reject(err)
                else
                    resolve(ret)
            })
        })
    }
}

function worker(deps){
    var op = operative({
        preview: function(code, context, callback) {

            craftml
                .preview(code, context)
                .then(function(previewable) {
                    callback(null, previewable)
                }).catch(function(err) {
                    if (err.name === 'RenderError' || err.name === 'ScriptError')
                        callback(err)
                    else{
                        console.error(err.stack)
                        callback(err.message)
                    }
                })
        },
        build: function(code, context, callback) {

            craftml
                .build(code, context)
                .then(function(csg) {
                    var stl = csg.toStlString()
                    callback(null, stl)
                }).catch(function(err) {
                    if (err.name === 'RenderError' || err.name === 'ScriptError')
                        callback(err)
                    else{
                        console.error(err.stack)
                        callback(err.message)
                    }
                })
        }
    },
    deps)

    return {
            preview: _workerRun(op, 'preview'),
            build: _workerRun(op, 'build')
    }
}

export default function engine(hosts){
    const VERSION = require('../version')
    const WORKER_SCRIPT_URL = `${hosts.cdn}/craftml-worker-${VERSION}.js`
    global.Craftml = global.Craftml || {}
    global.Craftml.Engine = worker([WORKER_SCRIPT_URL])
    global.Craftml.Engine.version = VERSION
    global.Craftml.Engine.hosts = hosts        
}
