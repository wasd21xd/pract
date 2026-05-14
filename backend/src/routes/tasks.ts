import express, { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware'

const router = express.Router()
const prisma = new PrismaClient()

// Get all team tasks
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    })

    if (!user?.teamId) {
      return res.status(400).json({ message: 'User is not in a team' })
    }

    const tasks = await prisma.task.findMany({
      where: { teamId: user.teamId },
      include: { assignedTo: true }
    })

    res.json(tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      assignedTo: t.assignedTo ? {
        id: t.assignedTo.id,
        name: t.assignedTo.name,
        email: t.assignedTo.email
      } : null,
      teamId: t.teamId,
      createdAt: t.createdAt
    })))
  } catch (err) {
    console.error('Get tasks error:', err)
    res.status(500).json({ message: 'Failed to get tasks' })
  }
})

// Create task
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, teamId, status = 'todo' } = req.body

    if (!title || !teamId) {
      return res.status(400).json({ message: 'Title and teamId are required' })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        teamId
      }
    })

    res.status(201).json({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      teamId: task.teamId,
      createdAt: task.createdAt
    })
  } catch (err) {
    console.error('Create task error:', err)
    res.status(500).json({ message: 'Failed to create task' })
  }
})

// Update task
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, status, assignedToId } = req.body

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(assignedToId && { assignedToId })
      }
    })

    res.json({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      teamId: task.teamId,
      createdAt: task.createdAt
    })
  } catch (err) {
    console.error('Update task error:', err)
    res.status(500).json({ message: 'Failed to update task' })
  }
})

// Delete task
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    await prisma.task.delete({
      where: { id }
    })

    res.json({ message: 'Task deleted' })
  } catch (err) {
    console.error('Delete task error:', err)
    res.status(500).json({ message: 'Failed to delete task' })
  }
})

export default router
