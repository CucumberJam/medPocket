<script setup>
defineProps({
  name: String
})
</script>

<template>
  <div class="title">
    <h3>{{name}}</h3>
  </div>
</template>

<style scoped>
.title{
  right: 10%;
  position: relative;
  top: 10px;
  font-size: 24px;
  color:#8B5CF6;
  text-shadow: 0px 0px 2px rgba(71,31,19,0.98);
  z-index: -1;
}
.title h3{
  margin: 0;
}
@media screen and (max-width: 540px){
  .mob-btn button{
    padding: 10px;
  }
}
@media screen and (max-width: 488px){
  .title{
    right: 0;
  }
  .title{
    font-size:18px;
  }
}
</style>