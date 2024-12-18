import { PrismaClient } from '@prisma/client'
import { algoliasearch } from 'algoliasearch'

export const client = algoliasearch(
  '976VLGQNAO',
  'bfc0ece95a5e29c9050ac6432a089df0'
)

const prisma = new PrismaClient()

async function syncAlgolia() {
  await client.clearObjects({ indexName: 'plate_pals' })

  const recipes = await prisma.recipe.findMany()
  const ingredients = await prisma.ingredient.findMany()

  const records = recipes.map((recipe) => ({
    objectID: recipe.id,
    title: recipe.title,
    type: recipe.type,
    slug: recipe.slug,
    category: 'recipe'
  }))

  records.push(...ingredients.map((ingredient) => ({
    objectID: ingredient.id,
    title: ingredient.name,
    category: 'ingredient'
  })))

  await client.saveObjects({
    indexName: 'plate_pals',
    objects: records
  })
  console.log('Algolia sync complete')
}

syncAlgolia().catch(console.error).finally(() => prisma.$disconnect())
