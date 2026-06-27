import { pool } from '~/server/utils/db';
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try { await pool.execute('UPDATE kantong SET nama = ? WHERE nama = ?', [body.namaBaru, body.namaLama]); return { status: 'success', pesan: 'Kantong diperbarui!' }; }
    catch (e: any) { return { status: 'error', pesan: e.message }; }
});