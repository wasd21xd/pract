import express, { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware'

const router = express.Router()
const prisma = new PrismaClient()

// Get messages
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { taskId: null },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'asc' },
      take: 100
    })
    res.json(messages.map(m => ({
      id: m.id,
      taskId: 'general',
      userId: m.userId,
      userName: m.user.name,
      message: m.message,
      createdAt: m.createdAt
    })))
  } catch (err) {
    res.status(500).json({ message: 'Failed to get messages' })
  }
})

// Save message
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body
    const saved = await prisma.chatMessage.create({
      data: { userId: req.userId!, message, taskId: null },
      include: { user: { select: { name: true } } }
    })
    res.json({
      id: saved.id,
      taskId: 'general',
      userId: saved.userId,
      userName: saved.user.name,
      message: saved.message,
      createdAt: saved.createdAt
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to save message' })
  }
})

export default router
