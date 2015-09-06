import q from '../../query'
import union from '../union'
import _ from 'lodash'

import {cut_helper} from './cut'

export default function intersect($solid, solids, solidsToCut){
    cut_helper($solid, solids, solidsToCut, 'intersect')
}
