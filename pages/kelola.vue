<template>
  <div class="container py-3">
    <h4 class="mb-4 fw-bold">Pengaturan Kategori & Kantong</h4>
    
    <div class="card card-custom p-3 shadow-sm">
      <h6 class="text-primary fw-bold mb-3">👛 Manajemen Kantong Uang</h6>
      <div class="input-group mb-3">
        <input type="text" v-model="newKantong" class="form-control" placeholder="Nama kantong baru...">
        <button class="btn btn-primary" @click="submitKantong">Tambah</button>
      </div>
      <div class="list-group list-group-flush">
        <div v-for="k in refDetail.kantongDetail" :key="k.nama" class="list-group-item px-0 d-flex justify-content-between align-items-center">
          <span :class="k.is_active ? '' : 'text-muted text-decoration-line-through'">👛 {{ k.nama }} <small v-if="k.isUsed" class="text-muted">🔒</small></span>
          <div>
            <span v-if="k.is_active" class="badge bg-success me-2">Aktif</span>
            <span v-else class="badge bg-secondary me-2">Non-aktif</span>
            <button class="btn btn-sm py-0 px-2 me-1" :class="k.is_active ? 'btn-outline-warning' : 'btn-outline-success'" @click="toggleKantongStatus(k.nama, k.is_active)" title="Ubah Status">{{ k.is_active ? '🚫' : '👁️' }}</button>
            <button class="btn btn-sm btn-outline-secondary py-0 px-2 me-1" :disabled="k.isUsed" @click="ubahKantongHandler(k.nama)">✏️</button>
            <button class="btn btn-sm btn-outline-danger py-0 px-2" :disabled="k.isUsed" @click="hapusKantongHandler(k.nama)">🗑️</button>
          </div>
        </div>
      </div>
    </div>


    <div class="card card-custom p-3 shadow-sm mt-3">
      <h6 class="text-success fw-bold mb-3">🏷️ Manajemen Kategori</h6>
      <div class="row g-2 mb-3">
        <div class="col-4">
          <select v-model="newKatJenis" class="form-select">
            <option value="Pemasukan">Masuk</option>
            <option value="Pengeluaran">Keluar</option>
          </select>
        </div>
        <div class="col-8">
          <div class="input-group">
            <input type="text" v-model="newKatNama" class="form-control" placeholder="Kategori baru...">
            <button class="btn btn-success" @click="submitKategori">Tambah</button>
          </div>
        </div>
      </div>
      <div class="list-group list-group-flush">
        <div v-for="c in refDetail.kategoriDetail" :key="c.nama" class="list-group-item px-0 d-flex justify-content-between align-items-center">
          <span :class="c.is_active ? '' : 'text-muted text-decoration-line-through'">
            <span :class="'badge me-1 ' + (c.jenis === 'Pemasukan' ? (c.is_active ? 'bg-success' : 'bg-secondary') : (c.is_active ? 'bg-danger' : 'bg-secondary'))">
              {{ c.jenis === 'Pemasukan' ? 'Masuk' : 'Keluar' }}
            </span>
            {{ c.nama }} <small v-if="c.isUsed" class="text-muted">🔒</small>
          </span>
          <div>
            <span v-if="c.is_active" class="badge bg-success me-2">Aktif</span>
            <span v-else class="badge bg-secondary me-2">Non-aktif</span>
            <button class="btn btn-sm py-0 px-2 me-1" :class="c.is_active ? 'btn-outline-warning' : 'btn-outline-success'" @click="toggleKategoriStatus(c.nama, c.is_active)" title="Ubah Status">{{ c.is_active ? '🚫' : '👁️' }}</button>
            <button class="btn btn-sm btn-outline-secondary py-0 px-2 me-1" :disabled="c.isUsed" @click="ubahKategoriHandler(c.nama, c.jenis)">✏️</button>
            <button class="btn btn-sm btn-outline-danger py-0 px-2" :disabled="c.isUsed" @click="hapusKategoriHandler(c.nama)">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- API Key Config -->
    <div class="card card-custom p-3 shadow-sm mt-3">
      <h6 class="text-info fw-bold mb-3">🤖 Konfigurasi AI Insight</h6>
      <div class="input-group mb-3">
        <input :type="showKey ? 'text' : 'password'" v-model="geminiKey" class="form-control" placeholder="Masukkan Gemini API Key...">
        <button class="btn btn-outline-secondary" @click="showKey = !showKey">
          {{ showKey ? 'Sembunyikan' : 'Tampilkan' }}
        </button>
        <button class="btn btn-info text-white" @click="saveApiKey">Simpan API Key</button>
      </div>
      <small class="text-muted">API Key diperlukan agar fitur ✨ AI Insight dapat berjalan.</small>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

const refDetail = ref({ kategoriDetail: [], kantongDetail: [] })
const newKantong = ref('')
const newKatJenis = ref('Pengeluaran')
const newKatNama = ref('')

const geminiKey = ref('')
const showKey = ref(false)

const loadRefDetail = async () => {
  refDetail.value = await $fetch('/api/referensi')
}

const loadApiKey = async () => {
  const res = await $fetch('/api/pengaturan/apikey')
  if (res.apiKey) geminiKey.value = res.apiKey
}

const saveApiKey = async () => {
  if (!geminiKey.value.trim()) {
    Swal.fire({ title: 'Gagal', text: 'API Key tidak boleh kosong', icon: 'error' })
    return
  }
  const res = await $fetch('/api/pengaturan/apikey', { method: 'POST', body: { apiKey: geminiKey.value.trim() } })
  Swal.fire({ title: 'Info', text: res.pesan, icon: res.status === 'success' ? 'success' : 'error' })
}

// Handler Kantong
const submitKantong = async () => {
  if (!newKantong.value.trim()) return
  const res = await $fetch('/api/kantong', { method: 'POST', body: { nama: newKantong.value.trim() } })
  Swal.fire({ title: 'Info', text: res.pesan, icon: res.status === 'success' ? 'success' : 'error' })
  if (res.status === 'success') { newKantong.value = ''; loadRefDetail(); }
}

const ubahKantongHandler = async (oldName) => {
  const { value: n } = await Swal.fire({
    title: `Ubah nama kantong`,
    input: 'text',
    inputLabel: `Ubah nama kantong '${oldName}' menjadi:`,
    inputValue: oldName,
    showCancelButton: true
  })
  if (n && n.trim() !== oldName) {
    const res = await $fetch('/api/kantong', { method: 'PUT', body: { namaLama: oldName, namaBaru: n.trim() } })
    Swal.fire({ title: 'Info', text: res.pesan, icon: res.status === 'success' ? 'success' : 'error' })
    loadRefDetail();
  }
}

const hapusKantongHandler = async (name) => {
  const { isConfirmed } = await Swal.fire({
    title: 'Konfirmasi',
    text: `Hapus kantong '${name}'?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus'
  })
  if (isConfirmed) {
    const res = await $fetch('/api/kantong', { method: 'DELETE', body: { nama: name } })
    Swal.fire({ title: 'Info', text: res.pesan, icon: res.status === 'success' ? 'success' : 'error' })
    loadRefDetail();
  }
}

const toggleKantongStatus = async (nama, currentStatus) => {
  const newStatus = currentStatus ? 0 : 1;
  const res = await $fetch('/api/kantong/status', { method: 'PUT', body: { nama, is_active: newStatus } })
  if (res.status === 'success') loadRefDetail();
  else Swal.fire({ title: 'Gagal', text: res.pesan, icon: 'error' })
}

// Handler Kategori
const submitKategori = async () => {
  if (!newKatNama.value.trim()) return
  const res = await $fetch('/api/kategori', { method: 'POST', body: { jenis: newKatJenis.value, nama: newKatNama.value.trim() } })
  Swal.fire({ title: 'Info', text: res.pesan, icon: res.status === 'success' ? 'success' : 'error' })
  if (res.status === 'success') { newKatNama.value = ''; loadRefDetail(); }
}

const ubahKategoriHandler = async (oldName, currentJenis) => {
  const { value: n } = await Swal.fire({
    title: `Ubah nama kategori '${oldName}':`,
    input: 'text',
    inputValue: oldName,
    showCancelButton: true
  })
  if (!n || n.trim() === oldName) return
  
  const { isConfirmed: keepJenis } = await Swal.fire({
    title: 'Jenis Kategori',
    text: `Apakah jenis kategori tetap '${currentJenis}'?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Tetap',
    cancelButtonText: 'Tidak, Ubah'
  })
  const j = keepJenis ? currentJenis : (currentJenis === 'Pemasukan' ? 'Pengeluaran' : 'Pemasukan')
  
  const res = await $fetch('/api/kategori', { method: 'PUT', body: { namaLama: oldName, jenisBaru: j, namaBaru: n.trim() } })
  Swal.fire({ title: 'Info', text: res.pesan, icon: res.status === 'success' ? 'success' : 'error' })
  loadRefDetail();
}

const hapusKategoriHandler = async (name) => {
  const { isConfirmed } = await Swal.fire({
    title: 'Konfirmasi',
    text: `Hapus kategori '${name}'?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus'
  })
  if (isConfirmed) {
    const res = await $fetch('/api/kategori', { method: 'DELETE', body: { nama: name } })
    Swal.fire({ title: 'Info', text: res.pesan, icon: res.status === 'success' ? 'success' : 'error' })
    loadRefDetail();
  }
}

const toggleKategoriStatus = async (nama, currentStatus) => {
  const newStatus = currentStatus ? 0 : 1;
  const res = await $fetch('/api/kategori/status', { method: 'PUT', body: { nama, is_active: newStatus } })
  if (res.status === 'success') loadRefDetail();
  else Swal.fire({ title: 'Gagal', text: res.pesan, icon: 'error' })
}

onMounted(() => {
  loadRefDetail()
  loadApiKey()
})
</script>