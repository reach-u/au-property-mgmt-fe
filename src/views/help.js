import React from 'react';
import '../index.scss';
import check from '../assets/check.png';

const Help = () => {
  return (
    <div className="help-container">
      <h3>Land registry application</h3>

      <p>Land Registry combines various data originating from different registries:</p>
      <ul>
        <li>
          <img src={check} alt="check mark" />
          <p>
            <strong>Land data</strong> – land parcels and their borders (together with visualization
            on the map), limitations on land usage (areas forbidden for buildings, limits on
            building heights, etc.)
          </p>
        </li>
        <li>
          <img src={check} alt="check mark" />
          <p>
            <strong>Building data</strong> – building details such as height, number of floors,
            water supply types, does the building have certificate of occupancy, EyeVi Street View
            link for the building, etc.
          </p>
        </li>
        <li>
          <img src={check} alt="check mark" />
          <p>
            <strong>Property data</strong> – details of the specific property (for example,
            apartment, part of apartment building, built on certain land parcel)
          </p>
        </li>
      </ul>
      <p>
        Accessibility to different data within the system depends on specfic use cases and can also
        be adjusted according to user roles (any non-authenticated user, authenticated user,
        officials). In addition to providing property information, the solution also supports
        property ownership transaction process (in a simplified form).
      </p>
    </div>
  );
};

export default Help;
