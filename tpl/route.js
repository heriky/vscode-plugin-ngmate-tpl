import { Route } from 'angular-utils';
import { Inject } from 'angular-es-utils';

import templateUrl from './index.tpl.html';
import './style.less';

@Route({
	stateName: '',
	url: '',
	templateUrl
})
@Inject('$state')
export default class #{controllerName} {
    constructor() {

    }
}