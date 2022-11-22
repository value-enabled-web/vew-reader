import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode, { JwtPayload } from 'jwt-decode'

import { refreshCredentials } from './Api'

// Todo: Using *unencrypted* AsyncStorage to persist secrets is obviously not safe. In a prodction setting we need to use encrypted storage like the Keychain on iOS.

const CREDENTIALS_KEY = 'LNDHUB-API-CREDENTIALS'

export interface Credentials {
  accessToken: string
  refreshToken: string
}

const persistCredentials = async (credentials: Credentials): Promise<void> => {
  try {
    await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials))
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}

const deleteCredentials = async () => {
  try {
    await AsyncStorage.removeItem(CREDENTIALS_KEY)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}

const loadCredentials = async (): Promise<Credentials | null> => {
  try {
    const credentials = await loadCredentialsFromStorage()

    if (
      credentials === null ||
      !credentials.accessToken ||
      !credentials.refreshToken
    ) {
      return null
    }

    if (!tokenIsExpired(credentials.accessToken)) {
      return credentials
    }

    // Access token expired. Trying to get a new one using the refresh token.

    if (tokenIsExpired(credentials.refreshToken)) {
      // Both access and refresh tokens are expired. User needs to log in again.
      await deleteCredentials()
      return null
    }

    const newCredentials = await refreshCredentials(credentials.refreshToken)
    await persistCredentials(newCredentials)

    return newCredentials
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}

const loadCredentialsFromStorage = async (): Promise<Credentials | null> => {
  try {
    let credentials = await AsyncStorage.getItem(CREDENTIALS_KEY)

    return credentials != null ? JSON.parse(credentials) : null
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}

const tokenIsExpired = (token: string): boolean => {
  const decoded = jwtDecode<JwtPayload>(token)

  if (decoded.exp === undefined) {
    throw new Error('invalid token - missing field: exp')
  }

  return decoded.exp < Date.now() / 1000
}

export { persistCredentials, deleteCredentials, loadCredentials }
