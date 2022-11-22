import AsyncStorage from '@react-native-async-storage/async-storage'

// Todo: Using *unencrypted* AsyncStorage to persist secrets is obviously not safe. In a prodction setting we need to use encrypted storage like the Keychain on iOS.

const USER_KEY = 'LNDHUB-USER'

export interface User {
  username: string
  password: string
}

const persistUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}

const deleteUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}

const loadUser = async (): Promise<User | null> => {
  try {
    let user = await AsyncStorage.getItem(USER_KEY)

    return user != null ? JSON.parse(user) : null
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}

export { persistUser, deleteUser, loadUser }
