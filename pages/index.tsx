import Head from 'next/head'
import { GetServerSidePropsResult } from 'next'
import { PrismaClient } from '@prisma/client'
import { groupBy } from 'lodash'

import { useModal } from 'context/modal-context'
import { Layout } from 'components/layout'
import { RecipeTeaser } from 'components/entities/recipe--teaser'
import { Modal } from 'components/molecules/modal'
import { CardLogin } from 'components/molecules/card-login'

const prisma = new PrismaClient()

interface IndexPageProps {
  recipesByTypes: object,
}

export default function IndexPage({ recipesByTypes }: IndexPageProps) {
  const { isOpen } = useModal()
  return (
    <Layout>
      <Head>
        <title>PlatePals</title>
        <meta
          name="description"
          content="A Next.js site powered by PlatePals."
        />
      </Head>
      <div>
        <h1 className="text-3xl">Our Recipes</h1>
        <div className="mb-6">
          {Object.keys(recipesByTypes).map((type) => (
            <div key={type} className="mb-6">
              <h2 className="text-2xl">{type}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {recipesByTypes[type].map((recipe) => (
                  <RecipeTeaser recipe={recipe} key={recipe.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
        {isOpen && (
          <Modal>
            <CardLogin />
          </Modal>
        )}
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<IndexPageProps>> {
  let recipes = []
  if (context.query.type) {
    recipes = await prisma.recipe.findMany({
      where: {
        type: context.query.type
      },
      include: {
        votes: true
      }
    })
  } else {
    recipes = await prisma.recipe.findMany({
      include: {
        votes: true
      }
    })
  }

  const recipesWithAverageStars = recipes.map((recipe) => {
    const totalStars = recipe.votes.reduce((acc, vote) => acc + vote.stars, 0)
    const averageStars = recipe.votes.length ? totalStars / recipe.votes.length : 0
    return {
      ...recipe,
      averageStars
    }
  })

  const recipesByTypes = groupBy(recipesWithAverageStars, 'type')
  return {
    props: {
      recipesByTypes
    }
  }
}
