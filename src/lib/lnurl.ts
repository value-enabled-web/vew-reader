import axios from 'axios'
import lightningPayReq from 'bolt11'
import Hex from 'crypto-js/enc-hex'
import sha256 from 'crypto-js/sha256'
import Config from 'react-native-config'

export interface LNURLError {
  status: 'ERROR'
  reason: string
}

interface LNURLPaymentDetails {
  callback: string
  maxSendable: number
  minSendable: number
  metadata: string
  tag: 'payRequest'
}

export interface LNURLPaymentInfo {
  pr: string
}

const urlFromLnAddress = (lnAddress: string): string => {
  // Taken from: https://emailregex.com
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!lnAddress.match(emailRegex)) {
    throw new Error('invalid ln address')
  }

  let address = lnAddress

  if (Config.DEV_LOCAL_LNADDRESS) {
    address = Config.DEV_LOCAL_LNADDRESS
  }

  let [name, host] = address.split('@')

  // remove invisible characters %EF%B8%8F
  name = name.replace(/[^ -~]+/g, '')
  host = host.replace(/[^ -~]+/g, '')

  let url = `https://${host}/.well-known/lnurlp/${name}`

  console.log(`transforming ${address} to: ${url}`)

  return url
}

const fetchPaymentDetails = async (
  url: string,
): Promise<LNURLPaymentDetails> => {
  let requestUrl = url

  if (Config.DEV_LOCAL_LNADDRESS) {
    requestUrl = requestUrl.replace('https', 'http')
  }

  console.log(`fetching payment details: ${requestUrl}`)

  try {
    const response = await axios.get<LNURLPaymentDetails | LNURLError>(
      requestUrl,
    )

    if (!Object.prototype.hasOwnProperty.call(response.data, 'callback')) {
      throw response.data as LNURLError
    }

    return response.data as LNURLPaymentDetails
  } catch (error) {
    throw error
  }
}

const fetchPaymentInfo = async (
  url: string,
  amountSats: number,
): Promise<LNURLPaymentInfo> => {
  let requestUrl = url

  if (Config.DEV_LOCAL_LNADDRESS) {
    let host = Config.DEV_LOCAL_LNADDRESS.split('@')[1]

    requestUrl = requestUrl.replace('https', 'http')
    requestUrl = requestUrl.replace('127.0.0.1:3001', host)
  }

  console.log(
    `fetching payment info: ${requestUrl}?amount=${amountSats * 1000}`,
  )

  try {
    const response = await axios.get<LNURLPaymentInfo | LNURLError>(
      requestUrl,
      {
        params: { amount: amountSats * 1000 },
      },
    )

    if (!Object.prototype.hasOwnProperty.call(response.data, 'pr')) {
      throw response.data as LNURLError
    }

    return response.data as LNURLPaymentInfo
  } catch (error) {
    throw error
  }
}

const verifyInvoice = (
  paymentDetails: LNURLPaymentDetails,
  paymentInfo: LNURLPaymentInfo,
  amountSats: number,
): boolean => {
  const invoice = lightningPayReq.decode(paymentInfo.pr)
  const metadata = paymentDetails.metadata

  const metadataHash = sha256(metadata).toString(Hex)

  const metadataHashOk = invoice.tagsObject.purpose_commit_hash === metadataHash
  const amountOk = invoice.millisatoshis === String(amountSats * 1000)

  console.log(`invoice verified: ${metadataHashOk && amountOk}`)

  return metadataHashOk && amountOk
}

export {
  urlFromLnAddress,
  fetchPaymentDetails,
  fetchPaymentInfo,
  verifyInvoice,
}
