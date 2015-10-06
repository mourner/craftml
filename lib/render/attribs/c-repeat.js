// TODO: error handling
export function cRepeat($scope){
    let expr = this.attribs['c-repeat']
    if (expr){
        let toks = expr.split(' in ')
        if (toks.length == 1){
            let n = $scope.eval(toks[0])
            // e.g., <cube c-repeat="5" />
            repeat_n.call(this, n, $scope)
        }

    } else {
        // do nothing
    }
}

function repeat_n(n, $scope){
    for (let i = 0; i < n - 1; i++) {
        let copy = this.clone()
        this.parent.add(copy)
    }
}
