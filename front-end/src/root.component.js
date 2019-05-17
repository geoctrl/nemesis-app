import React, { Component } from 'react';
import { Scoped, k } from 'kremling';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Player } from './player/player.component';
import { Artists } from './lists/artists.component';
import { Header } from './components/header.component';

export class Root extends Component {
  render() {
    return (
      <Router>
        <Scoped css={css}>
          <div className="wrapper">
            <div className="main">
              <Header />
              <Route
                path="/artists/:id"
                component={Artists}
              />
              <Route
                path="/albums/:id"
                component={Artists}
              />
            </div>
            <Player />
          </div>
        </Scoped>
      </Router>
    );
  }
}

const css = k`
  .wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
  }
  
  .main {
    flex-grow: 1;
    background-color: var(--color-grey-50);
    overflow: auto;
  }
`;