import React, {Fragment} from 'react';
import {observer} from 'mobx-react';
import * as Classes from '@blueprintjs/core/lib/esm/common/classes';
import school from '../assets/baseline-school-24px.svg';
import {Icon, NonIdealState, ProgressBar} from '@blueprintjs/core';
import info from '../assets/info.png';
import './registry/results.css';
import './registry/registry.scss';

const UserProperties = ({store}) => {
  const hasEstates = store.userEstates.length > 0;

  if (hasEstates) {
    return (
      <Fragment>
        <div className="registry-container user-properties">
          <table
            className={[Classes.HTML_TABLE_STRIPED, Classes.HTML_TABLE, 'results-table'].join(' ')}>
            <tbody>
              {store.userEstates.map((item, index) => (
                <tr key={index}>
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
                        {`${item.street} ${item.house}${
                          item.apartment ? `-${item.apartment}` : ''
                        }`}
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
        </div>
        {store.loading && (
          <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 2000}}>
            <ProgressBar intent="primary" />
          </div>
        )}
      </Fragment>
    );
  } else if (store.loading) {
    return (
      <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 2000}}>
        <ProgressBar intent="primary" />
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
};

export default observer(UserProperties);
