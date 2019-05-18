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
        <div className="artist">
          <div className="artist-name">
            {artist.name}
          </div>
          {artist.albums.map(album => (
            <div
              key={album.id}
              className="artist-album"
            >
              <Album
                key={album.id}
                album={album}
              />
            </div>
          ))}
        </div>
      </Scoped>
    );
  }
}

const css = k`
  .artist {
    padding: 1.6rem;
  }
  
  .artist-name {
    font-size: 2rem;
    margin-bottom: 1.6rem;
  }
  
  .artist-album {
    margin-right: 1.6rem;
    margin-bottom: 1.6rem;
    display: inline-block;
  }
`;