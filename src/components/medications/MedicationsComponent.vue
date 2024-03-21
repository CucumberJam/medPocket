<script setup>
import MedicationComponent from "@/components/medications/MedicationComponent.vue";
import {useMedicationStore} from '../../stores/medications.store.js';

const medicalStore = useMedicationStore();

</script>

<template>
  <div class="list"></div>
  <table>
    <thead >
    <tr>
      <th></th>
      <th>Name</th>
      <th>Date</th>
      <th>Cost</th>
      <th>Doctor</th>
      <th>Patient</th>
      <th>Check</th>
    </tr>
    </thead>
    <tbody>
    <MedicationComponent v-for="elem in medicalStore.filteredMedications"
                       :key="elem.id" :medication="elem"
                        @delete="medicalStore.remove(elem.id)"/>
    </tbody>
  </table>
  <div class="total">
    <p>Total cost: </p>
    <p>{{medicalStore.totalCount}} RUB</p>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border: none;
  margin-bottom: 20px;
}
table thead th {
  font-weight: bold;
  text-align: left;
  border: none;
  padding: 10px 15px;
  background: #d8d8d8;
  font-size: 14px;
}
table thead tr th:first-child {
  border-radius: 8px 0 0 8px;
}
table thead tr th:last-child {
  border-radius: 0 8px 8px 0;
}
/*table tbody td {
  text-align: left;
  border: none;
  padding: 10px 15px;
  font-size: 14px;
  vertical-align: top;
}
table tbody tr:nth-child(even){
  background: #f3f3f3;
}*/
table tbody tr td:first-child {
  border-radius: 8px 0 0 8px;
}
table tbody tr td:last-child {
  border-radius: 0 8px 8px 0;
}
td{
  max-width: 40px;
}
tr{
  align-items: center;
}
.total{
  border: 1px solid #dbdbd9;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@media screen and (max-width: 696px){

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