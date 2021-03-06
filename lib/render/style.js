import Promise from 'bluebird'
import css from 'css'
import CSSselect from 'css-select'
import _ from 'lodash'
import Solid from '../solid'

export default function render_style($scope) {
    let cssText = _.get(this, 'src.children[0].data')

    if (cssText){
        let ast = css.parse(cssText)
        // inject css rules into parent's scope
        $scope.css = $scope.css.concat(ast.stylesheet.rules)
    }
}
