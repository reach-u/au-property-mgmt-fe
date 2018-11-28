import React from 'react';
import {render} from 'react-testing-library';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';

describe('App', () => {
  const component = (
    <Router>
      <App />
    </Router>
  );

  it('renders without crashing', () => {
    expect(render(component));
  });
});
