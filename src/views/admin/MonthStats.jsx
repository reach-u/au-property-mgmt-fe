import React, {Component, Fragment} from 'react';

import '../navigation.scss';
import '../registry/registry.scss';
import {observer} from 'mobx-react';

class MonthStats extends Component {

    render() {
        return (
            <Fragment>
                <div className="registry-container">
                    <div className="content-container">
                        <p>
                            Month stats info
                        </p>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default observer(MonthStats);
