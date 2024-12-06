import React from 'react'
import Head from 'next/head'

import { Layout } from 'components/layout'
import { CardLogin } from 'components/molecules/card-login'

export default function LoginPage() {
  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>
      <CardLogin type="shadow" />
    </Layout>
  )
}
