import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
    const [dataKategori]: any = await pool.execute('SELECT jenis, nama, is_active FROM kategori');
    const [dataKantong]: any = await pool.execute('SELECT nama, is_active FROM kantong');
    const [dataTransaksi]: any = await pool.execute('SELECT kategori_nama, kantong_asal, kantong_tujuan FROM transaksi');

    const usedKategori = new Set();
    const usedKantong = new Set();

    dataTransaksi.forEach((row: any) => {
        if (row.kategori_nama) usedKategori.add(row.kategori_nama.trim());
        if (row.kantong_asal) usedKantong.add(row.kantong_asal.trim());
        if (row.kantong_tujuan) usedKantong.add(row.kantong_tujuan.trim());
    });

    return {
        kategori: dataKategori.filter((r: any) => r.is_active === 1).map((r: any) => [r.jenis, r.nama]),
        kantong: dataKantong.filter((k: any) => k.is_active === 1).map((k: any) => k.nama),
        kategoriDetail: dataKategori.map((r: any) => ({ jenis: r.jenis, nama: r.nama, is_active: r.is_active === 1, isUsed: usedKategori.has(r.nama.trim()) })),
        kantongDetail: dataKantong.map((k: any) => ({ nama: k.nama, is_active: k.is_active === 1, isUsed: usedKantong.has(k.nama.trim()) }))
    };
});