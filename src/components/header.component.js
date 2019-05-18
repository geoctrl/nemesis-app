import React, { Component } from 'react';
import { Scoped, k } from 'kremling';

import logoSmall from '../assets/logo-small.svg';

export class Header extends Component {
  render() {
    return (
      <Scoped css={css}>
        <div className="header">
          <div
            className="logo"
            dangerouslySetInnerHTML={{
              __html: logoSmall
            }}
          />
          <div className="header__search">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
            />
          </div>
        </div>
      </Scoped>
    );
  }
}

const css = k`
  .header {
    padding: 1.6rem;
    display: flex;
    border-bottom: solid .1rem var(--color-grey-100);
    background-color: #fff;
    align-items: center;
  }
  
  .logo {
    width: 3rem;
    margin-right: .8rem;
    border-radius: 10rem;
    cursor: pointer;
  }
  
  .header__search {
    flex-grow: 1;
    justify-content: center;
    display: flex;
  }
  
  .header__search input {
    max-width: 50rem;
  }
`;