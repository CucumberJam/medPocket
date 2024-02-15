<script setup>
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from "primevue/button";
import Message from 'primevue/message';
import LoaderComponent from "@/components/UI/LoaderComponent.vue";
//import {useRouter} from 'vue-router';
import {ref} from 'vue';
import {useAuthStore} from "@/stores/auth.js";


const email = ref();
const password = ref();

const authStore = useAuthStore();
//const router = useRouter();
const signin = async () => {
  if(!email.value || !password.value){
    alert('Please fill all fields.');
    return;
  }
  await authStore.authenticateUser('signin', email.value, password.value);
  email.value = '';
  password.value = '';
}

</script>

<template>
  <h2>Sign In</h2>
  <Message v-if="authStore.error" severity="error">{{authStore.error}}</Message>
  <form class="form">
    <div class="form__item">
      <span>
        <i class="pi pi-user"></i>
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
        Are you not registered yet?
        <br/>
        <router-link to="/signup">Sign Up</router-link>
      </span>
      <Button class="btn" label="SignIn" @click="signin"/>
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