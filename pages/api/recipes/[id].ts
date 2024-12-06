import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const { id } = req.query

      if (!id) {
        return res.status(400).json({ message: 'Recipe ID is required' })
      }
      const recipe = await prisma.recipe.findFirst({
        where: { id: Number(id) }
      })
      return res.status(200).json({ recipe })
    }
    return res.status(405).json({ message: 'Method not allowed' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong. Please try again.' })
  } finally {
    await prisma.$disconnect()
  }
}