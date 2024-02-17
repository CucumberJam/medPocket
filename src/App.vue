<script setup>
import { RouterLink, RouterView } from 'vue-router'
import 'primeicons/primeicons.css'
import {useAuthStore} from './stores/auth.js';
import {useAnalysisStore} from "@/stores/analyses.store.js";
import {useMedicationStore} from "@/stores/medications.store.js";
import {onMounted, ref} from "vue";
import InputText from 'primevue/inputtext';

const authStore = useAuthStore();
const analysesStore = useAnalysisStore();
const medicalStore = useMedicationStore();

const query = ref('');
const isSorting = ref(false);

const showBurger = ref(false);
const toggleBurger = () => {
  showBurger.value = !showBurger.value;
}
const sort = () =>{
  isSorting.value = true;
  if(authStore.mode === 'Analyses'){
    analysesStore.filter(query.value);
  } else{
    medicalStore.filter({name: query.value, doctor: '', patient: ''});
  }
  isSorting.value = false;
}

onMounted(() => {
  authStore.init();
})

</script>

<template>
    <header>
      <div class="wrapper-head">
        <nav>
          <div class="nav_item">
            <h2>PocketMed</h2>
          </div>
          <div v-if="analysesStore.user.id" class="nav_item search-box">
            <label for="search" style="font-size: 12px; padding-top: 0"></label>
            <InputText class="input-search" id="search" placeholder="Search..."
                       v-model="query"
                       @input.prevent='sort'/>
            <div class="search-icon">
              <i v-if="!isSorting" class="pi pi-search" style="color: #708090"></i>
              <i v-else class="pi pi-spin pi-spinner" style="color: #708090"></i>
            </div>
          </div>
          <div  class="nav_item nav-bar">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/profile" v-if="authStore.isLoggedIn">Profile</RouterLink>
            <RouterLink to="/signup" v-else>SignUp</RouterLink>
            <div class="logout" v-if="authStore.isLoggedIn" @click.prevent="authStore.logOut">
              <i class="pi pi-sign-out" style="font-size: 1.5rem"></i>
            </div>
            <RouterLink to="/signin" v-else>SignIn</RouterLink>
          </div>
          <div class="menu-burger" @click="toggleBurger">
            <button class="menu-btn">
              <span class="menu-btn__item"></span>
            </button>
            <ul v-if="showBurger" class="menu-list">
              <li class="menu-list-item">
                <RouterLink to="/">Home</RouterLink>
              </li>
              <li class="menu-list-item" v-if="authStore.isLoggedIn">
                <RouterLink to="/profile">Profile</RouterLink>
              </li>
              <li class="menu-list-item" v-else>
                <RouterLink to="/signup">SignUp</RouterLink>
              </li>
              <li class="menu-list-item" v-if="authStore.isLoggedIn"
                  @click.prevent="authStore.logOut">
                <a href="#" class="nav-link">Log out</a>
              </li>
              <li class="menu-list-item" v-else>
                <RouterLink to="/signin">SignIn</RouterLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
    <main class="container">
      <RouterView />
    </main>
    <div class="push"></div>
  <footer ></footer>
</template>

<style scoped>
*{
  margin: 0;
  padding:0;
  box-sizing: border-box;
}
body{
  font-family: 'Arial', 'sans-serif';
}
html, body {
  min-height: 100vh;
  margin: 0;
}

header {
  line-height: 1.5;
  max-height: 100vh;
  margin-right: 30px;
  margin-left: 30px;
}
.push {
  height: 50px;
}
footer{
  background-color: #8B5CF6;
  width: 100%;
  height: 50px;
  opacity: 85%;
  margin: auto 30px 0 30px;
}

.wrapper-head nav {
  height: 100%;
  background: #8B5CF6;;
  opacity:85%;
  color: white;
  font-size: 14px;
  font-weight: bolder;
}
.logo {
  display: block;
  margin: 0 auto 2rem;
}
.container{
  margin: 0 30px 0 30px;
}

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
.nav_item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px;
}
.nav-bar{
  display: flex;
}
.input-search{
  padding-left: 10px;
  max-width: 250px;
  width: 100%;
  min-height: 30px;
  height: 100%;
  min-width: 80px;
  outline: none;
  border: none;
  box-shadow: none;
}
.search-box{
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline-color: transparent;
  box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05);
  color: #334155;
}
.search-icon{
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
}

/*MENU BURGER*/
.menu-burger{
  display: none;
  position: relative;
}
.menu-btn{
  display: flex;

  padding: 0;
  margin: 0;
  width: 32px;
  height: 23px;
  border: none;
  background-color: transparent;
}
.menu-btn:hover .menu-btn__item,
.menu-btn:hover .menu-btn__item::before,
.menu-btn:hover .menu-btn__item::after{
  background-color: #222222;
}
.menu-btn__item{
  margin: auto;
  display: block;
  width: 100%;
  height: 3px;
  background-color: #fff;
  position: relative;
}
.menu-btn__item::before,
.menu-btn__item::after{
  content: '';
  display: block;
  width: 100%;
  height: 3px;
  background-color: #fff;
  position: absolute;
  left: 0;
}
.menu-btn__item::before{
  top: -10px;
}
.menu-btn__item::after{
  top: 10px;
}
.menu-list {
  color: #551A8B;
  width: 90px;
  padding: 10px 0 10px 0;
  border-radius: 3px;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
  -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;

  background-color: #fff;
  list-style-type: none;
  position: absolute;
  top: 30px;
  right: 0;
  visibility: visible; /*hidden; */
  /* height: 0; */
}
.menu-list-item {}
.menu-list-item a, .nav-link {
  color: #551A8B;
  text-decoration: none;
}
.menu-list-item a:hover, .nav-link:hover {
  color: orange;
}
.menu-list-item a:active, .nav-link:active {
  color: grey;
}
@media screen and (max-width: 696px){
  header{
    margin: 0 10px;
  }
  .nav-bar{
    display: none;
  }
  .menu-burger{
    display: flex;
  }
}
@media screen and (max-width: 460px){
  header{
    margin: 0;
  }
  .wrapper nav{
    flex-wrap: wrap;
  }
  .search-box{
    flex: 0 0 100%;
    order: 2;
    max-width: 240px;
  }
}
</style>
