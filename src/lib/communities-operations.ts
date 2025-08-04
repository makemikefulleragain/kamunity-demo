// Database operations for Communities and Clubs with federation logic
import { PrismaClient } from '@prisma/client'
import { 
  CreateCommunityData, 
  CreateClubData, 
  UpdateCommunityData, 
  UpdateClubData,
  FederationMetrics,
  ClubMetrics
} from '@/types/communities'

const prisma = new PrismaClient()

// Community Operations
export async function createCommunity(data: CreateCommunityData) {
  return prisma.community.create({
    data: {
      ...data,
      tags: data.tags || []
    },
    include: {
      clubs: true,
      members: true,
      _count: {
        select: {
          clubs: true,
          members: true
        }
      }
    }
  })
}

export async function getCommunity(id: string) {
  return prisma.community.findUnique({
    where: { id },
    include: {
      clubs: {
        include: {
          rooms: true,
          members: true,
          _count: {
            select: {
              rooms: true,
              members: true
            }
          }
        }
      },
      members: {
        include: {
          user: true
        }
      },
      customReactions: true,
      _count: {
        select: {
          clubs: true,
          members: true
        }
      }
    }
  })
}

export async function getAllCommunities(includeInactive = false) {
  return prisma.community.findMany({
    where: includeInactive ? {} : { isActive: true },
    include: {
      clubs: {
        where: { status: 'active' }
      },
      _count: {
        select: {
          clubs: true,
          members: true
        }
      }
    },
    orderBy: [
      { isActive: 'desc' },
      { createdAt: 'desc' }
    ]
  })
}

export async function updateCommunity(id: string, data: UpdateCommunityData) {
  return prisma.community.update({
    where: { id },
    data,
    include: {
      clubs: true,
      members: true
    }
  })
}

// Club Operations
export async function createClub(data: CreateClubData) {
  return prisma.club.create({
    data: {
      ...data,
      tags: data.tags || []
    },
    include: {
      community: true,
      rooms: true,
      members: true,
      _count: {
        select: {
          rooms: true,
          members: true
        }
      }
    }
  })
}

export async function getClub(id: string) {
  return prisma.club.findUnique({
    where: { id },
    include: {
      community: true,
      rooms: true,
      members: {
        include: {
          user: true
        }
      },
      _count: {
        select: {
          rooms: true,
          members: true
        }
      }
    }
  })
}

export async function getClubsByCommunity(communityId: string) {
  return prisma.club.findMany({
    where: { communityId },
    include: {
      rooms: true,
      members: true,
      _count: {
        select: {
          rooms: true,
          members: true
        }
      }
    },
    orderBy: [
      { status: 'asc' }, // active first
      { createdAt: 'desc' }
    ]
  })
}

export async function updateClub(id: string, data: UpdateClubData) {
  return prisma.club.update({
    where: { id },
    data,
    include: {
      community: true,
      rooms: true,
      members: true
    }
  })
}

// Federation Logic Operations
export async function calculateFederationMetrics(communityId: string): Promise<FederationMetrics> {
  const community = await prisma.community.findUnique({
    where: { id: communityId },
    include: {
      clubs: {
        include: {
          rooms: true,
          members: true
        }
      },
      members: true
    }
  })

  if (!community) {
    throw new Error('Community not found')
  }

  const totalClubs = community.clubs.length
  const activeClubs = community.clubs.filter(club => club.status === 'active').length
  const totalMembers = community.members.length
  const totalRooms = community.clubs.reduce((sum, club) => sum + club.rooms.length, 0)
  const averageRoomsPerClub = totalClubs > 0 ? totalRooms / totalClubs : 0

  // Calculate federation health
  let federationHealth: FederationMetrics['federationHealth'] = 'critical'
  if (activeClubs >= community.minimumClubs && averageRoomsPerClub >= 3) {
    federationHealth = 'healthy'
  } else if (activeClubs >= Math.ceil(community.minimumClubs * 0.7)) {
    federationHealth = 'growing'
  } else if (activeClubs >= Math.ceil(community.minimumClubs * 0.4)) {
    federationHealth = 'struggling'
  }

  const eligibleForExpansion = federationHealth === 'healthy' && totalMembers > 50

  return {
    communityId,
    totalClubs,
    activeClubs,
    totalMembers,
    averageRoomsPerClub,
    federationHealth,
    eligibleForExpansion
  }
}

export async function calculateClubMetrics(clubId: string): Promise<ClubMetrics> {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      rooms: true,
      members: true
    }
  })

  if (!club) {
    throw new Error('Club not found')
  }

  const totalRooms = club.rooms.length
  const activeRooms = club.rooms.length // Simplified - in real app, check recent activity
  const totalMembers = club.members.length
  const recentActivity = 75 // Mock - would calculate from actual activity data
  const impactScore = Math.min(100, (activeRooms * 10) + (totalMembers * 5) + recentActivity)

  // Determine eligibility status
  let eligibilityStatus: ClubMetrics['eligibilityStatus'] = 'inactive'
  if (totalRooms >= club.minimumRooms && totalMembers >= 5 && recentActivity > 50) {
    eligibilityStatus = 'eligible'
  } else if (totalRooms >= Math.ceil(club.minimumRooms * 0.6) && totalMembers >= 3) {
    eligibilityStatus = 'developing'
  }

  return {
    clubId,
    totalRooms,
    activeRooms,
    totalMembers,
    recentActivity,
    impactScore,
    eligibilityStatus
  }
}

// Auto-update club eligibility based on metrics
export async function updateClubEligibility(clubId: string) {
  const metrics = await calculateClubMetrics(clubId)
  const isEligible = metrics.eligibilityStatus === 'eligible'

  return prisma.club.update({
    where: { id: clubId },
    data: { isEligibleForCommunity: isEligible }
  })
}

// Search and Discovery
export async function searchCommunities(query: string, tags?: string[]) {
  const whereClause: any = {
    isActive: true,
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { featuredContent: { contains: query, mode: 'insensitive' } }
    ]
  }

  if (tags && tags.length > 0) {
    whereClause.tags = {
      hasSome: tags
    }
  }

  return prisma.community.findMany({
    where: whereClause,
    include: {
      clubs: {
        where: { status: 'active' }
      },
      _count: {
        select: {
          clubs: true,
          members: true
        }
      }
    },
    orderBy: [
      { members: { _count: 'desc' } },
      { createdAt: 'desc' }
    ]
  })
}

export async function searchClubs(query: string, communityId?: string, tags?: string[]) {
  const whereClause: any = {
    status: { in: ['active', 'forming'] },
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { purpose: { contains: query, mode: 'insensitive' } }
    ]
  }

  if (communityId) {
    whereClause.communityId = communityId
  }

  if (tags && tags.length > 0) {
    whereClause.tags = {
      hasSome: tags
    }
  }

  return prisma.club.findMany({
    where: whereClause,
    include: {
      community: true,
      rooms: true,
      _count: {
        select: {
          rooms: true,
          members: true
        }
      }
    },
    orderBy: [
      { members: { _count: 'desc' } },
      { createdAt: 'desc' }
    ]
  })
}

// Membership Operations
export async function joinCommunity(userId: string, communityId: string, role = 'member') {
  return prisma.membership.create({
    data: {
      userId,
      communityId,
      role
    }
  })
}

export async function joinClub(userId: string, clubId: string, role = 'member') {
  return prisma.membership.create({
    data: {
      userId,
      clubId,
      role
    }
  })
}

export async function getUserMemberships(userId: string) {
  return prisma.membership.findMany({
    where: { userId },
    include: {
      community: true,
      club: {
        include: {
          community: true
        }
      }
    }
  })
}

export { prisma }
