<script setup>
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from "primevue/button";
import Message from 'primevue/message';
import LoaderComponent from "@/components/UI/LoaderComponent.vue";
import {ref} from 'vue';
import {useAuthStore} from "@/stores/auth.js";

const nick = ref();
const email = ref();
const password = ref();

const authStore = useAuthStore();

const signup = async () => {
  if(!email.value || !nick.value || !password.value){
    alert('Please fill all fields.');
    return;
  }
  await authStore.authenticateUser('signup', email.value, password.value, nick.value);

  email.value = '';
  password.value = '';
  nick.value= '';
}

</script>

<template>
  <h2>Sign Up</h2>
  <Message v-if="authStore.error" severity="error">{{authStore.error}}</Message>
  <Message v-if="authStore.success" severity="success">Successful registration!</Message>
  <form class="form">
    <div class="form__item">
      <span>
        <i class="pi pi-user"></i>
      </span>
      <InputText type="email" v-model="nick" placeholder="Your Nick name"/>
    </div>
    <div class="form__item">
      <span>
        <i class="pi pi-envelope"></i>
      </span>
      <InputText type="email" v-model="email" placeholder="Your E-mail"/>
    </div>
    <div class="form__item">
      <span>
        <i class="pi pi-lock"></i>
      </span>
      <Password v-model="password" :feedback="false" placeholder="Your Password"/>
    </div>
    <LoaderComponent v-if="authStore.loader"/>
    <div v-else class="form__item">
      <span>
        Are you already registered?
        <br/>
        <router-link to="/signin">Sign in</router-link>
      </span>
      <Button class="btn" label="Signup" @click="signup"/>
    </div>

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
  color: mediumpurple;
  transition: all linear 300ms;
}
.form__item a:hover{
  color: darkgray;
}
</style>