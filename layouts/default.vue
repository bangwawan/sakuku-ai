<template>
  <div class="responsive-layout">
    <ClientOnly>
      <div v-if="userSession" class="top-navbar">
        <div><span class="text-muted small">Hai, <strong class="text-primary">{{ userFullname || userSession }}</strong> 👋</span></div>
        <div><button class="btn btn-sm btn-outline-danger py-1 px-2" style="font-size: 12px;" @click="logout">🚪 Keluar</button></div>
      </div>
    </ClientOnly>

    <div class="p-3">
      <slot />
    </div>

    <ClientOnly>
      <div v-if="userSession" class="nav-bottom nav-bottom-fixed d-flex justify-content-around bg-white border-top py-2">
        <NuxtLink to="/dashboard" class="nav-link-custom text-center text-decoration-none text-dark" style="font-size: 11px;">
          <span class="fs-5 d-block">📊</span> Dashboard
        </NuxtLink>
        <NuxtLink to="/catat" class="nav-link-custom text-center text-decoration-none text-dark" style="font-size: 11px;">
          <span class="fs-5 d-block">➕</span> Catat
        </NuxtLink>
        <NuxtLink to="/laporan" class="nav-link-custom text-center text-decoration-none text-dark" style="font-size: 11px;">
          <span class="fs-5 d-block">📄</span> Laporan
        </NuxtLink>
        <NuxtLink v-if="userRole === 'administrator'" to="/kelola" class="nav-link-custom text-center text-decoration-none text-dark" style="font-size: 11px;">
          <span class="fs-5 d-block">⚙️</span> Kelola
        </NuxtLink>
        <NuxtLink to="/profile" class="nav-link-custom text-center text-decoration-none text-dark" style="font-size: 11px;">
          <span class="fs-5 d-block">👤</span> Profil
        </NuxtLink>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

const userSession = useCookie('user_session')
const userRole = useCookie('user_role')
const userFullname = useCookie('user_fullname')

const logout = async () => {
  const { isConfirmed } = await Swal.fire({
    title: 'Keluar',
    text: 'Apakah Anda yakin ingin keluar?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Keluar'
  })
  if (isConfirmed) {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      userSession.value = null
      window.location.href = '/login'
    } catch (e) {
      Swal.fire({ title: 'Gagal', text: 'Gagal logout', icon: 'error' })
    }
  }
}
</script>

<style>
@import '~/assets/css/main.css';
</style>