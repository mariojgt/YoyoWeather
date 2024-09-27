<template>
    <div
        class="flex flex-col items-center p-6 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
        <div class="mb-4 text-xl font-semibold">{{ day.date }}</div>

        <div class="mb-4">
            <img :src="day.icon" alt="Weather Icon" class="w-20 h-20" />
        </div>

        <div class="mb-2 text-base capitalize">{{ day.description }}</div>

        <div class="text-3xl font-bold mb-2">{{ day.temperature }}°C</div>

        <div class="text-sm text-gray-100">Wind: {{ day.windSpeed }} km/h</div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

// Define the expected props for the WeatherCard
interface WeatherDay {
    date: string
    icon: string
    description: string
    temperature: number
    windSpeed: number
}

const props = defineProps<{
    day: WeatherDay
}>()
</script>

<style scoped>
/* Add specific styles here if needed */
</style>
