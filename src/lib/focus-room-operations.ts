// Database operations for Focus Rooms - Production Ready
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Basic Focus Room CRUD Operations
export async function createFocusRoom(data: {
  name: string
  purpose?: string
  clubId: string
}) {
  return prisma.focusRoom.create({
    data: {
      name: data.name,
      purpose: data.purpose,
      clubId: data.clubId
    },
    include: {
      club: {
        include: {
          community: true
        }
      }
    }
  })
}

export async function getFocusRoom(id: string) {
  return prisma.focusRoom.findUnique({
    where: { id },
    include: {
      club: {
        include: {
          community: true
        }
      }
    }
  })
}

export async function updateFocusRoom(id: string, data: {
  name?: string
  purpose?: string
}) {
  return prisma.focusRoom.update({
    where: { id },
    data,
    include: {
      club: {
        include: {
          community: true
        }
      }
    }
  })
}

export async function deleteFocusRoom(id: string) {
  return prisma.focusRoom.delete({
    where: { id }
  })
}

export async function listFocusRooms(clubId?: string) {
  return prisma.focusRoom.findMany({
    where: clubId ? { clubId } : undefined,
    include: {
      club: {
        include: {
          community: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
