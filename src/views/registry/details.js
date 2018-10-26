import React from 'react';
import {humanReadable} from '../../utils/string';

const Details = ({store}) => {
  return (
    <div style={{minWidth: '450px', borderLeft: '2px solid #888', padding: '20px'}}>
      <h2>{store.detailedAddress}</h2>
      {Object.keys(store.details)
        .filter(key => store.details[key])
        .map(key => (
          <p key={key}>
            <strong>{humanReadable(key)}:</strong> {store.details[key]}
          </p>
        ))}
    </div>
  );
};

export default Details;
