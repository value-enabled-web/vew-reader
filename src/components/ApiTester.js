import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ActivityIndicator, Button } from 'react-native'

import {
  createAccount,
  getBalance,
  getFundingInvoice,
  login,
} from '../api/LndHub/Api'
import {
  persistCredentials,
  loadCredentials,
  deleteCredentials,
} from '../api/LndHub/Credentials'
import { deleteUser } from '../api/LndHub/User'

const ApiTester = ({ username, password, createUser, dismiss }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [hasCredentials, setHasCredentials] = useState(false)

  const [dataToRender, setDataToRender] = useState(null)

  useEffect(() => {
    async function tryLoadCredentials() {
      setIsLoading(true)
      setError(null)

      try {
        const credentials = await loadCredentials()
        if (credentials !== null) {
          setHasCredentials(true)
        }
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    tryLoadCredentials()
  }, [])

  async function onCreateAccount() {
    setIsLoading(true)

    try {
      const user = await createUser()

      await createAccount(user.username, user.password)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function onLogin() {
    setIsLoading(true)

    try {
      const credentials = await login(username, password)

      await persistCredentials(credentials)
      setHasCredentials(true)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function onLogout() {
    setIsLoading(true)

    try {
      await deleteCredentials()
      setHasCredentials(false)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function onGetBalance() {
    setIsLoading(true)

    try {
      const credentials = await loadCredentials()

      if (credentials === null) {
        return
      }

      const balance = await getBalance(credentials)
      setDataToRender(balance)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function onGetFundingInvoice() {
    setIsLoading(true)

    try {
      const credentials = await loadCredentials()

      if (credentials === null) {
        return
      }

      const response = await getFundingInvoice(credentials, 2000)
      setDataToRender(response.payment_request)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function onReset() {
    setIsLoading(true)

    try {
      setDataToRender(null)

      await deleteCredentials()
      setHasCredentials(false)

      await deleteUser()

      dismiss()
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return <Text>💔 {JSON.stringify(error)}</Text>
  }

  if (isLoading) {
    return <ActivityIndicator animating={true} />
  }

  return (
    <View style={styles.container}>
      <Button
        title="Create Account"
        disabled={username && password}
        onPress={onCreateAccount}
      />
      <Button
        title="Login"
        disabled={(!username && !password) || hasCredentials}
        onPress={onLogin}
      />
      <Button title="Logout" disabled={!hasCredentials} onPress={onLogout} />
      <Button
        title="Balance"
        disabled={!hasCredentials}
        onPress={onGetBalance}
      />
      <Button
        title="Funding Invoice"
        disabled={!hasCredentials}
        onPress={onGetFundingInvoice}
      />
      <Button title="Reset" onPress={onReset} />
      {dataToRender && (
        <Text selectable={true}>{JSON.stringify(dataToRender)}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ApiTester
