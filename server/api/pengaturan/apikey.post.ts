import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!body.apiKey) return { status: 'error', pesan: 'API Key tidak boleh kosong' };

    try {
        await pool.execute(
            'INSERT INTO pengaturan (kunci, nilai) VALUES ("gemini_api_key", ?) ON DUPLICATE KEY UPDATE nilai = ?',
            [body.apiKey, body.apiKey]
        );
        return { status: 'success', pesan: 'API Key berhasil disimpan!' };
    } catch (e: any) {
        return { status: 'error', pesan: e.message };
    }
});
