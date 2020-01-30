import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

export default function DevItem ({ dev }) {
  return (
    <li className="dev-item">
      <header>
        <img src={dev.avatar_url} alt={dev.name} />
        <div className="user-info">
          <strong>{dev.name}</strong>
          <span>{dev.techs.join(', ')}</span>
        </div>
      </header>
      <p>{dev.bio}</p>
      <a target="_blank" rel="noopener noreferrer" href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
    </li>
  )
}

DevItem.propTypes = {
  dev: PropTypes.object
}
