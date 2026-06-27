import { pool } from '~/server/utils/db';
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try { await pool.execute('INSERT INTO kantong (nama) VALUES (?)', [body.nama]); return { status: 'success', pesan: 'Kantong ditambahkan!' }; }
    catch (e: any) { return { status: 'error', pesan: e.message }; }
});