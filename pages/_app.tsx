import type { AppProps } from 'next/app'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

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
