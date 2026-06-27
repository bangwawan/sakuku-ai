import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
    const username = getCookie(event, 'user_session');
    if (!username) return { status: 'error', pesan: 'Sesi tidak valid' };

    try {
        const [rows]: any = await pool.execute('SELECT username, role, nama_lengkap, no_wa, email, foto FROM pengguna WHERE username = ?', [username]);
        if (rows.length === 0) return { status: 'error', pesan: 'User tidak ditemukan' };
        return { status: 'success', data: rows[0] };
    } catch (e: any) {
        return { status: 'error', pesan: e.message };
    }
});
