import { PrismaClient, Unit } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function truncateDatabase() {
  await prisma.recipeIngredient.deleteMany({})
  await prisma.vote.deleteMany({})
  await prisma.recipe.deleteMany({})
  await prisma.ingredient.deleteMany({})
  await prisma.user.deleteMany({})
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim()
}

async function main() {
  await truncateDatabase()

  const hashedPassword = await bcrypt.hash('user', 10)

  const user = await prisma.user.create({
    data: {
      name: 'Default User',
      mail: 'user@example.com',
      password: hashedPassword
    }
  })

  const ingredientsData = [
    { name: 'Flour', unit: Unit.GRAMS },
    { name: 'Sugar', unit: Unit.GRAMS },
    { name: 'Butter', unit: Unit.GRAMS },
    { name: 'Eggs', unit: Unit.DEFAULT },
    { name: 'Salt', unit: Unit.GRAMS },
    { name: 'Baking Powder', unit: Unit.DEFAULT },
    { name: 'Chocolate Chips', unit: Unit.GRAMS },
    { name: 'Cheese', unit: Unit.GRAMS },
    { name: 'Tomatoes', unit: Unit.GRAMS },
    { name: 'Basil', unit: Unit.GRAMS }
  ]

  const ingredients = await Promise.all(
    ingredientsData.map((data) => prisma.ingredient.create({ data }))
  )

  const recipes = await Promise.all([
    prisma.recipe.create({
      data: {
        title: 'Chocolate Chip Cookies',
        slug: generateSlug('Chocolate Chip Cookies'),
        description: 'Delicious chocolate chip cookies',
        servings: 4,
        type: 'Cookies',
        imageUrl: 'https://placehold.co/400x400.png',
        userId: user.id
      }
    }),
    prisma.recipe.create({
      data: {
        title: 'Butter Cookies',
        slug: generateSlug('Butter Cookies'),
        description: 'Crispy butter cookies',
        servings: 4,
        type: 'Cookies',
        imageUrl: 'https://placehold.co/400x400.png',
        userId: user.id
      }
    }),
    prisma.recipe.create({
      data: {
        title: 'Cheese Crackers',
        slug: generateSlug('Cheese Crackers'),
        description: 'Savory cheese crackers',
        servings: 4,
        type: 'Starters',
        imageUrl: 'https://placehold.co/400x400.png',
        userId: user.id
      }
    }),
    prisma.recipe.create({
      data: {
        title: 'Tomato Basil Bruschetta',
        slug: generateSlug('Tomato Basil Bruschetta'),
        description: 'Fresh tomato basil bruschetta',
        servings: 4,
        type: 'Starters',
        imageUrl: 'https://placehold.co/400x400.png',
        userId: user.id
      }
    }),
    prisma.recipe.create({
      data: {
        title: 'Garlic Bread',
        slug: generateSlug('Garlic Bread'),
        description: 'Crispy garlic bread',
        servings: 4,
        type: 'Starters',
        imageUrl: 'https://placehold.co/400x400.png',
        userId: user.id
      }
    }),
    prisma.recipe.create({
      data: {
        title: 'Deviled Eggs',
        slug: generateSlug('Deviled Eggs'),
        description: 'Classic deviled eggs',
        servings: 4,
        type: 'Starters',
        imageUrl: 'https://placehold.co/400x400.png',
        userId: user.id
      }
    })
  ])

  const recipeIngredients = [
    { recipeTitle: 'Chocolate Chip Cookies', ingredientName: 'Flour', amount: 200 },
    { recipeTitle: 'Chocolate Chip Cookies', ingredientName: 'Sugar', amount: 100 },
    { recipeTitle: 'Chocolate Chip Cookies', ingredientName: 'Butter', amount: 100 },
    { recipeTitle: 'Chocolate Chip Cookies', ingredientName: 'Eggs', amount: 2 },
    { recipeTitle: 'Chocolate Chip Cookies', ingredientName: 'Baking Powder', amount: 1 },
    { recipeTitle: 'Chocolate Chip Cookies', ingredientName: 'Chocolate Chips', amount: 150 },
    { recipeTitle: 'Butter Cookies', ingredientName: 'Flour', amount: 200 },
    { recipeTitle: 'Butter Cookies', ingredientName: 'Sugar', amount: 100 },
    { recipeTitle: 'Butter Cookies', ingredientName: 'Butter', amount: 100 },
    { recipeTitle: 'Butter Cookies', ingredientName: 'Eggs', amount: 2 },
    { recipeTitle: 'Butter Cookies', ingredientName: 'Baking Powder', amount: 1 },
    { recipeTitle: 'Cheese Crackers', ingredientName: 'Cheese', amount: 200 },
    { recipeTitle: 'Cheese Crackers', ingredientName: 'Butter', amount: 100 },
    { recipeTitle: 'Cheese Crackers', ingredientName: 'Salt', amount: 1 },
    { recipeTitle: 'Tomato Basil Bruschetta', ingredientName: 'Tomatoes', amount: 200 },
    { recipeTitle: 'Tomato Basil Bruschetta', ingredientName: 'Basil', amount: 50 },
    { recipeTitle: 'Tomato Basil Bruschetta', ingredientName: 'Butter', amount: 50 },
    { recipeTitle: 'Garlic Bread', ingredientName: 'Butter', amount: 100 },
    { recipeTitle: 'Garlic Bread', ingredientName: 'Salt', amount: 1 },
    { recipeTitle: 'Deviled Eggs', ingredientName: 'Eggs', amount: 6 },
    { recipeTitle: 'Deviled Eggs', ingredientName: 'Salt', amount: 1 }
  ]

  for (const ri of recipeIngredients) {
    const recipe = recipes.find((r) => r.title === ri.recipeTitle)
    const ingredient = ingredients.find((i) => i.name === ri.ingredientName)
    if (recipe && ingredient) {
      await prisma.recipeIngredient.create({
        data: {
          recipeId: recipe.id,
          ingredientId: ingredient.id,
          amount: ri.amount
        }
      })
    }
  }

  const votes = [
    { userId: user.id, recipeId: recipes[0].id, stars: 4 },
    { userId: user.id, recipeId: recipes[1].id, stars: 3 },
    { userId: user.id, recipeId: recipes[2].id, stars: 2 },
    { userId: user.id, recipeId: recipes[3].id, stars: 4 },
    { userId: user.id, recipeId: recipes[4].id, stars: 1 },
    { userId: user.id, recipeId: recipes[5].id, stars: 3 }
  ]

  await prisma.vote.createMany({
    data: votes
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
