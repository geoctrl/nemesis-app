import React, { Component } from 'react';
import { Scoped, k } from 'kremling';
import { api, unwrap } from '../core/api';
import { Album } from '../components/album.component';

export class Artists extends Component {
  state = {
    artist: null,
  }
  componentDidMount() {
    api.get(`/artists/${this.props.match.params.id}`)
      .then(unwrap)
      .then(artist => {
        this.setState({ artist });
      });
  }

  render() {
    const { artist } = this.state;
    return artist && (
      <Scoped css={css}>
        <div className="page">
          <div className="artist-name">
            {artist.name}
          </div>
          <Album
            album={artist.albums[0]}
          />
        </div>
      </Scoped>
    );
  }
}

const css = k`
  .artist-name {
    font-size: 2rem;
  }
`;