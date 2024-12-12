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

      if (Number.isNaN(parseInt(servings, 10))) {
        return res.status(400).json({ message: 'Servings must be a number' })
      }

      ingredients.forEach((ingredient) => {
        if (Number.isNaN(parseFloat(ingredient.amount))) {
          return res.status(400).json({ message: `Amount for ingredient ${ingredient.name} must be a valid number` })
        }
        ingredient.amount = parseFloat(ingredient.amount)
      })

      const ingredientIds = await Promise.all(ingredients.map(async (ingredient: any) => {
        const existingIngredient = await prisma.ingredient.findUnique({
          where: { name: ingredient.name }
        })
        if (existingIngredient) {
          return { id: existingIngredient.id, amount: ingredient.amount }
        }
        const newIngredient = await prisma.ingredient.create({
          data: { name: ingredient.name, unit: ingredient.unit }
        })
        return { id: newIngredient.id, amount: ingredient.amount }
      }))

      const recipe = await prisma.recipe.create({
        // @ts-ignore
        data: {
          title: String(title),
          slug: title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
            .trim(),
          description: String(description),
          servings: Number(servings),
          type: String(type),
          imageUrl: 'https://placehold.co/400x400.png',
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
