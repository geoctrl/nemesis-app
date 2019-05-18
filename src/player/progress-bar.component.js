import React, { Component, createRef } from 'react';
import { Scoped, k, a } from 'kremling';

import { playerState } from '../core/player-state';
import { Duration } from 'luxon';

export class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.barRef = createRef();
  }

  state = {
    currentTime: '',
    duration: '',
    durationSeconds: 0,
    progress: 0,
    dragging: false,
    dragPoint: 0,
    queue: [],
    queueActiveIndex: 0,
  }

  componentDidMount() {
    this.queueObservable = playerState.subscribe(({ queue, queueActiveIndex }) => {
      this.setState({
        queue,
        queueActiveIndex,
      })
    }, 'queue', 'queueActiveIndex');

    this.timeObservable = playerState.subscribe(({ currentTime, duration }) => {
      const time = Duration.fromObject({ seconds: currentTime });
      const total = Duration.fromObject({ seconds: duration });
      this.setState({
        currentTime: time.toFormat('m:ss'),
        duration: total.toFormat('m:ss'),
        durationSeconds: duration,
        progress: currentTime / duration * 100,
      });
    }, 'currentTime', 'duration', 'queue', 'queueActiveIndex');
  }

  componentWillUnmount() {
    this.timeObservable.unsubscribe();
    this.queueObservable.unsubscribe();
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown = (e) => {
    this.setState({ dragging: true });
    this.onDrag(e);
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onDrag = (e) => {
    const { left, width } = this.barRef.current.getBoundingClientRect();
    const position = (e.pageX - left) / width * 100;
    this.setState({
      dragPoint: position < 0 ? 0 : position > 100 ? 100 : position,
    });
  }

  onMouseUp = () => {
    const { dragPoint } = this.state;
    this.setState({ dragging: false });
    playerState.seek(dragPoint);
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  render() {
    const { currentTime, duration, durationSeconds, progress, dragging, dragPoint, queue, queueActiveIndex } = this.state;
    const activeSong = queue ? queue[queueActiveIndex] : null;
    const time = (durationSeconds * dragPoint) / 100;
    const updatedCurrentTime = dragging
      ? Duration.fromObject({ seconds: time > durationSeconds - 1 ? time - 1 : time }).toFormat('m:ss')
      : currentTime;
    return (
      <Scoped css={css}>
        <div
          className={
            a('progress-bar')
              .m('progress-bar__active', activeSong)
              .m('progress-bar__dragging', dragging)
          }
        >
          <div className="outer" ref={this.barRef}>
            <div
              className="inner"
              style={{ width: `${dragging ? dragPoint : progress}%` }}
            />
          </div>
          <div className="progress-time">
            <div>
              {updatedCurrentTime}
            </div>
            <div>
              {duration}
            </div>
          </div>
          <div
            className="progress-overlay"
            onMouseDown={this.onMouseDown}
          >
            <div
              className="progress-overlay__handle"
              style={{
                width: `${dragging ? dragPoint : progress}%`,
              }}
            />
          </div>
        </div>
      </Scoped>
    );
  }
}

const css = k`
  .progress-bar {
    margin: 0 1.6rem 1.4rem 1.6rem;
    font-size: 1.2rem;
    color: var(--color-grey-500);
    position: relative;
  }
  
  .progress-bar::after {
    content: '';
    position: absolute;
    top: -1.6rem;
    left: -1.6rem;
    right: -1.6rem;
    bottom: -1.6rem;
    background-color: transparent;
    z-index: 1;
  }
  
  .progress-bar.progress-bar__active::after {
    display: none;
  }
  
  .progress-overlay {
    position: absolute;
    height: 1.4rem;
    top: -.4rem;
    left: 0;
    right: 0;
    cursor: pointer;
  }
  
  .progress-overlay__handle {
    margin: 0 -.6rem;
    height: 1.4rem;
    position: absolute;
    top: 0;
    left: 1.4rem;
    right: 0;
  }
  
  .progress-overlay__handle::after {
    content: '';
    height: 1.4rem;
    width: 1.4rem;
    border-radius: 1.4rem;
    background-color: #637BC5;
    position: absolute;
    right: 0;
    opacity: 0;
    transform: scale(.5);
    transition: opacity 200ms ease, transform 200ms ease;
  }
  
  .progress-overlay:hover .progress-overlay__handle::after,
  .progress-bar__dragging .progress-overlay__handle::after {
    opacity: 1;
    transform: scale(1);
  }
  
  .outer {
    height: .6rem;
    background-color: var(--color-grey-50);
    border-radius: .6rem;
    margin-bottom: .2rem;
    overflow: hidden;
  }
  
  .inner {
    height: .6rem;
    border-radius: .6rem;
    background-color: var(--color-primary);
  }
  
  .progress-time {
    display: flex;
    justify-content: space-between;
    height: 1.6rem;
  }
`;