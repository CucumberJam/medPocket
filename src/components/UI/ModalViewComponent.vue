<script setup>
import Message from "primevue/message";

defineProps({
  config: {
    error: String,
    success: String,
  },
  title: String
});


</script>

<template>
  <div class="modal-box">
    <i class="pi pi-times cross" style="font-size: 1.5rem" @click="$emit('exit')"></i>
    <h3>{{ title }}</h3>
    <Message v-if="config.error" severity="error">{{config.error}}</Message>
    <Message v-if="config.success" severity="success">Success!</Message>
    <slot/>
  </div>
</template>

<style scoped>
.modal-box{
  position: absolute;
  margin: 0 20%;
  top: 10%;
  z-index: 5;

  background: white;

  max-width: 400px;
  width: 100%;
  min-height: 500px;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
  -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;

  border-radius: 10px;
  padding: 40px 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.cross{
  position: relative;
  left: 45%;
  top: -15px;
  opacity: 25%;
  width: 5px;
}
@media screen and (max-width: 668px){
  .modal-box{
    max-width: 300px;
    min-height: 400px;
    padding: 20px;
    margin: 0 15%;
  }
  .modal-box h3{
    margin: 5px 0;
  }
  .modal-box form{
    font-size: 12px;
  }
}
@media screen and (max-width: 453px){
  .modal-box{
    margin: 0 5%;
  }
}
@media screen and (max-width: 380px){
  .modal-box{
    margin: 0 2%;
  }
}
</style>