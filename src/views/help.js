import React from 'react';
import '../index.scss';
import check from '../assets/check.png';
import pdf from '../assets/Land_Registry_demo_script.pdf';
import itlLogo from '../assets/itl_logo.svg';

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
        <li>
          <img src={check} alt="check mark" />
          <p>
            <strong>Land tax data for potential buyers</strong>: monthly land tax data of each property and tax zones visualized on the map
          </p>
        </li>
        <li>
          <img src={check} alt="check mark" />
          <p>
            <strong>Land tax data for property owner</strong>: overview of land tax amounts and payments and option to pay invoices
          </p>
        </li>
        <li>
          <img src={check} alt="check mark" />
          <p>
            <strong>Land tax data for tax administrator</strong>: different land tax statistics, including paid and unpaid tax amounts per tax zone and per month, information about debtors and option to send reminders about unpaid tax invoices.
          </p>
        </li>
      </ul>
      <p>
        Accessibility to different data within the system depends on specfic use cases and can also
        be adjusted according to user roles (any non-authenticated user, authenticated user,
        officials). In addition to providing property information, the solution also supports
        property ownership transaction process (in a simplified form).
      </p>

      <div className="demo-link">
        <a href={pdf} target="_blank" rel="noopener noreferrer">
          Read demo script
        </a>
      </div>

      <div className="itl-logo-container">
        <img src={itlLogo} alt="ITL logo" height={70} />
      </div>
    </div>
  );
};

export default Help;
