<template>
  <div class="container-fluid py-3">
    <!-- Kartu Saldo Utama -->
    <div class="saldo-card">
      <p class="mb-1 text-light opacity-75">Total Saldo Tersedia</p>
      <h2 class="display-5 fw-bold mb-4">Rp {{ dbData.ringkasan.saldoTotal.toLocaleString('id-ID') }}</h2>
      
      <div class="saldo-split">
        <div class="masuk">
          <small class="d-block mb-1">Pemasukan Bulan Ini</small>
          <strong>+ Rp {{ dbData.ringkasan.pemasukan.toLocaleString('id-ID') }}</strong>
        </div>
        <div class="keluar">
          <small class="d-block mb-1">Pengeluaran Bulan Ini</small>
          <strong>- Rp {{ dbData.ringkasan.pengeluaran.toLocaleString('id-ID') }}</strong>
        </div>
      </div>
    </div>

    <!-- AI Insight -->
    <div class="card card-custom p-3 mt-4 border-start border-primary border-5" style="background: linear-gradient(to right, #f8f9fa, #ffffff);">
      <div class="d-flex align-items-center mb-2 justify-content-between">
        <div class="d-flex align-items-center">
          <span class="icon-box me-2">✨</span>
          <h6 class="text-primary fw-bold mb-0">AI Insight</h6>
        </div>
        <button class="btn btn-sm btn-outline-primary" @click="refreshInsight" :disabled="isRefreshing">
          <span v-if="isRefreshing" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>🔄</span>
        </button>
      </div>
      <p class="mb-0 text-muted small lh-lg">{{ aiInsight }}</p>
    </div>

    <!-- Kantong Keuangan -->
    <div class="card card-custom p-4 mt-3">
      <div class="d-flex align-items-center mb-4">
        <span class="icon-box me-2" style="background: rgba(255, 193, 7, 0.1); color: #ffc107;">👛</span>
        <h6 class="fw-bold mb-0">Kantong Keuangan</h6>
      </div>
      <div class="row g-2">
        <div v-if="!dbData.saldoKantong || Object.keys(dbData.saldoKantong).length === 0" class="text-muted small">Belum ada kantong terdaftar.</div>
        <div v-for="(saldo, nama) in dbData.saldoKantong" :key="nama" class="col-6">
          <div class="p-3 border rounded shadow-sm" style="background: #f8f9fa;">
            <small class="text-muted d-block mb-1">{{ nama }}</small>
            <strong class="text-dark">Rp {{ saldo.toLocaleString('id-ID') }}</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Pengeluaran -->
    <div class="card card-custom p-4 mt-3">
      <div class="d-flex align-items-center mb-4">
        <span class="icon-box me-2" style="background: rgba(255, 99, 132, 0.1); color: #ff6384;">📊</span>
        <h6 class="fw-bold mb-0">Komposisi Pengeluaran</h6>
      </div>
      <div style="position: relative; height: 220px; width: 100%; display: flex; justify-content: center;">
        <canvas id="chartPengeluaran"></canvas>
      </div>
    </div>

    <!-- Histori Transaksi -->
    <div class="card card-custom p-4 mt-3 mb-5">
      <div class="d-flex align-items-center mb-3">
        <span class="icon-box me-2" style="background: rgba(75, 192, 192, 0.1); color: #4bc0c0;">📝</span>
        <h6 class="fw-bold mb-0">Transaksi Terakhir</h6>
      </div>
      
      <div class="list-group list-group-flush">
        <div v-if="dbData.histori.length === 0" class="text-center text-muted py-4 small">
          Belum ada transaksi bulan ini.
        </div>
        <div v-for="h in dbData.histori" :key="h.id" class="list-group-item px-0 py-3 border-bottom d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <div class="me-3 fs-3" style="width: 40px; text-align: center;">
              {{ h.jenis === 'Pemasukan' ? '📈' : (h.jenis === 'Pengeluaran' ? '📉' : '🔄') }}
            </div>
            <div>
              <div class="fw-bold text-dark">{{ h.kategori_nama || 'Mutasi' }}</div>
              <small class="text-muted">{{ h.tanggal }} • {{ h.detail }}</small>
            </div>
          </div>
          <div class="text-end">
            <div :class="['fw-bold mb-1', h.jenis === 'Pemasukan' ? 'text-success' : 'text-danger']">
              {{ h.jenis === 'Pemasukan' ? '+' : '-' }} Rp {{ h.nominal.toLocaleString('id-ID') }}
            </div>
            <button v-if="h.link_bukti" @click="showBukti(h.link_bukti)" class="badge bg-info text-white border-0">📄 Bukti</button>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-3">
        <NuxtLink to="/laporan" class="btn btn-outline-primary btn-sm w-100 rounded-pill">
          Lihat Seluruh Transaksi ➔
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

const dbData = ref({ 
  ringkasan: { pemasukan: 0, pengeluaran: 0, saldoTotal: 0 }, 
  histori: [], 
  saldoKantong: {},
  chartData: { labels: [], datasets: [] } 
})
const aiInsight = ref('Klik 🔄 untuk memuat AI Insight.')
const isRefreshing = ref(false)

const loadData = async () => {
  const res = await $fetch('/api/transaksi')
  if (!res.error) dbData.value = res
}

const showBukti = (url) => {
  const isImage = url.startsWith('data:image/') || /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
  if (isImage) {
    Swal.fire({
      imageUrl: url,
      imageAlt: 'Bukti Transaksi',
      width: 600,
      showConfirmButton: false,
      showCloseButton: true
    });
  } else {
    Swal.fire({
      html: `<iframe src="${url}" style="width:100%; height:600px;" frameborder="0"></iframe>`,
      width: 800,
      showConfirmButton: false,
      showCloseButton: true
    });
  }
}

const refreshInsight = async () => {
  isRefreshing.value = true
  aiInsight.value = 'Menganalisis data...'
  try {
    const resAi = await $fetch('/api/insight')
    aiInsight.value = resAi.insight
  } catch(e) {
    aiInsight.value = 'Gagal memuat insight.'
  } finally {
    isRefreshing.value = false
  }
}

onMounted(async () => {
  // Ambil data transaksi
  dbData.value = await $fetch('/api/transaksi')
  
  // Render Chart setelah data ada
  if (process.client && dbData.value.chartData.labels.length > 0) {
    const Chart = window.Chart;
    new Chart(document.getElementById('chartPengeluaran'), {
      type: 'doughnut',
      data: {
        labels: dbData.value.chartData.labels,
        datasets: [{ data: dbData.value.chartData.datasets, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }]
      }
    })
  }
})
</script>