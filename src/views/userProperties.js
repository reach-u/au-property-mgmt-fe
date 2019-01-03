import React, {Fragment} from 'react';
import {observer} from 'mobx-react';
import {NonIdealState, ProgressBar} from '@blueprintjs/core';
import './registry/results.css';
import './registry/registry.scss';
import PropertyListView from "./PropertyListView";

class UserProperties extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  render() {
    const hasEstates = this.props.realEstateStore.userEstates.length > 0;

    if (hasEstates) {
      return (
          <Fragment>
            <div className="registry-container">
              <PropertyListView
                {...this.props}
                estates={this.props.realEstateStore.userEstates}
                dataAvailable={this.props.realEstateStore.userDataAvailable}
                loaded={this.state.loaded}/>
            </div>
            {this.props.realEstateStore.loading && (
                <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 2000}}>
                  <ProgressBar intent="primary"/>
                </div>
            )}
          </Fragment>
      );
    } else if (this.props.realEstateStore.loading) {
      return (
          <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 2000}}>
            <ProgressBar intent="primary"/>
          </div>
      );
    } else {
      return (
          <NonIdealState
              icon="office"
              title="No properties"
              description="You don't currently own any properties."
          />
      );
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({loaded: true}), 1);
  }

}

export default observer(UserProperties);
