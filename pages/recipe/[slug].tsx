import { GetServerSidePropsResult } from 'next'
import { PrismaClient } from '@prisma/client'
import Head from 'next/head'

import { Layout } from 'components/layout'
import { RecipeFull, recipeFullProps } from 'components/entities/recipe--full'

const prisma = new PrismaClient()

export default function RecipePage({ recipe }: recipeFullProps) {
  return (
    <Layout>
      <Head>
        <title>
          {recipe.title}
          {' '}
          | PlatePals
        </title>
      </Head>
      <RecipeFull recipe={recipe} />
    </Layout>
  )
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<recipeFullProps>> {
  const recipe = await prisma.recipe.findFirst({
    where: {
      slug: context.params.slug
    },
    include: {
      ingredients: true,
      votes: true
    }
  })

  const totalStars = recipe.votes.reduce((acc, vote) => acc + vote.stars, 0)
  const averageStars = recipe.votes.length ? totalStars / recipe.votes.length : 0

  const ingredientNames = await Promise.all(
    recipe.ingredients.map(async (ingredient) => {
      const ingredientData = await prisma.ingredient.findUnique({
        where: { id: ingredient.ingredientId }
      })
      return {
        name: ingredientData.name,
        amount: ingredient.amount,
        unit: ingredientData.unit
      }
    })
  )

  const { ingredients, votes, ...rest } = recipe

  const extendRecipe = {
    ...rest,
    averageStars,
    ingredientNames
  }

  return {
    props: {
      recipe: extendRecipe
    }
  }
}
