import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
    try {
        const query = `
            SELECT jenis, kategori_nama, catatan, COUNT(*) as freq 
            FROM transaksi 
            WHERE catatan IS NOT NULL 
              AND catatan != '' 
              AND jenis != 'Mutasi' 
            GROUP BY jenis, kategori_nama, catatan 
            ORDER BY freq DESC 
            LIMIT 5
        `;
        const [rows]: any = await pool.execute(query);
        return { status: 'success', data: rows };
    } catch (e: any) {
        return { status: 'error', pesan: e.message };
    }
});
