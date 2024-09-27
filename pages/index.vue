<template>
    <div class="min-h-screen">
        <!-- App Header -->
        <header class="text-center py-6 bg-blue-500 text-white">
            <h1 class="text-4xl font-bold">YoyoWeather</h1>
        </header>

        <!-- Search Bar -->
        <div class="flex justify-center my-8 gap-2 md:gap-4 md:flex-row flex-col">
            <UInput class="w-full md:w-1/2"  v-model="location" variant="outline" placeholder="Enter a location fo the weather forecast" />
            <UButton @click="searchWeather" label="Search" />
        </div>
        <div class="flex justify-center my-8 gap-2 md:gap-4 md:flex-row flex-col">
            <UButton>London</UButton>
            <UButton>Paris</UButton>
            <UButton>New York</UButton>
            <UButton>Los Angeles</UButton>
        </div>

        <!-- Weather Cards -->
        <div v-if="forecast.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-6">
            <WeatherCard v-for="(day, index) in forecast" :key="index" :day="day" />
        </div>
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

const location = ref<string>('') // Reactive location string
const forecast = ref<Forecast[]>([]) // Reactive forecast array
const error = ref<string>('')

const searchWeather = async () => {
    if (!location.value) {
        error.value = 'Please enter a location.'
        return
    }

    try {
        // Step 1: Get lat and lon from the Geocoding API
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${location.value}`
        )
        const geoData = await geoResponse.json()

        if (geoData.results && geoData.results.length > 0) {
            const { latitude, longitude } = geoData.results[0]

            // Step 2: Get weather forecast from the Weather API
            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max&timezone=auto`
            )
            const weatherData = await weatherResponse.json()

            forecast.value = weatherData.daily.time.map((date: string, index: number) => ({
                date: new Date(date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' }),
                icon: getWeatherIcon(weatherData.daily.weathercode[index]),
                description: getWeatherDescription(weatherData.daily.weathercode[index]),
                temperature: Math.round(weatherData.daily.temperature_2m_max[index]),
                windSpeed: Math.round(weatherData.daily.windspeed_10m_max[index])
            }))
            error.value = ''
        } else {
            toast.add({ title: 'Location not found. Please try another search.', color: 'red' })
            error.value = 'Location not found. Please try another search.'
        }
    } catch (err) {
        error.value = 'There was an error fetching the weather data. Please try again.'
    }
}


const getWeatherIcon = (code: number) => {
    const icons: Record<number, string> = {
        0: '/icons/sunny.svg',
        1: '/icons/partly-cloudy.svg',
        2: '/icons/cloudy.svg',
        3: '/icons/rainy.svg',
        45: '/icons/foggy.svg'
        // More icons if we need
    }
    return icons[code] || '/icons/default.png'
}

const getWeatherDescription = (code: number) => {
    const descriptions: Record<number, string> = {
        0: 'Sunny',
        1: 'Partly Cloudy',
        2: 'Cloudy',
        3: 'Rainy',
        45: 'Foggy'
        // More codes if we need https://open-meteo.com/en/docs
    }
    return descriptions[code] || 'Unknown'
}
</script>
