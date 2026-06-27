import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
    const role = getCookie(event, 'user_role');
    if (role !== 'administrator') return { status: 'error', pesan: 'Akses ditolak' };

    const body = await readBody(event);
    if (!body.username) return { status: 'error', pesan: 'Username diperlukan' };

    try {
        // Cek apakah user pernah mencatat transaksi
        const [tx]: any = await pool.execute('SELECT id FROM transaksi WHERE oleh = ? LIMIT 1', [body.username]);
        if (tx.length > 0) {
            return { status: 'error', pesan: 'Pengguna tidak dapat dihapus karena memiliki riwayat transaksi' };
        }

        await pool.execute("DELETE FROM pengguna WHERE username = ? AND role = 'pencatat'", [body.username]);
        return { status: 'success', pesan: 'Pengguna berhasil dihapus' };
    } catch (e: any) {
        return { status: 'error', pesan: e.message };
    }
});
