import { Component } from 'angular-utils';
import { Inject } from 'angular-es-utils';

import templateUrl from './index.tpl.html';
import './style.less';

@Component({
	name: '#{componentName}',
	templateUrl,
	bindings: {
	}
})
@Inject('$state')
export default class #{controllerName} {
    constructor() {

        this.setDefaultProps();
    }

    setDefaultProps() {

    }
}