import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    let sql = 'SELECT * FROM transaksi WHERE 1=1';
    let params: any[] = [];

    if (query.jenis && query.jenis !== 'Semua') {
        sql += ' AND jenis = ?';
        params.push(query.jenis);
    }
    
    if (query.user) {
        sql += ' AND oleh = ?';
        params.push(query.user);
    }

    if (query.mulai) {
        sql += ' AND tanggal >= ?';
        params.push(query.mulai);
    }
    
    if (query.sampai) {
        sql += ' AND tanggal <= ?';
        params.push(query.sampai);
    }

    sql += ' ORDER BY tanggal DESC, id DESC';

    try {
        const [rows]: any = await pool.execute(sql, params);
        
        let totalPemasukan = 0;
        let totalPengeluaran = 0;

        for (const row of rows) {
            const numNominal = parseFloat(row.nominal);
            row.nominal = numNominal; // Update row so Vue receives a number instead of a string
            if (row.jenis === 'Pemasukan') totalPemasukan += numNominal;
            else if (row.jenis === 'Pengeluaran') totalPengeluaran += numNominal;
        }

        return { transaksi: rows, totalPemasukan, totalPengeluaran };
    } catch (e: any) {
        return { error: e.message };
    }
});
