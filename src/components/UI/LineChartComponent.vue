<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import {ref} from "vue";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const props = defineProps({
  chartData: {
    labels: {
      type: Array,
      required: true,
      default: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    },
    datasets: [
      {
        label: {
         type: String,
          required: false,
        },
        backgroundColor: {
          type: String,
          required: false,
          default: '#00D8FF'
        },
        data: {
          type: Array,
          default: () => [40, 39, 10, 40, 39, 80, 40]
        },
      },
    ],
  }
});

const options = ref({
  responsive: true,
  maintainAspectRatio: false
})
</script>

<template>
  <Line :data="chartData" :options="options" />
</template>

<style scoped>

</style>