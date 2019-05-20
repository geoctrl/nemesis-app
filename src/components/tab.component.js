import React, { Component } from 'react';
import { Scoped, k } from 'kremling';

export class TabContainer extends Component {
  render() {
    return (
      <Scoped css={css}>
        <div className="tab-container">
          {this.props.children}
        </div>
      </Scoped>
    );
  }
}

const css = k`
  .tab-container {
    border-bottom: solid .1rem var(--color-grey-100);
    display: flex;
    align-items: center;
    padding: 0 .8rem;
  }
  
  .tab-container > * {
    padding: .8rem .8rem 1rem .8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    position: relative;
    margin-right: .4rem;
  }
  
  .tab-container > *.active::after {
    content: '';
    height: .3rem;
    background-color: var(--color-grey-100);
    position: absolute;
    bottom: 0;
    left: .8rem;
    right: .8rem;
  }
`;