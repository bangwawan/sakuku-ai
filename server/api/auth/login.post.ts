import { pool } from '~/server/utils/db';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, pin } = body;

    try {
        const hash = crypto.createHash('md5').update(pin.trim()).digest('hex');
        
        const [rows]: any = await pool.execute(
            'SELECT * FROM pengguna WHERE LOWER(username) = ? AND pin = ?',
            [username.trim().toLowerCase(), hash]
        );

        if (rows.length > 0) {
            const user = rows[0];
            if (user.is_active === 0 || user.is_active === false) {
                return { status: 'error', pesan: 'Akun Anda dinonaktifkan. Silakan hubungi Administrator.' };
            }
            const displayName = user.nama_lengkap || user.username;
            // Set session cookie valid selama 7 hari
            setCookie(event, 'user_session', user.username, { maxAge: 60 * 60 * 24 * 7 });
            setCookie(event, 'user_role', user.role, { maxAge: 60 * 60 * 24 * 7 });
            setCookie(event, 'user_fullname', displayName, { maxAge: 60 * 60 * 24 * 7 });
            return { status: 'success', username: user.username, role: user.role, fullname: displayName };
        }
        return { status: 'error', pesan: 'Nama Pengguna atau PIN salah!' };
    } catch (error: any) {
        return { status: 'error', pesan: error.toString() };
    }
});