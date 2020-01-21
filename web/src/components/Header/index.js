import React from 'react';

import './styles.css';

export default function Header() {
  return (
    <header className="app-header">
      <span className="logo-name">DevRadar</span>
      <div className="right">
        <a href="https://github.com/davidpvilaca/devradar" target="_blank" rel="noopener noreferrer">Github</a>
      </div>
    </header>
  );
}
