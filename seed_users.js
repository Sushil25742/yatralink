const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const db = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

function secureHash(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

const users = [
  { name: 'Hary', email: 'hary123@gmail.com', password: '123456', role: 'traveler' },
  { name: 'Pratima', email: 'pratima@gmail.com', password: '123456', role: 'traveler' },
  { name: 'Asim', email: 'asim@operator.com', password: '123456', role: 'operator' },
  { name: 'Sushil', email: 'sushil@admin.com', password: 'sushil@123456', role: 'superadmin' },
  { name: 'Hemanta', email: 'hemanta@engineer.com', password: '1234567', role: 'engineer' }
];

async function seed() {
  for (const u of users) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = secureHash(u.password, salt);
    
    // Check if exists
    const { data: exists } = await db.from('users_custom').select('email').eq('email', u.email).maybeSingle();
    if (exists) {
      console.log(`User ${u.email} already exists, updating...`);
      await db.from('users_custom').update({
        name: u.name,
        role: u.role,
        password_hash: hash,
        password_salt: salt
      }).eq('email', u.email);
    } else {
      console.log(`Inserting ${u.email}...`);
      const { error } = await db.from('users_custom').insert({
        email: u.email,
        name: u.name,
        role: u.role,
        password_hash: hash,
        password_salt: salt
      });
      if (error) console.error(error);
    }
  }
  console.log('Done!');
}
seed();
