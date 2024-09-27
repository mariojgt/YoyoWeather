<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 text-white p-5">
        <!-- App Header -->
        <header class="text-center py-6">
            <h1 class="text-5xl font-extrabold tracking-wide">YoyoWeather</h1>
            <p class="text-xl mt-2 font-light">Your 5-Day Weather Forecast Companion</p>
        </header>

        <!-- Search Bar -->
        <div class="flex justify-center my-8 gap-2 md:gap-4">
            <UInput class="w-full md:w-1/2 bg-white text-gray-800 rounded-md shadow-lg focus:ring-2 focus:ring-blue-500"
                v-model="location" variant="outline" placeholder="Enter a location..." />
            <UButton @click="searchWeather(location)" label="Search"
                class="px-6 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-all" />
        </div>

        <!-- Quick Location Buttons -->
        <div class="flex justify-center my-8 gap-2 md:gap-4 flex-col md:flex-row">
            <UButton @click="searchWeather('London')"
                class="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-all">
                London
            </UButton>
            <UButton @click="searchWeather('Paris')"
                class="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-all">
                Paris
            </UButton>
            <UButton @click="searchWeather('New York')"
                class="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-all">
                New York
            </UButton>
            <UButton @click="searchWeather('Los Angeles')"
                class="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-all">
                Los Angeles
            </UButton>
        </div>

        <!-- Weather Forecast Header -->
        <div v-if="forecast.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-6">
            <h2 class="text-center text-2xl font-bold col-span-full">Weather Forecast for {{ location }}</h2>
        </div>

        <!-- Weather Cards -->
        <div v-if="forecast.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-6">
            <WeatherCard v-for="(day, index) in forecast" :key="index" :day="day" />
        </div>

        <!-- Error Message -->
        <div v-else class="text-center text-gray-600">
            <UAlert v-if="error" :title="error" color="red" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WeatherCard from '~/components/WeatherCard.vue'

const toast = useToast()

interface Forecast {
    date: string
    icon: string
    description: string
    temperature: number
    windSpeed: number
}

const location = ref<string>('')
const forecast = ref<Forecast[]>([])
const error = ref<string>('')

const searchWeather = async (defaultLocation: string = '') => {
    if (defaultLocation) {
        location.value = defaultLocation
    }

    if (!location.value) {
        error.value = 'Please enter a location.'
        return
    }

    try {
        // Step 1: Get lat and lon from the location using the API
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${location.value}`
        )
        const geoData = await geoResponse.json()

        if (geoData.results && geoData.results.length > 0) {
            const { latitude, longitude } = geoData.results[0]
            // Use the reusable function to get the weather data
            await fetchWeatherByCoordinates(latitude, longitude)
        } else {
            toast.add({ title: 'Location not found. Please try another search.', color: 'red' })
            error.value = 'Location not found. Please try another search.'
        }
    } catch (err) {
        error.value = 'There was an error fetching the weather data. Please try again.'
    }
}

const fetchWeatherByCoordinates = async (latitude: number, longitude: number) => {
    try {
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max&timezone=auto`
        )
        const weatherData = await weatherResponse.json()

        forecast.value = weatherData.daily.time.slice(0, 5).map((date: string, index: number) => ({
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' }),
            icon: getWeatherIcon(weatherData.daily.weathercode[index]),
            description: getWeatherDescription(weatherData.daily.weathercode[index]),
            temperature: Math.round(weatherData.daily.temperature_2m_max[index]),
            windSpeed: Math.round(weatherData.daily.windspeed_10m_max[index]),
        }))

        error.value = ''
    } catch (err) {
        error.value = 'There was an error fetching the weather data.'
    }
}

const getCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords
            await fetchWeatherByCoordinates(latitude, longitude)
        }, () => {
            error.value = 'Unable to retrieve your location.'
        })
    } else {
        error.value = 'Geolocation is not supported by this browser.'
    }
}

// Helper functions

const getWeatherIcon = (code: number) => {
    const icons: Record<number, string> = {
        0: '/YoyoWeather/icons/sunny.png',
        1: '/YoyoWeather/icons/partly-cloudy.png',
        2: '/YoyoWeather/icons/cloudy.png',
        3: '/YoyoWeather/icons/rainy.png',
        45: '/YoyoWeather/icons/foggy.png',
    }
    return icons[code] || '/YoyoWeather/icons/rainy.png'
}

const getWeatherDescription = (code: number) => {
    const descriptions: Record<number, string> = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Drizzle: Light intensity',
        53: 'Drizzle: Moderate intensity',
        55: 'Drizzle: Dense intensity',
        56: 'Freezing Drizzle: Light intensity',
        57: 'Freezing Drizzle: Dense intensity',
        61: 'Rain: Slight intensity',
        63: 'Rain: Moderate intensity',
        65: 'Rain: Heavy intensity',
        66: 'Freezing Rain: Light intensity',
        67: 'Freezing Rain: Heavy intensity',
        71: 'Snow fall: Slight intensity',
        73: 'Snow fall: Moderate intensity',
        75: 'Snow fall: Heavy intensity',
        77: 'Snow grains',
        80: 'Rain showers: Slight intensity',
        81: 'Rain showers: Moderate intensity',
        82: 'Rain showers: Violent intensity',
        85: 'Snow showers: Slight intensity',
        86: 'Snow showers: Heavy intensity',
        95: 'Thunderstorm: Slight or moderate',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
        // More codes if we need https://open-meteo.com/en/docs
    }
    return descriptions[code] || 'Unknown'
}

onMounted(() => {
    getCurrentLocation()
})
</script>
