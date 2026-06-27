<template>
  <div class="card card-custom p-4 shadow-sm mb-5">
    <h4 class="mb-4 fw-bold">Catat Transaksi</h4>
    
    <!-- Quick Inputs Section -->
    <div v-if="quickInputs.length > 0" class="mb-4 p-3 rounded" style="background-color: #f8f9fa; border-left: 4px solid #ffc107;">
      <label class="form-label text-muted small fw-bold mb-2">⚡ Saran Input Cepat</label>
      <div class="d-flex flex-wrap gap-2">
        <span v-for="(qi, idx) in quickInputs" :key="idx" 
              class="badge rounded-pill border py-2 px-3 shadow-sm" 
              :class="qi.jenis === 'Pemasukan' ? 'bg-success-subtle text-success border-success' : 'bg-danger-subtle text-danger border-danger'" 
              style="cursor: pointer; transition: all 0.2s;"
              @click="applyQuickInput(qi)">
          {{ qi.catatan }} <small class="opacity-75">({{ qi.kategori_nama }})</small>
        </span>
      </div>
    </div>

    <form @submit.prevent="handleFormSubmit">
      <div class="mb-3"><label class="form-label">Tanggal</label><input type="date" v-model="form.tanggal" class="form-control" required></div>
      <div class="mb-3">
        <label class="form-label">Jenis</label>
        <select v-model="form.jenis" @change="aturForm" class="form-select" required>
          <option value="">-- Pilih --</option><option value="Pemasukan">Pemasukan</option>
          <option value="Pengeluaran">Pengeluaran</option><option value="Mutasi">Mutasi (Pindah Kantong)</option>
        </select>
      </div>

      <div class="row mb-3" v-if="form.jenis">
        <div v-if="form.jenis === 'Pengeluaran'" class="col-12">
          <label class="form-label text-danger fw-bold">Sumber Dana</label>
          <select v-model="form.kantongAsal" class="form-select" required><option value="" disabled>-- Pilih --</option><option v-for="k in refData.kantong" :key="k" :value="k">{{ k }}</option></select>
        </div>
        <div v-if="form.jenis === 'Pemasukan'" class="col-12">
          <label class="form-label text-success fw-bold">Simpan Ke</label>
          <select v-model="form.kantongTujuan" class="form-select" required><option value="" disabled>-- Pilih --</option><option v-for="k in refData.kantong" :key="k" :value="k">{{ k }}</option></select>
        </div>
        
        <!-- Mutasi 2 kolom -->
        <template v-if="form.jenis === 'Mutasi'">
          <div class="col-6">
            <label class="form-label text-danger fw-bold">Sumber Dana</label>
            <select v-model="form.kantongAsal" class="form-select" required><option value="" disabled>-- Pilih --</option><option v-for="k in refData.kantong" :key="k" :value="k">{{ k }}</option></select>
          </div>
          <div class="col-6">
            <label class="form-label text-success fw-bold">Simpan Ke</label>
            <select v-model="form.kantongTujuan" class="form-select" required><option value="" disabled>-- Pilih --</option><option v-for="k in refData.kantong" :key="k" :value="k">{{ k }}</option></select>
          </div>
        </template>
      </div>

      <div v-if="form.jenis && form.jenis !== 'Mutasi'" class="mb-3">
        <label class="form-label">Kategori</label>
        <select v-model="form.kategori" class="form-select" required>
          <option value="" disabled>-- Pilih Kategori --</option>
          <option v-for="cat in filteredKategori" :key="cat[1]" :value="cat[1]">{{ cat[1] }}</option>
        </select>
      </div>

      <div class="mb-3"><label class="form-label">Nominal (Rp)</label><input type="number" v-model="form.nominal" class="form-control" required min="1"></div>
      
      <div v-if="form.jenis === 'Pengeluaran' || form.jenis === 'Pemasukan'" class="mb-3">
        <label class="form-label" :class="form.jenis === 'Pengeluaran' ? 'text-danger fw-bold' : ''">
          Upload Bukti (Gambar/PDF) <span v-if="form.jenis === 'Pemasukan'" class="text-muted fw-normal">(Opsional)</span>
        </label>
        <input type="file" @change="handleFile" class="form-control" accept="image/*, application/pdf" :required="form.jenis === 'Pengeluaran'">
      </div>

      <div class="mb-3"><label class="form-label">Catatan</label><input type="text" v-model="form.catatan" class="form-control"></div>
      <button type="submit" class="btn btn-primary w-100">Simpan</button>
    </form>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

const refData = ref({ kategori: [], kantong: [] })
const filteredKategori = ref([])
const quickInputs = ref([])
const form = ref({ tanggal: '', jenis: '', kategori: '', nominal: '', kantongAsal: '', kantongTujuan: '', catatan: '', fileData: null })

const getLocalDateString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const fetchRef = async () => { refData.value = await $fetch('/api/referensi') }
const fetchQuickInputs = async () => {
  const res = await $fetch('/api/transaksi/quick-inputs')
  if (res.status === 'success') quickInputs.value = res.data
}

const applyQuickInput = (qi) => {
  form.value.jenis = qi.jenis
  aturForm()
  
  // Periksa apakah kategori di quick input masih ada dan aktif di data referensi
  if (filteredKategori.value.some(cat => cat[1] === qi.kategori_nama)) {
    form.value.kategori = qi.kategori_nama
  } else {
    form.value.kategori = '' // reset jika kategori sudah dihapus/dinonaktifkan
  }
  
  form.value.catatan = qi.catatan
}

const aturForm = () => { filteredKategori.value = refData.value.kategori.filter(r => r[0] === form.value.jenis) }
const handleFile = (e) => {
  const file = e.target.files[0]; const reader = new FileReader();
  reader.onload = (evt) => form.value.fileData = { base64: evt.target.result.split(',')[1], mimeType: file.type, name: file.name };
  reader.readAsDataURL(file)
}
const handleFormSubmit = async () => {
  const res = await $fetch('/api/transaksi', { method: 'POST', body: form.value })
  await Swal.fire({ title: 'Info', text: res.pesan, icon: res.status === 'success' ? 'success' : 'error' })
  if(res.status === 'success') navigateTo('/dashboard')
}
onMounted(() => {
  fetchRef()
  fetchQuickInputs()
  form.value.tanggal = getLocalDateString()
})
</script>