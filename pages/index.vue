<template>
    <div class="min-h-screen bg-white">
        <header class="text-center py-6 bg-blue-500 text-white">
            <h1 class="text-3xl font-bold">Weather App</h1>
        </header>

        <!-- Search Bar -->
        <div class="flex justify-center my-8">
            <input v-model="location" type="text" placeholder="Enter a location..."
                class="px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button @click="fetchWeather"
                class="ml-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Search
            </button>
        </div>

        <!-- Weather Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-6">
            <WeatherCard v-for="(day, index) in forecast" :key="index" :day="day" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import WeatherCard from '~/components/WeatherCard.vue'

interface Forecast {
    date: string
    icon: string
    description: string
    temperature: number
    windSpeed: number
}

const location = ref<string>('') // Reactive location string
const forecast = ref<Forecast[]>([]) // Reactive forecast array

const fetchWeather = () => {
    // Mock data for now, replace with API call
    forecast.value = [
        {
            date: 'Monday',
            icon: '/icons/sunny.png',
            description: 'Sunny',
            temperature: 25,
            windSpeed: 10
        },
        {
            date: 'Tuesday',
            icon: '/icons/cloudy.png',
            description: 'Cloudy',
            temperature: 20,
            windSpeed: 12
        },
        // Add more mock data...
    ]
}

onMounted(() => {
    // Fetch initial weather for a default location, e.g., London
    fetchWeather()
})
</script>
