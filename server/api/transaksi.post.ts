import { pool } from '~/server/utils/db';
import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const userSession = getCookie(event, 'user_session') || 'Anonim';

    try {
        const uuid = 'TRX-' + new Date().getTime();
        let kantongAsal = body.kantongAsal || null;
        let kantongTujuan = body.kantongTujuan || null;
        let kategoriNama = body.kategori || null;
        let linkBukti = null;

        if (body.jenis === 'Pemasukan') kantongAsal = null;
        if (body.jenis === 'Pengeluaran') kantongTujuan = null;
        if (body.jenis === 'Mutasi') kategoriNama = null;

        // Cek saldo untuk Pengeluaran dan Mutasi
        if (body.jenis === 'Pengeluaran' || body.jenis === 'Mutasi') {
            const nominalTransaksi = parseFloat(body.nominal);
            
            const [inRows]: any = await pool.execute(
                'SELECT SUM(nominal) as totalIn FROM transaksi WHERE kantong_tujuan = ?', 
                [kantongAsal]
            );
            
            const [outRows]: any = await pool.execute(
                'SELECT SUM(nominal) as totalOut FROM transaksi WHERE kantong_asal = ?', 
                [kantongAsal]
            );

            const totalIn = inRows[0].totalIn ? parseFloat(inRows[0].totalIn) : 0;
            const totalOut = outRows[0].totalOut ? parseFloat(outRows[0].totalOut) : 0;
            const currentSaldo = totalIn - totalOut;

            if (currentSaldo < nominalTransaksi) {
                return { 
                    status: 'error', 
                    pesan: `Saldo di kantong ${kantongAsal} tidak mencukupi! Sisa saldo: Rp ${currentSaldo.toLocaleString('id-ID')}` 
                };
            }
        }

        // Simpan file bukti sebagai Base64 String untuk kompatibilitas Vercel
        if (body.jenis === 'Pengeluaran' && body.fileData) {
            linkBukti = `data:${body.fileData.mimeType};base64,${body.fileData.base64}`;
        }

        await pool.execute(
            'INSERT INTO transaksi (uuid, tanggal, jenis, kategori_nama, nominal, kantong_asal, kantong_tujuan, catatan, oleh, link_bukti) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [uuid, body.tanggal, body.jenis, kategoriNama, body.nominal, kantongAsal, kantongTujuan, body.catatan, userSession, linkBukti]
        );

        return { status: 'success', pesan: 'Data berhasil disimpan!' };
    } catch (error: any) {
        return { status: 'error', pesan: error.toString() };
    }
});