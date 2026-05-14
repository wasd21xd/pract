import express, { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../index'

const router = express.Router()
const prisma = new PrismaClient()

// Generate random team code
const generateTeamCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Create team
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Team name is required' })
    }

    const code = generateTeamCode()

    const team = await prisma.team.create({
      data: {
        name,
        code,
        members: {
          connect: { id: req.userId }
        }
      },
      include: {
        members: true
      }
    })

    // Update user's teamId
    await prisma.user.update({
      where: { id: req.userId },
      data: { teamId: team.id }
    })

    res.json({
      id: team.id,
      name: team.name,
      code: team.code,
      members: team.members.map(m => ({
        id: m.id,
        email: m.email,
        name: m.name
      }))
    })
  } catch (err) {
    console.error('Create team error:', err)
    res.status(500).json({ message: 'Failed to create team' })
  }
})

// Get user's team
router.get('/my', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { team: { include: { members: true } } }
    })

    if (!user?.team) {
      return res.status(404).json({ message: 'No team found' })
    }

    res.json({
      id: user.team.id,
      name: user.team.name,
      code: user.team.code,
      members: user.team.members.map(m => ({
        id: m.id,
        email: m.email,
        name: m.name
      }))
    })
  } catch (err) {
    console.error('Get team error:', err)
    res.status(500).json({ message: 'Failed to get team' })
  }
})

// Join team by code
router.post('/join', async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ message: 'Team code is required' })
    }

    const team = await prisma.team.findUnique({
      where: { code },
      include: { members: true }
    })

    if (!team) {
      return res.status(404).json({ message: 'Team not found' })
    }

    // Update user
    await prisma.user.update({
      where: { id: req.userId },
      data: { teamId: team.id }
    })

    // Add user to team members
    const updatedTeam = await prisma.team.update({
      where: { id: team.id },
      data: {
        members: {
          connect: { id: req.userId }
        }
      },
      include: { members: true }
    })

    res.json({
      id: updatedTeam.id,
      name: updatedTeam.name,
      code: updatedTeam.code,
      members: updatedTeam.members.map(m => ({
        id: m.id,
        email: m.email,
        name: m.name
      }))
    })
  } catch (err) {
    console.error('Join team error:', err)
    res.status(500).json({ message: 'Failed to join team' })
  }
})

export default router
