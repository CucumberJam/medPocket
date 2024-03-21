<script setup>
import 'primeicons/primeicons.css'
defineProps({
  medication: {
    id: String,
    name: String,
    date: Date,
    cost: Number,
    doctor: String,
    patient: String,
    check: Boolean,
    id_user: String
  }
});
</script>

<template>
  <tr class="card-main">
    <td>
      <div class="icon">
        <i class="pi pi-trash" style="font-size: 1rem; color: #8B5CF6"
           @click="$emit('delete', medication.id)"></i>
      </div>
    </td>
    <td>{{medication.name}}</td>
    <td>{{medication.date}}</td>
    <td>{{medication.cost}}</td>
    <td>{{medication.doctor}}</td>
    <td>{{medication.patient}}</td>
    <td v-if="medication.check">
      <div class="icon">
        <i class="pi pi-check" style="font-size: 1rem; color: green; font-weight: bold"></i>
      </div>
    </td>
    <td v-else>
      <div class="icon">
        <i class="pi pi-times" style="color: red"></i>
      </div>
    </td>
  </tr>
</template>

<style scoped>
tr{
  align-items: center;
}
td{
  max-width: 100px;
  word-wrap:break-word;
}
.icon{
  display: flex;
  justify-content: center;
  align-items: center;
}
@media screen and (max-width: 696px){
  table{
    word-wrap: break-word;
  }
  table thead th{
    padding: 8px 7px;
    font-size: 13px;
  }
  td{
    padding: 3px;
    font-size: 12px;
  }
}
@media screen and (max-width: 500px) {
  table thead th {
    padding: 6px 5px;
    font-size: 12px;
  }
  td {
    padding: 0;
    font-size: 10px;
  }
}
@media screen and (max-width: 445px) {
  table thead th {
    padding: 5px 3px;
    font-size: 10px;
  }
}
</style>