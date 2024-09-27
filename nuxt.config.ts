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
        head: {
            title: "YoyoWeather - 5-Day Weather Forecast",
            meta: [
                {
                    hid: "description",
                    name: "description",
                    content:
                        "Get the latest 5-day weather forecast for any city. Accurate weather information with temperature, wind speed, and more.",
                },
                {
                    hid: "keywords",
                    name: "keywords",
                    content:
                        "weather forecast, 5-day weather, city weather, temperature, wind speed",
                },
                { name: "author", content: "Your Name" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
                { name: "robots", content: "index, follow" },
                {
                    hid: "og:title",
                    property: "og:title",
                    content: "YoyoWeather - Accurate 5-Day Weather Forecast",
                },
                {
                    hid: "og:description",
                    property: "og:description",
                    content:
                        "Check the weather forecast for the next 5 days in any city. Get detailed temperature and wind speed information.",
                },
                {
                    hid: "og:image",
                    property: "og:image",
                    content: "/YoyoWeather/icons/YoYo.png",
                }, // Update with your actual image path
                {
                    hid: "og:url",
                    property: "og:url",
                    content: "https://mariojgt.github.io/YoyoWeather/",
                },
                {
                    hid: "twitter:title",
                    name: "twitter:title",
                    content: "YoyoWeather - 5-Day Weather Forecast",
                },
                {
                    hid: "twitter:description",
                    name: "twitter:description",
                    content:
                        "Find accurate weather forecasts for the next 5 days in your city.",
                },
                {
                    hid: "twitter:image",
                    name: "twitter:image",
                    content: "/YoyoWeather/icons/YoYo.png",
                }, // Update with your actual image path
            ],
            link: [
                {
                    rel: "canonical",
                    href: "https://mariojgt.github.io/YoyoWeather/",
                }, // Update with your actual URL
                {
                    rel: "icon",
                    type: "image/png",
                    href: "/YoyoWeather/favicon.png",
                }, // Add your favicon path
            ],
        },
    },
});
