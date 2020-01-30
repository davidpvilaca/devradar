import React from 'react'
import PropTypes from 'prop-types'
import { WebView } from 'react-native-webview'

export default function Profile ({ navigation }) {
  const githubUsername = navigation.getParam('github_username')
  return (
    <WebView style={{ flex: 1 }} source={{ uri: `https://github.com/${githubUsername}` }} />
  )
}

Profile.propTypes = {
  navigation: PropTypes.object
}
