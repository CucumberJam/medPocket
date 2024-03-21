<script setup>
import PieChartComponent from "@/components/UI/PieChartComponent.vue";

defineProps({
  totalCount: Number,
  chartConfig: Object,
})

</script>

<template>
  <div class="chart-box">
    <div class="total-head">
      <slot></slot>
      <p>Expenses:</p><span>{{totalCount}} RUB</span>
    </div>
    <div class="pie-chart">
      <PieChartComponent :chart-data="chartConfig"/>
    </div>
  </div>
</template>

<style scoped>
.chart-box{
  max-width: 35%;
  max-height: 300px;
  margin: 0 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  align-self: end;
}
.total-head{
  border: none;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.total-head span {
  margin-left: 20px;
  color: red;
  font-weight: bold;
}
.total-head span{
  margin: 0;
}
.total-head{
  flex-direction: column;
  align-items: start;
}


@media screen and (max-width: 696px) {
  .chart-box {
    flex-direction: row;
    justify-content: space-between;
    max-width: 100%;
    align-self: normal;
    margin: 0;
  }
  .mob-btn button {
    font-size: 14px;
    padding: 15px;
  }
  .total-head span {
    margin: 0;
  }
  .total-head {
    flex-direction: column;
    align-items: start;
  }
  .pie-chart {
    max-width: 300px;
  }

}
@media screen and (max-width: 540px){
  .mob-btn button{
    padding: 10px;
  }
  .dropdown span{
    font-size: 12px;
  }
}
@media screen and (max-width: 466px){
  .pie-chart{
    max-width: 180px;
  }
  .btn-add button{
    font-size: 12px;
    padding: 8px 6px;
  }
}
</style>