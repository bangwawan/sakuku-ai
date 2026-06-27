import { pool } from '~/server/utils/db';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
    const role = getCookie(event, 'user_role');
    if (role !== 'administrator') return { status: 'error', pesan: 'Akses ditolak' };

    const body = await readBody(event);
    if (!body.username) return { status: 'error', pesan: 'Username diperlukan' };

    try {
        // Cek apakah user pernah mencatat transaksi
        const [tx]: any = await pool.execute('SELECT id FROM transaksi WHERE oleh = ? LIMIT 1', [body.username]);
        const hasTransactions = tx.length > 0;
        
        let finalNama = body.nama_lengkap || null;
        if (hasTransactions) {
            // Fetch existing nama_lengkap to preserve it
            const [existingUser]: any = await pool.execute('SELECT nama_lengkap FROM pengguna WHERE username = ? AND role = "pencatat"', [body.username]);
            if (existingUser.length > 0) {
                finalNama = existingUser[0].nama_lengkap;
            }
        }

        if (body.pin) {
            const hash = crypto.createHash('md5').update(body.pin).digest('hex');
            await pool.execute(
                'UPDATE pengguna SET nama_lengkap = ?, no_wa = ?, email = ?, is_active = ?, pin = ? WHERE username = ? AND role = "pencatat"', 
                [finalNama, body.no_wa || null, body.email || null, body.is_active ? true : false, hash, body.username]
            );
        } else {
            await pool.execute(
                'UPDATE pengguna SET nama_lengkap = ?, no_wa = ?, email = ?, is_active = ? WHERE username = ? AND role = "pencatat"', 
                [finalNama, body.no_wa || null, body.email || null, body.is_active ? true : false, body.username]
            );
        }
        
        return { status: 'success', pesan: 'Pengguna berhasil diperbarui' };
    } catch (e: any) {
        return { status: 'error', pesan: e.message };
    }
});
