import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Card, Elevation, Icon, Divider} from '@blueprintjs/core';
import './results.css';

class Results extends Component {
  render() {
    return (
      <div className="card-container">
        {this.props.store.estates.map((item, index) => (
          <Card
            className="result-card"
            key={index}
            onClick={() => {
              this.props.store.fetchEstateDetails(item.id);
              window.scroll({top: 0, left: 0, behavior: 'smooth'});
            }}
            interactive
            elevation={Elevation.TWO}>
            <div style={{display: 'flex', alignItems: 'flex-end'}}>
              <Icon icon="home" iconSize={30} style={{margin: '0 5px 5px 0'}} />
              <h3 style={{marginBottom: 0}}>
                {item.name ||
                  `${item.street} ${item.house}${item.apartment ? `${-item.apartment}` : ''}`}
              </h3>
            </div>
            <Divider />
            <p>{`${item.house}, ${item.street}, ${item.county}, ${item.country}`}</p>
            <a href={item.streetuUrl} target="_blank" rel="noopener noreferrer">
              View on Street U
            </a>
          </Card>
        ))}
      </div>
    );
  }
}

export default observer(Results);
