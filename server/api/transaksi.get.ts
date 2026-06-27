import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
    const [kantongRows]: any = await pool.execute('SELECT nama, is_active FROM kantong');
    let saldoPerKantong: any = {};
    kantongRows.forEach((k: any) => saldoPerKantong[k.nama] = { saldo: 0, is_active: k.is_active });

    const [txRows]: any = await pool.execute('SELECT * FROM transaksi ORDER BY tanggal ASC, id ASC');

    const sekarang = new Date();
    const bulanIni = sekarang.getMonth();
    const tahunIni = sekarang.getFullYear();

    let totalPemasukanBulanIni = 0; let totalPengeluaranBulanIni = 0; let kategoriPengeluaran: any = {};

    txRows.forEach((row: any) => {
        const tgl = new Date(row.tanggal); const nominal = parseFloat(row.nominal);
        if (row.jenis === 'Pemasukan') { if (saldoPerKantong[row.kantong_tujuan] !== undefined) saldoPerKantong[row.kantong_tujuan].saldo += nominal; }
        else if (row.jenis === 'Pengeluaran') { if (saldoPerKantong[row.kantong_asal] !== undefined) saldoPerKantong[row.kantong_asal].saldo -= nominal; }
        else if (row.jenis === 'Mutasi') {
            if (saldoPerKantong[row.kantong_asal] !== undefined) saldoPerKantong[row.kantong_asal].saldo -= nominal;
            if (saldoPerKantong[row.kantong_tujuan] !== undefined) saldoPerKantong[row.kantong_tujuan].saldo += nominal;
        }

        if (tgl.getMonth() === bulanIni && tgl.getFullYear() === tahunIni) {
            if (row.jenis === 'Pemasukan') totalPemasukanBulanIni += nominal;
            if (row.jenis === 'Pengeluaran') { totalPengeluaranBulanIni += nominal; kategoriPengeluaran[row.kategori_nama] = (kategoriPengeluaran[row.kategori_nama] || 0) + nominal; }
        }
    });

    const totalSaldoAllTime = Object.values(saldoPerKantong).reduce((a: any, b: any) => a + b.saldo, 0);
    const historiTerakhir = [...txRows].reverse().slice(0, 10).map((row: any) => {
        const d = new Date(row.tanggal);
        return {
            id: row.id, tanggal: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`,
            jenis: row.jenis, kategori_nama: row.kategori_nama, nominal: parseFloat(row.nominal), oleh: row.oleh, link_bukti: row.link_bukti,
            detail: row.jenis === 'Mutasi' ? `${row.kantong_asal} ➔ ${row.kantong_tujuan}` : (row.jenis === 'Pemasukan' ? `Ke: ${row.kantong_tujuan}` : `Dari: ${row.kantong_asal}`)
        };
    });

    const saldoKantongActive: any = {};
    Object.keys(saldoPerKantong).forEach(k => {
        if (saldoPerKantong[k].is_active === 1 || saldoPerKantong[k].is_active === true) saldoKantongActive[k] = saldoPerKantong[k].saldo;
    });

    return {
        ringkasan: { pemasukan: totalPemasukanBulanIni, pengeluaran: totalPengeluaranBulanIni, saldoTotal: totalSaldoAllTime },
        saldoKantong: saldoKantongActive, chartData: { labels: Object.keys(kategoriPengeluaran), datasets: Object.values(kategoriPengeluaran) },
        histori: historiTerakhir
    };
});