<script setup>
import {ref} from "vue";
import Dropdown from 'primevue/dropdown';

const selected = ref(10);
const pages = ref([5, 10, 20, 30]);

const  props = defineProps({
    num: {
      type: Number,
      default: 1,
    },
    chosenPage:{
      type: Number,
      default: 1,
    }
});

</script>

<template>
  <div class="container">
    <div class="paginate-box">
      <span @click="$emit('paginate', chosenPage - 1)"> << </span>
      <span class="num" v-for="elem in num"
            :key="elem"
            @click="$emit('paginate', elem)"
            :class="{active: chosenPage === elem}">
      {{elem}}
    </span>
      <span @click="$emit('paginate', chosenPage + 1)"> >> </span>
    </div>
    <div>
      <span class="select-title">Page:</span>
      <Dropdown v-model="selected" :options="pages" placeholder="page"
                @change="$emit('change', selected)"
                class="w-full md:w-14rem select-page" />
    </div>
  </div>

</template>

<style scoped>
.container{
  display: flex;
  justify-content: space-around;
  align-items: center
}
.paginate-box{
  max-width: 400px;
  width: 100%;
  min-height: 30px;

  margin: 20px auto 0 auto;
  padding: 10px;

  border-radius: 2px;

  color: #2c3e50;
  font-size: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
}
.paginate-box span{
  padding: 5px 15px;
  margin: 0 5px;
  color: #6D28D9;
}
.active{
  color: white;
  background-color: #F5F3FF;;
  opacity: 80%;
  border-radius: 50%;
}
.select-page{
  max-width: 90px;
  max-height: 50px;
}
.select-title{
  margin-right: 10px
}
</style>