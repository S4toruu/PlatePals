import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const ingredients = await prisma.ingredient.findMany()
      return res.status(200).json({ count: ingredients.length, result: ingredients })
    }
    return res.status(405).json({ message: 'Method not allowed' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong. Please try again.' })
  } finally {
    await prisma.$disconnect()
  }
}
