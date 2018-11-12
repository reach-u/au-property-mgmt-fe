import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Icon, Classes, NonIdealState} from '@blueprintjs/core';
import info from '../../assets/info.png';
import school from '../../assets/baseline-school-24px.svg';
import './results.css';

class Results extends Component {
  render() {
    const {store, onHover, activeRow} = this.props;
    const isDesktop = window.innerWidth > 1200;

    if (store.dataAvailable) {
      return (
        <table
          className={[Classes.HTML_TABLE_STRIPED, Classes.HTML_TABLE, 'results-table'].join(' ')}>
          <tbody>
            {store.estates.map((item, index) => (
              <tr
                key={index}
                onClick={() => {
                  if (isDesktop) {
                    return;
                  }
                  store.fetchEstateDetails(item.id);
                }}
                className={item.id === activeRow ? 'active' : ''}
                onMouseOut={event => onHover(event, item)}
                onMouseOver={event => onHover(event, item)}>
                <td title={item.detailedData.buildingType}>
                  {item.detailedData.buildingType === 'School' ? (
                    <img src={school} alt="School" />
                  ) : item.detailedData.buildingType === 'Apartment building' ? (
                    <Icon icon="office" iconSize={20} className="table-icon" />
                  ) : (
                    <Icon icon="home" iconSize={20} className="table-icon" />
                  )}
                </td>
                <td>
                  <div className="main-details">
                    <p className="table-important">
                      {`${item.street} ${item.house}${item.apartment ? `-${item.apartment}` : ''}`}
                    </p>
                    <p className="table-light">
                      {item.street} {item.house}, {item.county}, {item.country}
                    </p>
                  </div>
                </td>
                <td>
                  <div
                    title="More details"
                    style={{cursor: 'pointer'}}
                    onClick={() => store.fetchEstateDetails(item.id)}>
                    <img src={info} alt="More details" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (store.noResults) {
      return (
        <NonIdealState
          icon="search"
          title="No search results"
          description="Try another address"
          className="non-ideal-search"
        />
      );
    } else {
      return null;
    }
  }
}

export default observer(Results);
