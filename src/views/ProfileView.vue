<script setup>
import {useAuthStore} from "@/stores/auth.js";
import TabsComponent from "@/components/UI/TabsComponent.vue";
import UserNameComponent from "@/components/UI/UserNameComponent.vue";

const authStore = useAuthStore();

function changeMode(mode){
  authStore.mode = mode;
}
</script>

<template>
  <div class="wrapper">
    <header class="head-profile">
      <TabsComponent :change-mode="changeMode"/>
      <UserNameComponent :name="authStore.user.name"/>
    </header>
    <RouterView/>
  </div>
</template>

<style scoped>
main{
  display: flex;
  flex-direction: column;

}
.wrapper{
  margin: 0 auto;
}

.head-profile{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.total-head span {
  margin-left: 20px;
  color: red;
  font-weight: bold;
}
.filter-box div{
  margin-right: 5px;
}
@media screen and (max-width: 696px){
  .mob-btn button{
    font-size: 14px;
    padding: 15px;
  }
  .total-head span{
    margin: 0;
  }
  td{
    padding: 0;
  }
  .filter-box div{
    max-width: 100px;
    font-size: 10px;
  }
  .filter-box svg{
    width: 10px;
  }

}
@media screen and (max-width: 540px){
  .mob-btn button{
    padding: 10px;
  }
}

</style>