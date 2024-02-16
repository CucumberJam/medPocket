import {ref} from 'vue';
import { defineStore } from 'pinia';
import {auth, db} from '../firebase/firebase.config.js';
import { setDoc , doc,  getDoc } from "firebase/firestore";
import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut} from "firebase/auth";
import {useRouter} from "vue-router";
import {useAnalysisStore} from "@/stores/analyses.store.js";
import {useMedicationStore} from "@/stores/medications.store.js";



export const useAuthStore = defineStore('auth', () => {
    const user = ref({
        id: '',
        name: '',
        email: ''
    });

    const router = useRouter();
    const analyseStore = useAnalysisStore();
    const medicalStore = useMedicationStore();

    const error = ref('');
    const loader = ref(false);
    const success = ref(false);
    const isLoggedIn = ref(false);
    const mode = ref('Analyses');

    const auth = getAuth();
    const authenticateUser = async (type, email, password, name = '') => {
        error.value = '';
        loader.value = true;
        success.value = false;

        if (type === 'signup') {
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    try {
                        await setDoc (doc(db, "users", userCredential.user.uid), {
                            name: name,
                            email: email
                        });
                        console.log("New user added in DB with ID: ", userCredential.user.uid);
                    } catch (e) {
                        console.error("Error adding New user in DB: ", e);
                    }
                    console.log(userCredential.user);
                }).catch(errorHandler);


        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    user.value = {
                        name: name,
                        token: userCredential.user.accessToken,
                        email: userCredential.user.email,
                        userId: userCredential.user.uid,
                    }
                    console.log(user.value.name);
                }).catch(errorHandler);
        }
        loader.value = false;
        setTimeout(() => {
            success.value = false;
        }, 3000);
    }
    const logOut = () => {
        signOut(auth).then(async () => {
            console.log('Sign-out successful.');
        }).catch(errorHandler);
    }
    const init = () => {
        onAuthStateChanged(auth, async (userCredentials) => {
            console.log('auth state changed: ' + userCredentials);
            if (userCredentials) {
                console.log('user id: ' + userCredentials.uid);

                isLoggedIn.value = true;
                const docRef = doc(db, 'users', userCredentials.uid);
                const docSnap = await getDoc(docRef);

                user.value.id = docSnap.id;
                user.value.name = docSnap.data().name;
                user.value.email = docSnap.data().email;

                await analyseStore.getAllAnalyses();
                await medicalStore.getMedications();

                //router.push('/profile');
                router.push({path: 'analyses'});
            }else{
                user.value = {};
                isLoggedIn.value = false;
                router.replace({name: 'home'});
            }
        });
    }

    return {authenticateUser, logOut, init,
        error, loader, success, isLoggedIn, user, mode}
});

const errorHandler = async (error) => {
    error.value = error.message;
    setTimeout(() => {
        error.value = '';
    }, 3000);
    throw error.value;
}
