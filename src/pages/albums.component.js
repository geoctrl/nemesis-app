import React, { Component } from 'react';
import { Scoped, k } from 'kremling';
import { Link } from 'react-router-dom';

import { SongList } from '../components/song-list.component';
import { api, unwrap } from '../core/api';
import { Album } from '../components/album.component';

export class Albums extends Component {
  state = {
    album: null,
    songs: [],
  }
  componentDidMount() {
    const { match } = this.props;
    api.get(`/albums/${match.params.id}`)
      .then(unwrap)
      .then(album => this.setState({ album, songs: album.songs }))
  }

  render() {
    const { album, songs } = this.state;
    return album && (
      <Scoped css={css}>
        <div>
          <div className="album-top">
            <div className="album-top-cover">
              <Album album={album} pictureOnly />
            </div>
            <div>
              <div className="album-name">
                {album.name}
              </div>
              <Link
                className="album-artist"
                to={`/artists/${album.artist.id}`}
              >
                {album.artist.name}
              </Link>
              <div className="album-year">
                {album.year}
              </div>
            </div>
          </div>
          <SongList
            songs={songs}
            album
          />
        </div>
      </Scoped>
    );
  }
}

const css = k`
  .album-top {
    padding: 1.6rem;
    display: flex;
    cursor: default;
  }
  
  .album-top-cover {
    margin-right: 1.6rem;
  }
  
  .album-name {
    font-size: 2rem;
  }
  
  .album-artist {
    color: var(--color-grey-500);
  }
  
  .album-year {
    font-size: 1.2rem;
    color: var(--color-grey-500);
  }
`;