<script setup>
import Button from "primevue/button";

defineProps({
  isMobile: Boolean,
  label: String,
  toggleForm: Function
})
</script>

<template>
  <div :class="{btnAdd: true, desktopBtn: !isMobile, mobBtn: isMobile}">
    <Button class="btn" :label="label" @click="toggleForm"/>
  </div>
</template>

<style scoped>
.btnAdd {
  display: flex;
  justify-content: end;
  margin: 0 20px;
}
.desktopBtn{
  display: flex;
}
.mobBtn{
  display: none;
}
@media screen and (max-width: 466px){
  .btnAdd button{
    font-size: 12px;
    padding: 8px 6px;
  }
}
@media screen and (max-width: 696px){
  .desktopBtn{
    display: none;
  }
  .mobBtn{
    display: flex;
    margin: 0;
    align-self: start;
  }
  .mobBtn button{
    font-size: 14px;
    padding: 15px;
  }
  .total-head span{
    margin: 0;
  }

}
@media screen and (max-width: 540px){
  .mobBtn button{
    padding: 10px;
  }
}
@media screen and (max-width: 466px){
  .btnAdd button{
    font-size: 12px;
    padding: 8px 6px;
  }
}
</style>