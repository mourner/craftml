var debug = require('debug')('craft.parse')
module.exports = parse

var cheerio = require('cheerio'),
    _ = require('lodash'),
    fs = require('fs'),
    path = require('path')


var Craft = require('./craft'),
    CraftRef = require('./craftref'),
    Script = require('./script'),
    Stack = require('./stack'),
    Row = require('./row'),
    Place = require('./place'),
    Parameter = require('./parameter'),
    TextElement = require('./text')

function parse(xml, context) {
    // https://github.com/cheeriojs/cheerio/issues/598
    // set xmlMode to true in order to handle self-closing tags, like <cube/>
    var $ = cheerio.load(xml, {
        xmlMode: true
    })
    var topCraftNode = $('craft')[0]
        // var context = {basePath: basePath}

    if (context === undefined) {
        context = {
            basePath: process.cwd()
        }
    }

    var ret = parseNode($, topCraftNode, context)
    debug('parsed: %o', ret)
    return ret
}

function parseFromFile(src, context) {
    var xml = fs.readFileSync(src, 'utf8')
    return parse(xml, context)
}


function createScript(node, $) {
    script = new Script()
    script.text = $(node).text()
    script.type = $(node).attr('type')
    return script
}

function createCraftRef(node) {
    var c = new CraftRef(node.name)
    return c
}

function searchForModulePath(currentPath, name) {
    var modulePath = path.join(currentPath, 'node_modules', name)
    if (fs.existsSync(modulePath)) {

        return modulePath

    } else {

        if (currentPath === '/') {
            return undefined
        } else {
            return searchForModulePath(path.join(currentPath, '../'), name)
        }
    }
}

function createCraft(node, context) {
    var c
    if ('src' in node.attribs) {
        var src = path.join(context.basePath || '', node.attribs.src)
        debug('import from %s, %s', src, context.basePath)
        c = parseFromFile(src)

    } else if ('module' in node.attribs) {

        // TODO: need more test cases fo this module loading algorithm

        var modulePath = searchForModulePath(context.basePath, node.attribs.module)
        if (modulePath) {
            var indexXml = path.join(modulePath, 'index.xml')
            var contents = fs.readFileSync(indexXml, 'utf8')

            context.basePath = modulePath
            c = parse(contents, context)

        } else {

            throw error('can not find module %s', modulePath)
        }

        // TODO: handle module not found error

    } else {
        c = new Craft()
    }
    // TODO: handle error when both src and module are specified
    return c
}

function node2block($, node, context) {
    debug('node.type: %s', node.type)
    if (node.type === 'tag') {
        if (node.name === 'stack') {
            return new Stack()
        } else if (node.name === 'row') {
            return new Row()
        } else if (node.name === 'craft') {
            return createCraft(node, context)
        } else if (node.name === 'place') {
            return new Place()
        } else if (node.name === 'parameter') {
            return new Parameter()
        } else if (node.name) {
            return createCraftRef(node)
        }
    } else if (node.type === 'text') {
        if (node.data.trim().length > 0)
            return new TextElement(node.data)
    } else if (node.type === 'script') {

        if (node.name === 'script') {
            return createScript(node, $)
        }
    }
}

// return a part
function parseNode($, node, context) {
    var block = node2block($, node, context)

    if (node.attribs && 'name' in node.attribs) {
        block.name = node.attribs.name
    }

    if (block) {
        // add attributes
        block.attribs = node.attribs

        if (node.children) {
            node.children.forEach(function(child) {
                var childBlock = parseNode($, child, context)
                if (childBlock) {
                    block.contents.push(childBlock)
                }
            })
        }
        return block
    }
}