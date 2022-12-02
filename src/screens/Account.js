import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  View,
  Text,
  Button,
  ScrollView,
  Pressable,
} from 'react-native'

import Clipboard from '@react-native-clipboard/clipboard'
import Icon from 'react-native-vector-icons/MaterialIcons'
import QRCode from 'react-qr-code'
import urid from 'urid'

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
import { loadUser, persistUser } from '../api/LndHub/User'
import { useThemed } from '../hooks/useThemed'
import { useTheme } from '../theme/theme'

const AccountScreen = ({ navigation }) => {
  const theme = useTheme()
  const themedStyles = useThemed(styles)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showInvoiceText, setShowInvoiceText] = useState(false)
  const [balance, setBalance] = useState(null)
  const [invoice, setInvoice] = useState(null)

  useEffect(() => {
    async function tryLoadUserAndCredentials() {
      setIsLoading(true)
      setError(null)

      try {
        const loadedUser = await loadUser()

        if (loadedUser === null) {
          return
        }

        setUser(loadedUser)

        const loadedCredentials = await loadCredentials()

        if (loadedCredentials === null) {
          return
        }

        setIsLoggedIn(true)

        const loadedBalance = await getBalance(loadedCredentials)

        setBalance(loadedBalance.balance)
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    tryLoadUserAndCredentials()
  }, [])

  async function onCreateAccount() {
    setIsLoading(true)

    try {
      const randomUsername = urid(20, 'alpha')
      const randomPassword = urid(40, 'alphanum') // Todo: This is not secure!

      await persistUser({
        username: randomUsername,
        password: randomPassword,
      })

      setUser({
        username: randomUsername,
        password: randomPassword,
      })

      await createAccount(randomUsername, randomPassword)

      const credentials = await login(randomUsername, randomPassword)

      await persistCredentials(credentials)

      const loadedBalance = await getBalance(credentials)

      setBalance(loadedBalance.balance)

      setIsLoggedIn(true)
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
      const credentials = await login(user.username, user.password)

      await persistCredentials(credentials)

      const loadedBalance = await getBalance(credentials)

      setBalance(loadedBalance.balance)
      setIsLoggedIn(true)
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
      setIsLoggedIn(false)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function onDeleteAccount() {
    setIsLoading(true)

    try {
      await deleteCredentials()
      setIsLoggedIn(false)

      await deleteUser()

      navigation.goBack()
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

      const response = await getFundingInvoice(credentials, 100000)
      setInvoice(response.payment_request)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function onRefreshBalance() {
    setIsLoading(true)

    try {
      const credentials = await loadCredentials()

      if (credentials === null) {
        return
      }

      const loadedBalance = await getBalance(credentials)

      setBalance(loadedBalance.balance)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <SafeAreaView>
        <Text>💔 Error</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={themedStyles.background}>
      <ScrollView style={themedStyles.scrollView}>
        <View style={themedStyles.container}>
          {isLoading ? (
            <ActivityIndicator animating={true} />
          ) : (
            <>
              {user && isLoggedIn && balance !== null && (
                <>
                  <View
                    style={[
                      themedStyles.card,
                      themedStyles.accountIdContainer,
                    ]}>
                    <Text style={themedStyles.text}>Account ID</Text>
                    <Text style={themedStyles.text}>{user.username}</Text>
                  </View>
                  <View
                    style={[themedStyles.card, themedStyles.balanceContainer]}>
                    <Text style={themedStyles.text}>Balance</Text>
                    <View style={themedStyles.balance}>
                      <Text style={themedStyles.text}>{balance} sats</Text>
                      <Pressable
                        onPress={onRefreshBalance}
                        color={theme.colors.foreground}>
                        <Icon
                          style={themedStyles.refreshButton}
                          name="refresh"
                        />
                      </Pressable>
                    </View>
                  </View>
                </>
              )}
              <View style={themedStyles.card}>
                {!user && (
                  <Button
                    style={themedStyles.button}
                    title="Create Account"
                    onPress={onCreateAccount}
                  />
                )}
                {user && !isLoggedIn && (
                  <Button
                    style={themedStyles.button}
                    title="Login"
                    onPress={onLogin}
                  />
                )}
                {user && isLoggedIn && (
                  <Button
                    style={themedStyles.button}
                    title="Logout"
                    onPress={onLogout}
                  />
                )}
                {user && isLoggedIn && (
                  <Button
                    style={themedStyles.button}
                    title="Delete Account"
                    onPress={onDeleteAccount}
                  />
                )}
                {user && isLoggedIn && (
                  <Button
                    style={themedStyles.button}
                    title="Generate Funding Invoice"
                    onPress={onGetFundingInvoice}
                  />
                )}
              </View>
              {invoice && (
                <View style={themedStyles.card}>
                  <View style={themedStyles.qrCodeContainer}>
                    {showInvoiceText ? (
                      <Text selectable style={themedStyles.invoice}>
                        {invoice}
                      </Text>
                    ) : (
                      <QRCode value={invoice.toUpperCase()} />
                    )}
                  </View>
                  <Button
                    title="Copy to Clipboard"
                    onPress={Clipboard.setString(invoice)}
                  />
                  <Button
                    title={
                      showInvoiceText ? 'Show QR code' : 'Show Raw Invoice'
                    }
                    onPress={() => setShowInvoiceText(!showInvoiceText)}
                  />
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = theme =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: theme.spacing.m,
    },
    card: {
      backgroundColor: theme.colors.backgroundHighlighted,
      padding: theme.spacing.m,
      borderRadius: theme.cornerRadius,
      shadowColor: theme.dropShadow.color,
      shadowOffset: theme.dropShadow.offset,
      shadowOpacity: theme.dropShadow.opacity,
      shadowRadius: theme.dropShadow.radius,
      elevation: 1,
      marginBottom: theme.spacing.m,
    },
    accountIdContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    balanceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    balance: {
      flexDirection: 'row',
    },
    refreshButton: {
      color: theme.colors.foreground,
      fontSize: 20,
      marginLeft: 10,
    },
    qrCodeContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    button: {},
    text: {
      fontFamily: theme.text.body.family,
      fontWeight: theme.text.body.weight,
      fontSize: theme.text.body.size,
      color: theme.colors.foreground,
      textAlign: 'center',
    },
    invoice: {
      fontFamily: theme.text.footnoteMono.family,
      fontWeight: theme.text.footnoteMono.weight,
      fontSize: theme.text.footnoteMono.size,
      color: theme.colors.foreground,
      textAlign: 'left',
    },
  })

export default AccountScreen
