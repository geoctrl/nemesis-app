import React, { Component, createRef } from 'react';
import { Scoped, k, m } from 'kremling';
import { Link } from 'react-router-dom';

import { Button } from '../components/button.component';
import { Icon } from '../components/icon.component';
import { ProgressBar } from './progress-bar.component';
import { playerState } from '../core/player-state';
import { REPEAT, REPEAT_NONE } from '../core/player-contants';
import { Queue } from './queue.component';
import { Volume } from './volume.component';

export class Player extends Component {
  constructor(props) {
    super(props);
    this.audioRef = createRef();
  }

  componentDidMount() {
    playerState.setAudio(this.audioRef.current);
    this.playerObservable = playerState.subscribe((state) => {
      const { queue, queueActiveIndex, audio, audioPlaying, repeat, volume } = state;
      this.setState({ queue, queueActiveIndex, audio, audioPlaying, repeat, volume });
    }, 'queue', 'queueActiveIndex', 'audio', 'audioPlaying', 'repeat', 'volume');
  }

  componentWillUnmount() {
    this.playerObservable.unsubscribe();
  }

  state = {
    playing: false,
    queue: playerState.state.queue,
    audio: null,
    audioPlaying: false,
    queueActiveIndex: null,
    repeat: REPEAT,
    volume: 1,
  }

  getVolumeIcon = () => {
    const { volume } = this.state;
    if (volume === 0) {
      return 'volume-mute';
    }
    if (volume < .333333) {
      return 'volume-down';
    }
    if (volume < .666666) {
      return 'volume';
    }
    return 'volume-up';
  }

  render() {
    const { queue, audio, audioPlaying, queueActiveIndex, repeat, volume } = this.state;
    const activeSong = queue && queue.length ? queue[queueActiveIndex] : null;
    const audioReady = audio && audio.src;
    return (
      <Scoped css={css}>
        <audio
          ref={this.audioRef}
          src={null}
        />
        <div className="player">
          <div className="display">
            <div className="top">
              <div
                className="album-cover"
                style={activeSong ? {
                  backgroundImage: `url("${activeSong.album.img}")`
                } : null}
              />
              <div className="info-parent">
                {activeSong ? (
                  <div className="info">
                    <div className="info__text">
                      <div className="info__artist">
                        <Icon
                          name="users"
                          size={14}
                          className="info__icon"
                        />
                        <Link to={`/artists/${activeSong.artist.id}`}>
                          {activeSong.artist.name}
                        </Link>
                      </div>
                      <div className="info__album">
                        <Icon
                          name="compact-disc"
                          size={14}
                          className="info__icon"
                        />
                        <Link to={`/albums/${activeSong.album.id}`}>
                          {activeSong.album.name}
                        </Link>
                      </div>
                      <div className="info__song">
                        {activeSong.name}
                      </div>
                    </div>
                    <Button
                      className="info__action"
                      icon="ellipsis-h"
                      actionType="flat"
                    />
                  </div>
                ) : <div />}
                <div className="player-actions">
                  <div>
                    <Button
                      className="info__actions"
                      actionType="flat"
                      icon="step-backward"
                      large
                      circle
                      disabled={
                        !audioReady ||
                        queue.length === 1 ||
                        (repeat === REPEAT_NONE && queueActiveIndex === 0)
                      }
                      onClick={() => playerState.back()}
                    />
                    <Button
                      className="info__actions"
                      actionType="flat"
                      icon={audioPlaying ? 'pause' : 'play'}
                      large
                      circle
                      disabled={!audioReady}
                      onClick={() => {
                        audioPlaying ? playerState.pause() : playerState.play();
                      }}
                    />
                    <Button
                      className="info__actions"
                      actionType="flat"
                      icon="step-forward"
                      disabled={
                        !audioReady ||
                        queue.length === 1 ||
                        (repeat === REPEAT_NONE && queueActiveIndex === queue.length - 1)
                      }
                      large
                      circle
                      onClick={() => playerState.next()}
                    />
                  </div>
                  <div>
                    <Button
                      actionType="flat"
                      icon={repeat === REPEAT ? 'repeat' : 'long-arrow-right'}
                      disabled={!audioReady}
                      large
                      circle
                      onClick={() => {
                        playerState.repeatNext()
                      }}
                    />
                    <Button
                      actionType="flat"
                      icon="random"
                      disabled={!audioReady}
                      large
                      circle
                      onClick={() => playerState.shuffle()}
                    />
                    <Volume
                      volume={volume}
                      volumeIcon={this.getVolumeIcon()}
                      onUpdate={playerState.updateVolume}
                      disabled={!audioReady}
                    />
                  </div>
                </div>
              </div>
            </div>
            <ProgressBar />
          </div>
          <Queue songs={queue} />
        </div>
      </Scoped>
    );
  }
}

const css = k`
  .player {
    width: 42rem;
    flex-shrink: 0;
    flex-grow: 0;
    border-left: solid .1rem var(--color-grey-100);
    user-select: none;
    display: flex;
    flex-direction: column;
  }

  .display {
    border-bottom: solid .1rem var(--color-grey-100);
  }
  
  .top {
    padding: 1.6rem;
    display: flex;
  }
  
  .album-cover {
    background-color: var(--color-grey-100);
    height: 11rem;
    width: 11rem;
    border-radius: var(--base-border-radius);
    margin-right: 1.6rem;
    flex-shrink: 0;
    background-size: cover;
    background-position: center;
  }
  
  .info-parent {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }
  
  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }
  
  .info__text {
    flex-grow: 1;
    min-width: 0;
  }
  
  .info__action {
    flex-shrink: 0;
    margin-left: .8rem;
  }
  
  .info__artist {
    margin-bottom: .2rem;
    display: flex;
    align-items: center;
  }
  
  .info__album {
    margin-bottom: .4rem;
    display: flex;
    align-items: center;
  }
  
  .info__artist *, .info__album * {
    color: var(--color-grey-600);
  }
  
  .info__song {
    font-size: 1.8rem;
    margin-bottom: .5rem;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .info__album a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .info__icon {
    margin-right: .8rem;
    flex-shrink: 0;
  }
  
  .info__icon.icon {
    fill: var(--color-grey-500);
  }
  
  .player-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .player-actions > div:first-child button {
    margin-right: .5rem;
  }
`;