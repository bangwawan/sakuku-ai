import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!body.apiKey) return { status: 'error', pesan: 'API Key tidak boleh kosong' };

    try {
        const [existing]: any = await pool.execute('SELECT kunci FROM pengaturan WHERE kunci = ?', ['gemini_api_key']);
        if (existing.length > 0) {
            await pool.execute('UPDATE pengaturan SET nilai = ? WHERE kunci = ?', [body.apiKey, 'gemini_api_key']);
        } else {
            await pool.execute('INSERT INTO pengaturan (kunci, nilai) VALUES (?, ?)', ['gemini_api_key', body.apiKey]);
        }
        return { status: 'success', pesan: 'API Key berhasil disimpan!' };
    } catch (e: any) {
        return { status: 'error', pesan: e.message };
    }
});
