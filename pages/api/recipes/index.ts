import { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const recipes = await prisma.recipe.findMany()
      return res.status(200).json({ count: recipes.length, result: recipes })
    } if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions)
      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      const {
        title, description, servings, type, ingredients
      } = req.body

      if (!title || !description || !servings || !type || !ingredients) {
        return res.status(400).json({ message: 'All fields are required' })
      }

      if (typeof servings !== 'number') {
        return res.status(400).json({ message: 'Servings must be a number' })
      }

      ingredients.forEach((ingredient) => {
        if (typeof ingredient.amount !== 'number' || Number.isNaN(ingredient.amount)) {
          return res.status(400).json({ message: `Amount for ingredient ${ingredient.name} must be a valid number` })
        }
        ingredient.amount = parseFloat(ingredient.amount)
      })

      const ingredientIds = await Promise.all(ingredients.map(async (ingredient: { name: string, amount: number }) => {
        const existingIngredient = await prisma.ingredient.findUnique({
          where: { name: ingredient.name }
        })
        if (existingIngredient) {
          return { id: existingIngredient.id, amount: ingredient.amount }
        }
        const newIngredient = await prisma.ingredient.create({
          data: { name: ingredient.name }
        })
        return { id: newIngredient.id, amount: ingredient.amount }
      }))

      console.log(ingredientIds)

      const recipe = await prisma.recipe.create({
        data: {
          title: String(title),
          description: String(description),
          servings: Number(servings),
          type: String(type),
          user: {
            // @ts-ignore
            connect: { id: Number(session.id) }
          }
        }
      })

      const ingredientConnections = ingredientIds.map((ingredient) => ({
        recipeId: recipe.id,
        ingredientId: ingredient.id,
        amount: ingredient.amount
      }))

      await prisma.recipeIngredient.createMany({
        data: ingredientConnections,
        skipDuplicates: true
      })

      console.log(recipe)

      return res.status(201).json({ recipe })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong. Please try again.' })
  } finally {
    await prisma.$disconnect()
  }
}
