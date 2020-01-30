import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'

import api from '../services/api'
import * as socket from '../services/socket'

export default function Main ({ navigation }) {
  const [devs, setDevs] = useState([])
  const [currentRegion, setCurrentRegion] = useState(null)
  const [techs, setTechs] = useState('')

  useEffect(() => {
    async function loadInitialPosition () {
      const { granted } = await requestPermissionsAsync()

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        })

        const { latitude, longitude } = coords

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03
        })
      }
    }

    loadInitialPosition()
  }, [])

  useEffect(() => {
    socket.subscribeToNewDev(dev => {
      setDevs([...devs, dev])
    })
  }, [devs])

  function setupWebsocket () {
    socket.disconnect()
    const { latitude, longitude } = currentRegion
    socket.connect({ latitude, longitude, techs })
  }

  async function loadDevs () {
    const { latitude, longitude } = currentRegion

    const { data } = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs
      }
    })

    setDevs(data)
    setupWebsocket()
  }

  function handleRegionChange (region) {
    setCurrentRegion(region)
  }

  if (!currentRegion) {
    return null
  }

  return (
    <>
      <MapView
        initialRegion={currentRegion}
        onRegionChangeComplete={handleRegionChange}
        style={styles.map}>
        {devs.map(dev => (
          <Marker key={dev._id} coordinate={{ latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0] }}>
            <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />

            <Callout onPress={() => {
              navigation.navigate('Profile', { github_username: dev.github_username })
            }}>
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.github_username}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={setTechs} />
        <TouchableOpacity style={styles.loadButton}>
          <MaterialIcons
            name="my-location"
            size={20}
            color="#FFF"
            onPress={loadDevs} />
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#fff'
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  devBio: {
    color: '#666',
    marginTop: 5
  },
  devTechs: {
    marginTop: 5
  },

  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row'
  },

  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2
  },

  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8E4DFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  }
})

Main.propTypes = {
  navigation: PropTypes.object
}
