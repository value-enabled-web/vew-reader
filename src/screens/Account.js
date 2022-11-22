import React, { useEffect, useState } from 'react'
import { StyleSheet, SafeAreaView, ActivityIndicator, Text } from 'react-native'

import urid from 'urid'

import { loadUser, persistUser } from '../api/LndHub/User'
import ApiTester from '../components/ApiTester'
import { useThemed } from '../hooks/useThemed'

const AccountScreen = ({ navigation }) => {
  const themedStyles = useThemed(styles)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [user, setUser] = useState(null)

  useEffect(() => {
    async function tryLoadUser() {
      setIsLoading(true)
      setError(null)

      try {
        const loadedUser = await loadUser()

        if (loadedUser !== null) {
          setUser(loadedUser)
        }
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    tryLoadUser()
  }, [])

  async function createUser() {
    try {
      const randomUsername = urid(20, 'alpha')
      const randomPassword = urid(40, 'alphanum') // Todo: This is not safe!

      await persistUser({
        username: randomUsername,
        password: randomPassword,
      })

      setUser({
        username: randomUsername,
        password: randomPassword,
      })

      return {
        username: randomUsername,
        password: randomPassword,
      }
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    user && navigation.setOptions({ title: user.username })
  }, [navigation, user])

  if (error) {
    return (
      <SafeAreaView>
        <Text>💔 No user.</Text>
      </SafeAreaView>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView>
        <ActivityIndicator animating={true} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={themedStyles.container}>
      <ApiTester
        username={user && user.username}
        password={user && user.password}
        createUser={createUser}
        dismiss={() => navigation.goBack()}
      />
    </SafeAreaView>
  )
}

const styles = theme =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

export default AccountScreen
