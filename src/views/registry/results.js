import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Card, Elevation, Icon} from '@blueprintjs/core';

class Results extends Component {
  render() {
    return (
      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
        {this.props.store.estates.map((item, index) => (
          <Card
            key={index}
            onClick={() => this.props.store.fetchEstateDetails(item.id)}
            interactive
            style={{maxWidth: '200px', margin: '15px', flexGrow: 1}}
            elevation={Elevation.TWO}>
            <div style={{display: 'flex', alignItems: 'flex-end'}}>
              <Icon icon="home" intent="primary" iconSize={30} style={{margin: '0 5px 5px 0'}} />
              <h3 style={{marginBottom: 0}}>
                {item.name ||
                  `${item.street} ${item.house}${item.apartment ? `${-item.apartment}` : ''}`}
              </h3>
            </div>
            <hr />
            <p>{`${item.house}, ${item.street}, ${item.county}, ${item.country}`}</p>
            <a href={item.streetuUrl} target="_blank">
              View on Street U
            </a>
          </Card>
        ))}
      </div>
    );
  }
}

export default observer(Results);

/*
* apartment: null
city: "Mombasa"
coordinates: {lon: 39.66394, lat: -4.05746}
country: "Kenya"
county: "Mombasa"
house: "Alkheral Bakery"
id: 10432
name: null
street: "Magongo rd"
streetuUrl: null
* */

/*
*
* <table className={Classes.HTML_TABLE}>
          <thead>
            <tr>
              <th>Property number</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {this.props.store.estates.map(estate => (
              <tr key={estate.id}>
                <td>{estate.id}</td>
                <td>{`${estate.house}, ${estate.street}, ${estate.county}, ${estate.country}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        */
