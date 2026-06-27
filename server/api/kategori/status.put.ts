import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!body.nama || body.is_active === undefined) return { status: 'error', pesan: 'Data tidak valid' };

    try {
        await pool.execute('UPDATE kategori SET is_active = ? WHERE nama = ?', [body.is_active, body.nama]);
        return { status: 'success', pesan: `Status kategori ${body.nama} berhasil diubah.` };
    } catch (e: any) {
        return { status: 'error', pesan: e.message };
    }
});
