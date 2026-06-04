import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log('Total users:', users.length);
  if (users.length > 0) {
    console.log('First user email:', users[0].email);
  } else {
    console.log('No users found in database!');
  }
}
main().catch(console.error).finally(() => process.exit(0));
