import { pool } from '~/server/utils/db';

export default defineEventHandler(async () => {
    try {
        const [rows]: any = await pool.execute("SELECT nilai FROM pengaturan WHERE kunci = 'gemini_api_key'");
        if (rows.length > 0) {
            return { apiKey: rows[0].nilai };
        }
        return { apiKey: '' };
    } catch (e: any) {
        return { error: e.message };
    }
});
