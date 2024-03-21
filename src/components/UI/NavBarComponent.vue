<script setup>
import {RouterLink} from "vue-router";
defineProps({
  isLoggedIn: Boolean,
  logout: Function
})
</script>

<template>
  <div  class="navigation_item nav-bar">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/analyses" v-if="isLoggedIn">Profile</RouterLink>
    <RouterLink to="/signup" v-else>SignUp</RouterLink>
    <div class="logout" v-if="isLoggedIn" @click="logout">
      <i class="pi pi-sign-out" style="font-size: 1.5rem"></i>
    </div>
    <RouterLink to="/signin" v-else>SignIn</RouterLink>
  </div>
</template>

<style scoped>
nav {
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin: 0 auto 0 auto;

  display: flex;
  justify-content: space-between;
  align-items: center;
}
nav div:first-child{
  padding-left: 20px;
}
nav div:last-child{
  padding-right: 10px;
  margin-left: 20px;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a, .nav-link {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
.navigation_item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px;
}
.nav-bar{
  display: flex;
}
@media screen and (max-width: 696px){
  header{
    margin: 0 10px;
  }
  .nav-bar{
    display: none;
  }
  .navigation_item{
    display: none;
  }
}
@media screen and (max-width: 460px){
  header{
    margin: 0;
  }
  .wrapper nav{
    flex-wrap: wrap;
  }

}
</style>