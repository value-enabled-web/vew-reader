import axios from 'axios'
import lightningPayReq from 'bolt11'
import Hex from 'crypto-js/enc-hex'
import sha256 from 'crypto-js/sha256'

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

  let [name, host] = lnAddress.split('@')

  // remove invisible characters %EF%B8%8F
  name = name.replace(/[^ -~]+/g, '')
  host = host.replace(/[^ -~]+/g, '')

  const url = `https://${host}/.well-known/lnurlp/${name}`

  console.log(`transforming ${lnAddress} to: ${url}`)

  return url
}

const fetchPaymentDetails = async (
  url: string,
): Promise<LNURLPaymentDetails> => {
  // todo: this is just for local testing
  console.log(
    `1 replacing ${url} with: http://localhost:3001/.well-known/lnurlp/author`,
  )

  try {
    const response = await axios.get<LNURLPaymentDetails | LNURLError>(
      'http://localhost:3001/.well-known/lnurlp/author',
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
  // todo: this is just for local testing
  console.log(
    `2 replacing ${url} with: http://localhost:3001/.well-known/lnurlp/author`,
  )

  try {
    const response = await axios.get<LNURLPaymentInfo | LNURLError>(
      'http://localhost:3001/.well-known/lnurlp/author',
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

  return metadataHashOk && amountOk
}

export {
  urlFromLnAddress,
  fetchPaymentDetails,
  fetchPaymentInfo,
  verifyInvoice,
}
