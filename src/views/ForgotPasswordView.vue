<script setup>
import Message from "primevue/message";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import LoaderComponent from "@/components/UI/LoaderComponent.vue";
import {useAuthStore} from "@/stores/auth.js";
import {ref} from "vue";

const authStore = useAuthStore();
const email = ref();
</script>

<template>
  <h2>Reset password:</h2>
  <Message v-if="authStore.error" severity="error">{{authStore.error}}</Message>
  <form class="form">
    <div class="form__item">
      <span>
        <i class="pi pi-user"></i>
      </span>
      <InputText type="email" v-model="email" placeholder="Your E-mail"/>
    </div>
    <LoaderComponent v-if="authStore.loader"/>
    <div v-else class="form__item">
      <Button class="btn" label="SignIn" @click="authStore.forgotPassword(email)"/>
    </div>
    <div></div>
  </form>
</template>

<style scoped>
h2{
  padding-left: 10px;
  margin: 20px auto;
  color: mediumpurple;
  text-align: center;
}
.form{
  margin: 0 auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.btn{
  width: 35%;
}
.form__item{
  max-width: 300px;
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.form__item:last-child{
  margin: 20px 0 0 0;
}
.form__item span {
  color: mediumpurple;
  margin-right: 10px;
  font-size: 14px;
}
.form__item a{
  text-decoration: none;
  color: #8B5CF6;;
  font-weight: 500;
  transition: all linear 300ms;
}
.form__item a:hover{
  color: darkgray;
}
.form__item:last-child{
  margin: 0;
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>