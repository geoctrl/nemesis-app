import React, { Component } from 'react';
import { Scoped, k } from 'kremling';
import { Link, NavLink } from 'react-router-dom';

import { api, unwrap } from '../core/api';
import { TabContainer } from '../components/tab.component';

export class ArtistList extends Component {
  state = {
    artists: [],
  }

  componentDidMount() {
    api.get(`/artists`)
      .then(unwrap)
      .then(artists => {
        this.setState({ artists });
      });
  }

  render() {
    const { artists } = this.state;
    return !!artists.length && (
      <Scoped css={css}>
        <div>
          <TabContainer>
            <NavLink
              to={`/artists`}
              activeClassName="active"
              exact
            >
              Artists
            </NavLink>
            <NavLink
              to={`/albums`}
              activeClassName="active"
              exact
            >
              Albums
            </NavLink>
            <NavLink
              to={`/songs`}
              activeClassName="active"
              exact
            >
              Songs
            </NavLink>
          </TabContainer>

          {artists.map(artist => (
            <div
              key={artist.id}
            >
              <Link to={`/artists/${artist.id}`}>
                {artist.name}
              </Link>
            </div>
          ))}
        </div>
      </Scoped>
    );
  }
}

const css = k`
  
`;