import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
    const role = getCookie(event, 'user_role');
    if (role !== 'administrator') return { status: 'error', pesan: 'Akses ditolak' };

    try {
        const [rows]: any = await pool.execute(`
            SELECT u.username, u.role, u.nama_lengkap, u.no_wa, u.email, u.is_active, 
                   (SELECT COUNT(id) FROM transaksi WHERE oleh = u.username LIMIT 1) as has_transaction 
            FROM pengguna u 
            ORDER BY u.role ASC, u.username ASC
        `);
        return { status: 'success', data: rows };
    } catch (e: any) {
        return { status: 'error', pesan: e.message };
    }
});
