// Simple test to verify Prisma client connection
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing Prisma connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Prisma client connected successfully')
    
    // Test if we can query any table
    // Test if we can query the User table
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ User table accessible, count: ${userCount}`);
    } catch (userError) {
      console.log('❌ User table query failed:', userError.message);
      if (userError.code) console.log('Error code:', userError.code);
    }

    // Test if we can query the Action table
    try {
      const actionCount = await prisma.action.count();
      console.log(`✅ Action table accessible, count: ${actionCount}`);
    } catch (actionError) {
      console.log('❌ Action table query failed:', actionError.message);
      if (actionError.code) console.log('Error code:', actionError.code);
    }
    
  } catch (error) {
    console.log('❌ Prisma connection failed:', error.message)
    console.log('Error code:', error.code)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
