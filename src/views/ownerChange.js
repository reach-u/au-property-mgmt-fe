import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Button, Card, Elevation} from '@blueprintjs/core';
import './ownerChange/styles.css';

class OwnerChange extends Component {
  render() {
    const {id} = this.props.match.params;
    const {store} = this.props;

    return (
      <div className="owner-container">
        <h1>Ownership change for property no. {id}</h1>
        <h3>
          {store.addressData} / {store.detailedData.propertyType}, {store.detailedData.propertySize}{' '}
          m<sup>2</sup>
        </h3>
        <Button minimal intent="primary" rightIcon="share" onClick={this.handleDetailsClick}>
          See all details
        </Button>

        <Card elevation={Elevation.TWO} className="owners">
          <h5>Current owner</h5>
          <h1>{store.ownerName}</h1>
          {this.renderCurrentOwner()}
        </Card>
      </div>
    );
  }

  componentDidMount() {
    const {
      store,
      match: {params},
    } = this.props;
    if (Object.keys(store.details).length === 0) {
      store.fetchDetailsData(params.id);
    }
  }

  handleDetailsClick = () => {
    this.props.history.push(`/details/${this.props.match.params.id}`);
  };

  renderCurrentOwner = () => {
    return <p>Awaiting signature</p>;
  };
}

export default observer(OwnerChange);
