import React, { Component } from 'react';
import { object } from 'prop-types';
import { Scoped, k } from 'kremling';

export class Album extends Component {
  static propTypes = {
    album: object.isRequired,
  }
  render() {
    const { album } = this.props;
    return (
      <Scoped css={css}>
        <div className="album">

          {album.name}
        </div>
      </Scoped>
    );
  }
}

const css = k`
  .album {
    
  }
`;