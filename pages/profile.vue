<template>
  <div class="container-fluid py-3">
    <h4 class="mb-4 fw-bold">Profil Pengguna</h4>

    <div class="card card-custom p-4 shadow-sm mb-4 text-center">
      <div v-if="profile.foto" class="mx-auto mb-3" style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; border: 3px solid #0d6efd;">
        <img :src="profile.foto" alt="Foto Profil" class="w-100 h-100 object-fit-cover" />
      </div>
      <div v-else class="mx-auto bg-primary text-white d-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px; border-radius: 50%; font-size: 30px;">
        👤
      </div>
      <h5 class="fw-bold mb-1">{{ profile.nama_lengkap || profile.username }}</h5>
      <p class="text-muted small mb-0">{{ profile.role === 'administrator' ? 'Administrator' : 'Pencatat' }}</p>
    </div>

    <!-- UPDATE PROFIL -->
    <div class="card card-custom p-4 shadow-sm mb-4">
      <h6 class="fw-bold text-primary mb-3">📝 Perbarui Data Diri</h6>
      <form @submit.prevent="submitUpdateProfile">
        <div class="mb-3">
          <label class="form-label small text-muted">Nama Lengkap</label>
          <input type="text" v-model="profile.nama_lengkap" class="form-control" placeholder="Nama lengkap">
        </div>
        <div class="mb-3">
          <label class="form-label small text-muted">No. WhatsApp</label>
          <input type="text" v-model="profile.no_wa" class="form-control" placeholder="08xxxxxxxxxx">
        </div>
        <div class="mb-3">
          <label class="form-label small text-muted">Email</label>
          <input type="email" v-model="profile.email" class="form-control" placeholder="email@contoh.com">
        </div>
        <div class="mb-3">
          <label class="form-label small text-muted">Foto Profil (Gambar)</label>
          <input type="file" @change="handleFoto" class="form-control" accept="image/*">
        </div>
        <button type="submit" class="btn btn-primary w-100 mt-2">Simpan Perubahan</button>
      </form>
    </div>

    <!-- GANTI PIN -->
    <div class="card card-custom p-4 shadow-sm mb-4">
      <h6 class="fw-bold text-danger mb-3">🔑 Ganti PIN</h6>
      <form @submit.prevent="submitGantiPin">
        <div class="mb-3">
          <label class="form-label small text-muted">PIN Lama</label>
          <input type="password" v-model="formPin.pinLama" class="form-control" required placeholder="Masukkan PIN Lama" pattern="[0-9]{6,}" inputmode="numeric">
        </div>
        <div class="mb-3">
          <label class="form-label small text-muted">PIN Baru</label>
          <input type="password" v-model="formPin.pinBaru" class="form-control" required placeholder="Masukkan PIN Baru (Min 6 Angka)" pattern="[0-9]{6,}" inputmode="numeric">
        </div>
        <div class="mb-3">
          <label class="form-label small text-muted">Konfirmasi PIN Baru</label>
          <input type="password" v-model="formPin.konfirmasi" class="form-control" required placeholder="Ketik ulang PIN Baru" pattern="[0-9]{6,}" inputmode="numeric">
        </div>
        <button type="submit" class="btn btn-danger w-100 mt-2">Ubah PIN</button>
      </form>
    </div>

    <!-- MANAJEMEN PENGGUNA (Khusus Admin) -->
    <div v-if="userRole === 'administrator'" class="card card-custom p-4 shadow-sm">
      <h6 class="fw-bold text-success mb-3">👥 Manajemen Pengguna</h6>
      
      <!-- Tambah Pengguna -->
      <form @submit.prevent="submitAddUser" class="mb-4 border p-3 rounded bg-light">
        <h6 class="small fw-bold mb-3">Tambah Pencatat Baru</h6>
        <div class="row">
          <div class="col-md-6 mb-2">
            <input type="text" v-model="formUser.username" class="form-control form-control-sm" placeholder="Username (Min 6 Huruf Kecil/Angka)" required pattern="[a-z0-9]{6,}">
          </div>
          <div class="col-md-6 mb-2">
            <input type="password" v-model="formUser.pin" class="form-control form-control-sm" placeholder="PIN (Min 6 Angka)" required pattern="[0-9]{6,}" inputmode="numeric">
          </div>
          <div class="col-md-6 mb-2">
            <input type="text" v-model="formUser.nama_lengkap" class="form-control form-control-sm" placeholder="Nama Lengkap">
          </div>
          <div class="col-md-6 mb-2">
            <button type="submit" class="btn btn-success btn-sm w-100">Tambah</button>
          </div>
        </div>
      </form>

      <!-- Daftar Pengguna -->
      <div class="table-responsive">
        <table class="table table-sm table-bordered">
          <thead class="table-light text-center small">
            <tr>
              <th>Username</th>
              <th>Nama</th>
              <th>Role</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="small align-middle">
            <tr v-for="u in users" :key="u.username">
              <td>{{ u.username }}</td>
              <td>{{ u.nama_lengkap || '-' }}</td>
              <td class="text-center">
                <span class="badge" :class="u.role === 'administrator' ? 'bg-primary' : 'bg-secondary'">{{ u.role }}</span>
              </td>
              <td class="text-center">
                <span v-if="u.role !== 'administrator'" class="badge" :class="u.is_active ? 'bg-success' : 'bg-danger'" style="cursor:pointer;" @click="toggleUserStatus(u)">
                  {{ u.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
                <span v-else class="badge bg-success">Aktif</span>
              </td>
              <td class="text-center">
                <button v-if="u.role !== 'administrator'" @click="editUser(u)" class="btn btn-sm btn-outline-primary py-0 px-2 me-1">Edit</button>
                <button v-if="u.role !== 'administrator' && !u.has_transaction" @click="hapusUser(u.username)" class="btn btn-sm btn-outline-danger py-0 px-2">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

const userRole = useCookie('user_role')

// State
const profile = ref({ username: '', nama_lengkap: '', no_wa: '', email: '', foto: '', role: '' })
const formPin = ref({ pinLama: '', pinBaru: '', konfirmasi: '' })
const formUser = ref({ username: '', pin: '', nama_lengkap: '' })
const users = ref([])

// Fetch Profile
const fetchProfile = async () => {
  const res = await $fetch('/api/profile')
  if (res.status === 'success') profile.value = res.data
}

// Fetch Users (Admin Only)
const fetchUsers = async () => {
  if (userRole.value !== 'administrator') return
  const res = await $fetch('/api/users')
  if (res.status === 'success') users.value = res.data
}

onMounted(() => {
  fetchProfile()
  fetchUsers()
})

// Handle Foto Upload
const handleFoto = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (evt) => { profile.value.foto = evt.target.result }
  reader.readAsDataURL(file)
}

// Submit Update Profile
const submitUpdateProfile = async () => {
  const res = await $fetch('/api/profile/update', { method: 'PUT', body: profile.value })
  if (res.status === 'success') {
    Swal.fire({ title: 'Berhasil', text: res.pesan, icon: 'success' })
    fetchProfile()
  } else {
    Swal.fire({ title: 'Gagal', text: res.pesan, icon: 'error' })
  }
}

// Submit Ganti PIN
const submitGantiPin = async () => {
  if (formPin.value.pinBaru !== formPin.value.konfirmasi) {
    Swal.fire({ title: 'Gagal', text: 'Konfirmasi PIN tidak cocok!', icon: 'error' })
    return
  }
  
  const { isConfirmed } = await Swal.fire({
    title: 'Konfirmasi',
    text: 'Apakah Anda yakin ingin mengubah PIN?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Ubah'
  })

  if (isConfirmed) {
    const res = await $fetch('/api/profile/ganti-pin', { 
      method: 'POST', 
      body: { pinLama: formPin.value.pinLama, pinBaru: formPin.value.pinBaru } 
    })
    
    if (res.status === 'success') {
      await Swal.fire({ title: 'Berhasil', text: res.pesan, icon: 'success' })
      window.location.href = '/login'
    } else {
      Swal.fire({ title: 'Gagal', text: res.pesan, icon: 'error' })
    }
  }
}

// Submit Add User (Admin)
const submitAddUser = async () => {
  const res = await $fetch('/api/users/create', { method: 'POST', body: formUser.value })
  if (res.status === 'success') {
    Swal.fire({ title: 'Berhasil', text: res.pesan, icon: 'success' })
    formUser.value = { username: '', pin: '', nama_lengkap: '' }
    fetchUsers()
  } else {
    Swal.fire({ title: 'Gagal', text: res.pesan, icon: 'error' })
  }
}

// Toggle User Status (Admin)
const toggleUserStatus = async (u) => {
  const newStatus = u.is_active ? 0 : 1
  const res = await $fetch('/api/users/update', { 
    method: 'PUT', 
    body: { username: u.username, is_active: newStatus, nama_lengkap: u.nama_lengkap, no_wa: u.no_wa, email: u.email } 
  })
  if (res.status === 'success') fetchUsers()
}

// Edit User (Admin)
const editUser = async (u) => {
  const { value: formValues } = await Swal.fire({
    title: 'Edit Pengguna',
    html:
      `<input id="swal-nama" class="swal2-input" placeholder="Nama Lengkap" value="${u.nama_lengkap || ''}">` +
      `<input id="swal-nowa" class="swal2-input" placeholder="No WhatsApp" value="${u.no_wa || ''}">` +
      `<input id="swal-email" class="swal2-input" placeholder="Email" type="email" value="${u.email || ''}">` +
      `<input id="swal-pin" class="swal2-input" type="password" placeholder="PIN Baru (Opsional)" pattern="[0-9]*">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Simpan',
    preConfirm: () => {
      const pin = document.getElementById('swal-pin').value;
      if (pin && pin.length < 6) {
        Swal.showValidationMessage('PIN harus minimal 6 digit angka');
        return false;
      }
      return {
        nama_lengkap: document.getElementById('swal-nama').value,
        no_wa: document.getElementById('swal-nowa').value,
        email: document.getElementById('swal-email').value,
        pin: pin
      }
    }
  });

  if (formValues) {
    const res = await $fetch('/api/users/update', { 
      method: 'PUT', 
      body: { 
        username: u.username, 
        is_active: u.is_active, 
        nama_lengkap: formValues.nama_lengkap, 
        no_wa: formValues.no_wa, 
        email: formValues.email, 
        pin: formValues.pin 
      } 
    })
    
    if (res.status === 'success') {
      Swal.fire({ title: 'Berhasil', text: res.pesan, icon: 'success' })
      fetchUsers()
    } else {
      Swal.fire({ title: 'Gagal', text: res.pesan, icon: 'error' })
    }
  }
}

// Delete User (Admin)
const hapusUser = async (username) => {
  const { isConfirmed } = await Swal.fire({
    title: 'Hapus Pengguna?',
    text: 'Apakah Anda yakin menghapus pencatat ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus'
  })
  if (isConfirmed) {
    const res = await $fetch('/api/users/delete', { method: 'DELETE', body: { username } })
    if (res.status === 'success') {
      Swal.fire({ title: 'Berhasil', text: res.pesan, icon: 'success' })
      fetchUsers()
    } else {
      Swal.fire({ title: 'Gagal', text: res.pesan, icon: 'error' })
    }
  }
}
</script>
