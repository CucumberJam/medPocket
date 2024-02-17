<script setup>
import AnalysisComponent from "@/components/analyses/AnalysisComponent.vue";

defineProps({
  totalCount: Number,
  filteredAnalyses: Array,
})
</script>

<template>
  <div class="list"></div>
  <table>
    <thead >
    <tr>
      <th colspan="2">Name</th>
      <th>Date</th>
      <th>Value middle</th>
      <th colspan="2">Min</th>
      <th colspan="2">Max</th>
      <th>Total cost</th>
    </tr>
    </thead>
    <tbody>
      <AnalysisComponent v-for="elem in filteredAnalyses"
                       :key="elem.id" :analysis="elem"/>
    </tbody>
  </table>
  <div class="total">
    <p>Total cost: </p>
    <p>{{totalCount}} RUB</p>
  </div>
</template>

<style>
table {
  width: 100%;
  margin-bottom: 20px;
}
table thead th {
  font-weight: bold;
  text-align: left;
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
table tbody td {
  text-align: left;
  border: none;
  padding: 10px 15px;
  font-size: 14px;
  vertical-align: top;
}
table tbody tr:nth-child(even){
  background: #f3f3f3;
}
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
  border-bottom: 1px solid #ededeb;
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
</style>