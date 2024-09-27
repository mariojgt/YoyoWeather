// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxt/ui"],
    target: 'static', // Ensure static site generation
    router: {
        base: '/YoyoWeather/', // Your repository name
    }
});
