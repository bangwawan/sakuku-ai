<template>
  <div class="login-wrapper">
    <div class="login-card-container">
      <div class="card p-4 shadow-sm text-center border-0">
        <h3 class="mb-2 fw-bold text-primary">SAKUKU AI</h3>
        <p class="text-muted mb-4">Aplikasi Keuangan Pribadi Berbasis AI & PWA</p>
        <hr>
        <p class="mb-4">Masukkan username dan PIN Anda</p>
        <form @submit.prevent="handleLogin">
          <div class="mb-3 text-start">
            <label class="form-label text-muted">Username</label>
            <input type="text" v-model="form.username" class="form-control" placeholder="Masukkan Username" required pattern="[a-z0-9]{6,}" title="Minimal 6 karakter, hanya huruf kecil dan angka">
          </div>
          <div class="mb-4 text-start">
            <label class="form-label text-muted">PIN</label>
            <input type="password" v-model="form.pin" class="form-control" placeholder="Masukkan PIN" required pattern="[0-9]{6,}" title="Minimal 6 digit angka" inputmode="numeric">
          </div>
          <button type="submit" :disabled="loading" class="btn btn-primary w-100 py-2">
            {{ loading ? 'Memverifikasi... 🔑' : 'Masuk Aplikasi' }}
          </button>
        </form>
        <div v-if="pesanError" class="alert alert-danger py-2 small mt-3">{{ pesanError }}</div>
      </div>
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
    useCookie('user_fullname').value = res.fullname
    navigateTo('/dashboard')
  } else {
    pesanError.value = res.pesan
  }
  loading.value = false
}
</script>

<style scoped>
.login-wrapper {
  min-height: calc(100vh - 2rem);
  margin: -1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card-container {
  width: 100%;
  max-width: 400px;
}
</style>