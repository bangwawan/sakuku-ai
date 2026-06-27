import { pool } from '~/server/utils/db';
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try { await pool.execute('DELETE FROM kantong WHERE nama = ?', [body.nama]); return { status: 'success', pesan: 'Kantong dihapus!' }; }
    catch (e: any) { return { status: 'error', pesan: e.message }; }
});