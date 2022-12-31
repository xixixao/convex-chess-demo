import type { AppProps } from 'next/app'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import clientConfig from '../convex/_generated/clientConfig'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Head from 'next/head'
const convex = new ConvexReactClient(clientConfig)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Head>
        <title>Chess Online</title>
      </Head>
      <ConvexProvider client={convex}>
        <Component {...pageProps} />
      </ConvexProvider>
    </ChakraProvider>
  )
}

export default MyApp
