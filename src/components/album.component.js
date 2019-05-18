import React, { Component } from 'react';
import { object, bool } from 'prop-types';
import { Scoped, k } from 'kremling';
import { Link } from 'react-router-dom';

export class Album extends Component {
  static propTypes = {
    album: object.isRequired,
    pictureOnly: bool,
  }
  render() {
    const { album, pictureOnly } = this.props;
    return (
      <Scoped css={css}>
        <Link
          to={`/albums/${album.id}`}
          className="album"
          title={album.name}
        >
          <div className="album-cover"
            style={{ backgroundImage: `url("${album.img}")`}}
          />
          {!pictureOnly && (
            <>
              <div className="album-name">
                {album.name}
              </div>
              <div className="album-year">
                {album.year}
              </div>
            </>
          )}
        </Link>
      </Scoped>
    );
  }
}

const css = k`
  .album {
    width: 16rem;
    text-decoration: none;
    color: var(--color-grey-900);
  }
  
  .album-cover {
    height: 16rem;
    width: 16rem;
    background-position: center;
    background-size: cover;
    border-radius: var(--base-border-radius);
  }
  
  .album-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: .2rem;
  }
  
  .album-year {
    font-size: 1.2rem;
    color: var(--color-grey-500);
  }
`;