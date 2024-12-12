import React from 'react'
import Head from 'next/head'
import { GetServerSidePropsResult } from 'next'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

import { FormRecipeProvider } from 'context/form-recipe-context'
import { Layout } from 'components/layout'
import { FormRecipe } from 'components/molecules/form-recipe'

interface NewRecipePageProps {
  session: Session
}

export default function NewRecipePage() {
  return (
    <Layout>
      <Head>
        <title>New Recipe | PlatePals</title>
      </Head>
      <FormRecipeProvider>
        <FormRecipe />
      </FormRecipeProvider>
    </Layout>
  )
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<NewRecipePageProps>> {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/login?callback=/recipes/new',
        permanent: false
      }
    }
  }

  return {
    props: {
      session
    }
  }
}
