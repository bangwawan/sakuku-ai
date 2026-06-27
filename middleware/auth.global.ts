export default defineNuxtRouteMiddleware((to, from) => {
    const userSession = useCookie('user_session')

    if (process.server) {
        console.log(`[SSR] path: ${to.path}, session: ${userSession.value}`)
    } else {
        console.log(`[Client] path: ${to.path}, session: ${userSession.value}`)
    }

    if (!userSession.value && to.path !== '/login') {
        return navigateTo('/login')
    }

    if (userSession.value && to.path === '/login') {
        return navigateTo('/dashboard')
    }

    if (userSession.value && to.path === '/') {
        return navigateTo('/dashboard')
    }

    const userRole = useCookie('user_role')
    if (to.path === '/kelola' && userRole.value === 'pencatat') {
        return navigateTo('/dashboard') // pencatat tidak boleh akses kelola
    }
})