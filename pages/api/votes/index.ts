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
    const session = await getServerSession(req, res, authOptions)
    if (req.method === 'POST') {
      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      const { recipeId, stars } = req.body
      if (!recipeId || !stars) {
        return res.status(400).json({ message: 'All fields are required' })
      }
      const upsertedVote = await prisma.vote.upsert({
        where: {
          userId_recipeId: {
            // @ts-ignore
            userId: Number(session.id),
            recipeId: Number(recipeId)
          }
        },
        update: { stars: Number(stars) },
        create: {
          stars: Number(stars),
          // @ts-ignore
          userId: Number(session.id),
          recipeId: Number(recipeId)
        }
      })
      return res.status(200).json(upsertedVote)
    }
    return res.status(405).json({ message: 'Method not allowed' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong. Please try again.' })
  } finally {
    await prisma.$disconnect()
  }
}
