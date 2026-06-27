<template>
  <div class="container-fluid py-3">
    <h4 class="mb-4 fw-bold">Laporan Transaksi</h4>
    
    <!-- Filter -->
    <div class="card card-custom p-3 mb-4 shadow-sm">
      <div class="row g-2">
        <div class="col-6 col-md-3">
          <label class="form-label small text-muted">Mulai Tanggal</label>
          <input type="date" v-model="filter.mulai" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label small text-muted">Sampai Tanggal</label>
          <input type="date" v-model="filter.sampai" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label small text-muted">Jenis</label>
          <select v-model="filter.jenis" class="form-select form-select-sm">
            <option value="Semua">Semua Jenis</option>
            <option value="Pemasukan">Pemasukan</option>
            <option value="Pengeluaran">Pengeluaran</option>
            <option value="Mutasi">Mutasi</option>
          </select>
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label small text-muted">Pengguna</label>
          <input type="text" v-model="filter.user" class="form-control form-control-sm" placeholder="Username (Opsional)">
        </div>
      </div>
      <div class="mt-3 text-end">
        <button class="btn btn-primary btn-sm" @click="loadData">Terapkan Filter</button>
      </div>
    </div>

    <!-- Ringkasan -->
    <div class="row mb-4">
      <div class="col-6">
        <div class="card card-custom p-3 bg-success text-white shadow-sm h-100">
          <small class="opacity-75">Total Pemasukan</small>
          <h4 class="mb-0 fw-bold mt-1">Rp {{ totalPemasukan.toLocaleString('id-ID') }}</h4>
        </div>
      </div>
      <div class="col-6">
        <div class="card card-custom p-3 bg-danger text-white shadow-sm h-100">
          <small class="opacity-75">Total Pengeluaran</small>
          <h4 class="mb-0 fw-bold mt-1">Rp {{ totalPengeluaran.toLocaleString('id-ID') }}</h4>
        </div>
      </div>
    </div>

    <!-- Tabel -->
    <div class="card card-custom p-0 shadow-sm overflow-hidden mb-5">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Tanggal</th>
              <th>Jenis</th>
              <th>Kategori/Kantong</th>
              <th>Nominal</th>
              <th>Pencatat</th>
              <th>Bukti</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="transaksi.length === 0">
              <td colspan="5" class="text-center text-muted py-4">Tidak ada data ditemukan.</td>
            </tr>
            <tr v-for="t in transaksi" :key="t.id">
              <td><small>{{ new Date(t.tanggal).toLocaleDateString('id-ID') }}</small></td>
              <td>
                <span :class="'badge ' + (t.jenis === 'Pemasukan' ? 'bg-success' : (t.jenis === 'Pengeluaran' ? 'bg-danger' : 'bg-warning'))">
                  {{ t.jenis }}
                </span>
              </td>
              <td>{{ t.kategori_nama || t.kantong_tujuan || 'Mutasi' }}</td>
              <td class="fw-bold">Rp {{ t.nominal.toLocaleString('id-ID') }}</td>
              <td><small class="text-muted">{{ t.oleh }}</small></td>
              <td>
                <button v-if="t.link_bukti" @click="showBukti(t.link_bukti)" class="badge bg-info text-white border-0">Lihat Bukti</button>
                <span v-else class="text-muted small">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const filter = ref({
  mulai: '',
  sampai: '',
  jenis: 'Semua',
  user: ''
})

const transaksi = ref([])
const totalPemasukan = ref(0)
const totalPengeluaran = ref(0)

const loadData = async () => {
  const query = new URLSearchParams()
  if (filter.value.mulai) query.append('mulai', filter.value.mulai)
  if (filter.value.sampai) query.append('sampai', filter.value.sampai)
  if (filter.value.jenis && filter.value.jenis !== 'Semua') query.append('jenis', filter.value.jenis)
  if (filter.value.user) query.append('user', filter.value.user)

  const res = await $fetch(`/api/laporan?${query.toString()}`)
  if (!res.error) {
    transaksi.value = res.transaksi
    totalPemasukan.value = res.totalPemasukan
    totalPengeluaran.value = res.totalPengeluaran
  }
}

const showBukti = (url) => {
  import('sweetalert2').then(SwalModule => {
    const Swal = SwalModule.default;
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
  });
}

onMounted(() => {
  // Set default mulai (awal bulan) dan sampai (hari ini)
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  
  filter.value.mulai = firstDay.toISOString().split('T')[0]
  filter.value.sampai = today.toISOString().split('T')[0]
  
  loadData()
})
</script>
