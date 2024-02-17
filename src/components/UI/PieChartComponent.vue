<script setup>
import { Chart as ChartJS, Title, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';
import {ref} from "vue";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

defineProps({
  chartData: {
    labels: {
      type: Array,
      required: true,
      default: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    },
    datasets: [
      {
        backgroundColor: {
          type: Array,
          default: () => ['#41B883', '#E46651', '#00D8FF', '#DD1B16']
        },
        data: {
          type: Array,
          default: () => [40, 20, 80, 10]
        },
      },
    ],
  }
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

</script>

<template>
    <Pie :data="chartData" :options="chartOptions"/>
</template>

<style scoped>

</style>