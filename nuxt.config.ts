// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: false },
    ssr: true,
    app: {
        head: {
            title: 'Pencatatan Keuangan Keluarga',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ],
            link: [
                { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' }
            ],
            script: [
                { src: 'https://cdn.jsdelivr.net/npm/chart.js' }
            ]
        }
    },
    modules: ['@vite-pwa/nuxt'],
    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Pencatatan Keuangan Keluarga',
            short_name: 'Keuangan',
            description: 'Aplikasi pencatatan keuangan keluarga',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            icons: [
                {
                    src: 'pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ]
        },
        workbox: {
            navigateFallback: '/',
            globPatterns: ['**/*.{js,css,html,png,svg,ico}']
        },
        devOptions: {
            enabled: true,
            type: 'module',
        },
    },
    nitro: {
        preset: 'vercel'
    }
})