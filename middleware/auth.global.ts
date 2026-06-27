export default defineNuxtRouteMiddleware((to, from) => {
    const userSession = useCookie('user_session')

    if (!userSession.value && to.path !== '/login') {
        return navigateTo('/login')
    }

    if (userSession.value && to.path === '/login') {
        return navigateTo('/')
    }

    const userRole = useCookie('user_role')
    if (to.path === '/kelola' && userRole.value === 'pencatat') {
        return navigateTo('/') // pencatat tidak boleh akses kelola
    }
})