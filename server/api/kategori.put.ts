import { pool } from '~/server/utils/db';
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try { await pool.execute('UPDATE kategori SET jenis = ?, nama = ? WHERE nama = ?', [body.jenisBaru, body.namaBaru, body.namaLama]); return { status: 'success', pesan: 'Kategori diperbarui!' }; }
    catch (e: any) { return { status: 'error', pesan: e.message }; }
});