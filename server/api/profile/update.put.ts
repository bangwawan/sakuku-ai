import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
    const username = getCookie(event, 'user_session');
    if (!username) return { status: 'error', pesan: 'Sesi tidak valid' };

    const body = await readBody(event);
    
    try {
        await pool.execute(
            'UPDATE pengguna SET nama_lengkap = ?, no_wa = ?, email = ?, foto = ? WHERE username = ?', 
            [body.nama_lengkap || null, body.no_wa || null, body.email || null, body.foto || null, username]
        );
        return { status: 'success', pesan: 'Profil berhasil diperbarui' };
    } catch (e: any) {
        return { status: 'error', pesan: e.message };
    }
});
