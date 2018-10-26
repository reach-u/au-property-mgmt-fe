import React from 'react';

const Details = ({store}) => {
  return (
    <div style={{width: '500px', borderLeft: '1px solid red'}}>
      {Object.keys(store.details)
        .filter(key => store.details[key])
        .map(key => (
          <p key={key}>
            {key}: {store.details[key]}
          </p>
        ))}
    </div>
  );
};

export default Details;
