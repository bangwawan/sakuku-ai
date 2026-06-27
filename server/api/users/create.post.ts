import { pool } from '~/server/utils/db';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
    const role = getCookie(event, 'user_role');
    if (role !== 'administrator') return { status: 'error', pesan: 'Akses ditolak' };

    const body = await readBody(event);
    if (!body.username || !body.pin) return { status: 'error', pesan: 'Data tidak lengkap' };

    try {
        const hash = crypto.createHash('md5').update(body.pin).digest('hex');
        await pool.execute(
            'INSERT INTO pengguna (username, pin, role, nama_lengkap, no_wa, email, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [body.username.toLowerCase(), hash, 'pencatat', body.nama_lengkap || null, body.no_wa || null, body.email || null, true]
        );
        return { status: 'success', pesan: 'Pengguna berhasil ditambahkan' };
    } catch (e: any) {
        if (e.code === 'ER_DUP_ENTRY') return { status: 'error', pesan: 'Username sudah digunakan' };
        return { status: 'error', pesan: e.message };
    }
});
