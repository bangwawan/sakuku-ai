import { GoogleGenerativeAI } from '@google/generative-ai';
import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
    let apiKey = '';
    try {
        const [rows]: any = await pool.execute("SELECT nilai FROM pengaturan WHERE kunci = 'gemini_api_key'");
        if (rows.length > 0 && rows[0].nilai) apiKey = rows[0].nilai.trim();
    } catch(e) {}
    
    if (!apiKey) {
        return { insight: '💡 Silakan masukkan Gemini API Key di halaman Kelola untuk mengaktifkan fitur AI Insight.' };
    }

    // Panggil endpoint transaksi internal secara server-side
    const data: any = await $fetch('/api/transaksi');
    const ringkasan = data.ringkasan;

    let kategoriTerbesar = '-'; let maxNominal = 0;
    if (data.chartData && data.chartData.labels.length > 0) {
        for (let i = 0; i < data.chartData.labels.length; i++) {
            if (data.chartData.datasets[i] > maxNominal) { maxNominal = data.chartData.datasets[i]; kategoriTerbesar = data.chartData.labels[i]; }
        }
    }

    const prompt = `[ID: ${new Date().getTime()}] Berikan analisis keuangan 2 kalimat bergaya santai berdasar data bulan ini: Saldo Rp${ringkasan.saldoTotal}, Masuk Rp${ringkasan.pemasukan}, Keluar Rp${ringkasan.pengeluaran}. Pengeluaran terbesar di '${kategoriTerbesar}' sejumlah Rp${maxNominal}.`;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        return { insight: result.response.text().replace(/\*\*/g, '') };
    } catch (e: any) {
        return { insight: '⚠️ Error AI: ' + e.message };
    }
});