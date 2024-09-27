export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxt/ui"],
    target: "static", // Ensure static site generation
    router: {
      base: "/YoyoWeather/", // Your repository name
    },
    app: {
      baseURL: "/YoyoWeather/", // Make sure the app uses the correct base URL
    },
  });
