import axios from 'axios'
import Config from 'react-native-config'

import { Credentials } from './Credentials'

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

interface CreateAccountResponse {
  login: string
  password: string
}

interface AuthResponse {
  access_token: string
  refresh_token: string
}

interface GetBalanceResponse {
  balance: number
  currency: string
  unit: string
}

interface GetFundingInvoiceResponse {
  expires_at: string
  payment_hash: string
  payment_request: string
}

interface PayInvoiceResponse {
  amount: number
  description: string
  description_hash: string
  destination: string
  fee: number
  payment_hash: string
  payment_preimage: string
  payment_request: string
}

const createAccount = async (
  username: string,
  password: string,
): Promise<CreateAccountResponse> => {
  const { data } = await axios.post<CreateAccountResponse>(
    `${Config.LNDHUB_API_URL}/v2/users`,
    { login: username, password },
    { headers: { ...DEFAULT_HEADERS } },
  )

  return data
}

const login = async (
  username: string,
  password: string,
): Promise<Credentials> => {
  const { data } = await axios.post<AuthResponse>(
    `${Config.LNDHUB_API_URL}/auth`,
    { login: username, password },
    { headers: { ...DEFAULT_HEADERS } },
  )

  return { accessToken: data.access_token, refreshToken: data.refresh_token }
}

const refreshCredentials = async (
  refreshToken: string,
): Promise<Credentials> => {
  const { data } = await axios.post<AuthResponse>(
    `${Config.LNDHUB_API_URL}/auth`,
    { refresh_token: refreshToken },
    { headers: { ...DEFAULT_HEADERS } },
  )

  return { accessToken: data.access_token, refreshToken: data.refresh_token }
}

const getBalance = async (
  credentials: Credentials,
): Promise<GetBalanceResponse> => {
  const { data } = await axios.get<GetBalanceResponse>(
    `${Config.LNDHUB_API_URL}/v2/balance`,
    {
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${credentials.accessToken}`,
      },
    },
  )

  return data
}

const getFundingInvoice = async (
  credentials: Credentials,
  amountSats: number,
): Promise<GetFundingInvoiceResponse> => {
  const { data } = await axios.post<GetFundingInvoiceResponse>(
    `${Config.LNDHUB_API_URL}/v2/invoices`,
    { amount: amountSats, description: 'monocle top-up' },
    {
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${credentials.accessToken}`,
      },
    },
  )

  return data
}

const payInvoice = async (
  credentials: Credentials,
  invoice: string,
  amountSats: string,
): Promise<PayInvoiceResponse> => {
  const { data } = await axios.post<PayInvoiceResponse>(
    `${Config.LNDHUB_API_URL}/v2/payments/bolt11`,
    { amount: amountSats, invoice },
    {
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${credentials.accessToken}`,
      },
    },
  )

  return data
}

export {
  createAccount,
  login,
  refreshCredentials,
  getBalance,
  getFundingInvoice,
  payInvoice,
}
