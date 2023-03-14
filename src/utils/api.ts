import axios from 'redaxios'

import { useQuery } from 'react-query'

const getFullUrl = (url: string) => {
  let baseUrl = 'https://dns.adi3000.com/api'
  /* if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://localhost:4000/api'
  }

  if (process.env.NODE_ENV === 'production') {
    baseUrl = process.env.API_URL + '/api'
  } */

  return `${baseUrl}${url}`
}

export function useBlockingStatus() {
  return useQuery(['blocking'], async () => {
    const url = getFullUrl('/blocking/status')
    const { data } = await axios.get(url)
    return data
  })
}

export function useDNSStatus() {
  return useQuery(['dns'], async () => {
    const url = getFullUrl('/dns/status')
    const { data } = await axios.get(url)
    return data
  })
}

export function enableBlocking() {
  const url = getFullUrl('/blocking/enable')
  return axios.get(url)
}

export function disableBlocking(duration?: string) {
  const url = getFullUrl('/blocking/disable?groups=parental')
  return axios.get(url, { params: { duration: duration }})
}

export function disableDNS(duration?: string) {
  const url = getFullUrl('/dns/disable?groups=adi-home')
  return axios.get(url, { params: { duration: duration }})
}

export function refreshLists() {
  const url = getFullUrl('/lists/refresh')
  return axios.post(url)
}

export interface IDNSQuery {
  ip: string
  type: string
  // type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'PTR' | 'SOA' | 'TXT'
}

export function dnsQuery({ ip, type }: IDNSQuery) {
  const url = getFullUrl('/query')
  return axios.post(url, {
    query: ip,
    type
  })
}

/* const options = {
  method: 'POST',
  url: 'http://localhost:4000/api/query',
  headers: { 'Content-Type': 'application/json' },
  data: { query: '1.1.1.1', type: 'A' },
}

axios
  .request(options)
  .then(function (response) {
    console.log(response.data)
  })
  .catch(function (error) {
    console.error(error)
  }) */
