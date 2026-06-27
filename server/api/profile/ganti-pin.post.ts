import { pool } from '~/server/utils/db';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
    const userSession = getCookie(event, 'user_session');
    if (!userSession) return { status: 'error', pesan: 'Sesi tidak valid' };

    const body = await readBody(event);
    if (!body.pinLama || !body.pinBaru) {
        return { status: 'error', pesan: 'Data tidak lengkap' };
    }

    try {
        const hashLama = crypto.createHash('md5').update(body.pinLama).digest('hex');
        
        const [rows]: any = await pool.execute('SELECT username FROM pengguna WHERE username = ? AND pin = ?', [userSession, hashLama]);
        if (rows.length === 0) {
            return { status: 'error', pesan: 'PIN lama salah' };
        }

        const hashBaru = crypto.createHash('md5').update(body.pinBaru).digest('hex');
        await pool.execute('UPDATE pengguna SET pin = ? WHERE username = ?', [hashBaru, userSession]);

        // Hapus session karena PIN telah berubah
        deleteCookie(event, 'user_session');

        return { status: 'success', pesan: 'PIN berhasil diubah. Silakan login kembali.' };
    } catch (e: any) {
        return { status: 'error', pesan: e.message };
    }
});
