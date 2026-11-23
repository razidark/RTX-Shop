import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Reset the admin password.
 *
 * The password is NOT hardcoded -- it is read from the environment, so the
 * script never becomes a source of a public credential:
 *
 *   ADMIN_EMAIL=admin@rtxshop.com ADMIN_PASSWORD='your-new-password' \
 *     node server/reset_admin_password.js
 */
const email = process.env.ADMIN_EMAIL || 'admin@rtxshop.com';
const newPassword = process.env.ADMIN_PASSWORD;

async function main() {
  if (!newPassword) {
    console.error('ADMIN_PASSWORD is not set.');
    console.error('Usage: ADMIN_EMAIL=admin@rtxshop.com ADMIN_PASSWORD=\'your-new-password\' node server/reset_admin_password.js');
    process.exit(1);
  }
  if (newPassword.length < 8) {
    console.error('ADMIN_PASSWORD must be at least 8 characters.');
    process.exit(1);
  }

  try {
    console.log(`Hashing new password for ${email}...`);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log('Updating user in the database...');
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    console.log('Password updated successfully for user:', updatedUser.email);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
