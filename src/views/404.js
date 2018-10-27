import React from 'react';
import {NonIdealState} from '@blueprintjs/core';

const NotFoundPage = () => {
  return <NonIdealState icon="zoom-out" title="Error 404" description="Page not found" />;
};

export default NotFoundPage;
