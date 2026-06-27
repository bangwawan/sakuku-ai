import { pool } from '~/server/utils/db';
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try { await pool.execute('INSERT INTO kategori (jenis, nama) VALUES (?, ?)', [body.jenis, body.nama]); return { status: 'success', pesan: 'Kategori ditambahkan!' }; }
    catch (e: any) { return { status: 'error', pesan: e.message }; }
});