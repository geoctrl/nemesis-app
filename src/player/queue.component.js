import React, { Component } from 'react';
import { array } from 'prop-types';
import { Scoped, k } from 'kremling';
import { Link } from 'react-router-dom';

import eq from '../assets/equalizer.gif';
import eqPause from '../assets/equalizer-pause.gif';
import { playerState } from '../core/player-state';
import { Icon } from '../components/icon.component';

function getActiveSong(queue, queueActiveIndex) {
  return queue.length ? queue[queueActiveIndex] : null;
}

export class Queue extends Component {
  static propTypes = {
    songs: array.isRequired,
  }

  state = {
    activeSong: getActiveSong(playerState.state.queue, playerState.state.queueActiveIndex),
    audioPlaying: playerState.state.audioPlaying,
  }

  componentDidMount() {
    this.playerObservable = playerState.subscribe(({ queue, queueActiveIndex, audioPlaying }) => {
      this.setState({
        activeSong: getActiveSong(queue, queueActiveIndex),
        audioPlaying,
      });
    }, 'queue', 'queueActiveIndex', 'audioPlaying');

  }

  componentWillUnmount() {
    this.playerObservable.unsubscribe();
  }

  render() {
    const { songs } = this.props;
    const { activeSong, audioPlaying } = this.state;
    return (
      <Scoped css={css}>
        <div className="queue">
          {!songs.length ? (
            <div className="queue-empty">
              <Icon name="music" size={40} />
              <div className="queue-empty__message">
                <div>Queue is Empty</div>
              </div>
            </div>
          ) : (
            <table>
              <thead>
              <tr>
                <th />
                <th>Song</th>
              </tr>
              </thead>
              <tbody>
              {songs.map((song, i) => (
                <tr key={song.key}>
                  <td>
                    <div className="p">
                      {activeSong.key === song.key ? (
                        <div
                          className="p-eq"
                          style={{ backgroundImage: `url(${audioPlaying ? eq : eqPause})`}}
                        />
                      ) : (
                        <div
                          className="p-img"
                          style={{ backgroundImage: `url("${song.album.img}")` }}
                        >
                          <div className="p-img__inner" onClick={() => playerState.queueGoTo(i)}>
                            <Icon name="play" size={10} />
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="song-name">{song.name}</div>
                    <div className="song-details">
                      <Link to={`/albums/${song.album.id}`}>
                        {song.album.name}
                      </Link>{' - '}
                      <Link to={`/artists/${song.artist.id}`}>
                        {song.artist.name}
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          )}
        </div>
      </Scoped>
    );
  }
}

const css = k`
  .queue {
    flex-grow: 1;
  }
  
  .queue-empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15rem;
    flex-direction: column;
    margin: 0 auto;
  }
  
  .queue-empty svg {
    fill: var(--color-grey-300);
  }
  
  .queue-empty__message {
    margin-top: 1rem;
    font-weight: 700;
    font-size: 1.8rem;
    color: var(--color-grey-300);
  }
  
  table {
    border-collapse: collapse;
    table-layout: auto;
    width: 100%;
  }
  
  table th, table td {
    padding: .4rem .8rem .4rem 0;
    border-bottom: solid .1rem var(--color-grey-100);
  }

  table th {
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--color-grey-500);
    text-transform: uppercase;
    padding-bottom: .6rem;
  }

  table tr > th:first-child,
  table tr > td:first-child {
    padding-left: .8rem;
    width: 2rem;
  }

  .p {
    
  }
  
  .p-img {
    height: 3rem;
    width: 3rem;
    background-position: center;
    background-size: cover;
    border-radius: .2rem;
    position: relative;
  }
  
  .p-img__inner {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-grey-900);
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  table tbody tr:hover .p-img__inner {
    display: flex;
  }
  
  .p-img__inner svg {
    fill: #fff;
  }
  
  .p-eq {
    height: 3rem;
    width: 3rem;
    background-position: center;
  }
  
  .song-details a {
    color: var(--color-grey-500);
  }
  
  .song-details {
    font-size: 1.1rem;
    color: var(--color-grey-500);
    padding-bottom: .2rem;
  }
`;