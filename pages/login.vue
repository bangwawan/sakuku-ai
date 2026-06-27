<template>
  <div class="container" style="max-width: 400px; margin-top: 15%;">
    <div class="card card-custom p-4 shadow-sm text-center">
      <h3 class="mb-2 fw-bold text-primary">💰 Keuangan Keluarga</h3>
      <p class="text-muted small mb-4">Silakan masuk menggunakan nama dan PIN Anda</p>
      <form @submit.prevent="handleLogin">
        <div class="mb-3 text-start">
          <label class="form-label">Nama Pengguna</label>
          <input type="text" v-model="form.username" class="form-control" placeholder="Contoh: admin123" required pattern="[a-z0-9]{6,}" title="Minimal 6 karakter, hanya huruf kecil dan angka">
        </div>
        <div class="mb-4 text-start">
          <label class="form-label">PIN Keamanan</label>
          <input type="password" v-model="form.pin" class="form-control" placeholder="••••••" required pattern="[0-9]{6,}" title="Minimal 6 digit angka" inputmode="numeric">
        </div>
        <button type="submit" :disabled="loading" class="btn btn-primary w-100 py-2">
          {{ loading ? 'Memverifikasi... 🔑' : 'Masuk Aplikasi' }}
        </button>
      </form>
      <div v-if="pesanError" class="alert alert-danger py-2 small mt-3">{{ pesanError }}</div>
    </div>
  </div>
</template>

<script setup>
const form = ref({ username: '', pin: '' })
const loading = ref(false)
const pesanError = ref('')

const handleLogin = async () => {
  loading.value = true
  const res = await $fetch('/api/auth/login', { method: 'POST', body: form.value })
  if (res.status === 'success') {
    useCookie('user_session').value = res.username
    navigateTo('/')
  } else {
    pesanError.value = res.pesan
  }
  loading.value = false
}
</script>