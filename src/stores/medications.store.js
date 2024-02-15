import { defineStore } from 'pinia'
import {computed, ref} from "vue";
import {addDoc, collection, deleteDoc, doc, getDocs} from "firebase/firestore";
import {db} from "@/firebase/firebase.config.js";
import {useAuthStore} from "@/stores/auth.js";
import colors from "@/assets/colors.js";
export const useMedicationStore = defineStore('medications', () => {
    const medications =  ref([]);
    const filteredMedications =  ref([]);

    const filteredKeys = ref({
        names: [],
        doctors: [],
        patients: []
    });

    const config = ref({
        error: '',
        success: '',
        showForm: false,
        showLoader: false
    });
    const authStore = useAuthStore();
    const toggleShow = () =>{
        config.value.showForm = !config.value.showForm;
    }
    const getMedications = async() => {
        config.value.showLoader = true;

        let array = [];
        try{
            const queryMedications = await getDocs(collection(db, 'users', authStore.user.id, 'medications'));
            queryMedications.forEach( (doc) => {
                let medication = {
                    id: doc.id,
                    ...doc.data()
                };
                array.push(medication);
            });
        }catch (e) {
            console.log('error while getting all analyses from DB: '+ e)
        }

        medications.value = [...array];
        filteredMedications.value = array.sort((a, b) => new Date(b.date) - new Date(a.date));

        let names = new Set();
        let doctors = new Set();
        let patients = new Set();
        array.forEach(elem => {
            names.add(elem.name)
            doctors.add(elem.doctor);
            patients.add(elem.patient);
        });
        filteredKeys.value.names = Array.from(names);
        filteredKeys.value.doctors = Array.from(doctors);
        filteredKeys.value.patients = Array.from(patients);

        config.value.showLoader = false;
    }
    const add = async(newMed) => {
        const userRef = doc(db, 'users', authStore.user.id);
        let medRef;
        try{
            medRef = await  addDoc(collection(userRef, 'medications'), {
                name: newMed.name,
                date: newMed.date,
                cost: +newMed.cost,
                doctor: newMed.doctor,
                patient: newMed.patient,
                check: newMed.check,
                id_user: authStore.user.id
            });
            console.log("New analysis was written in DB analyses! " + medRef.id);
        }catch (e) {
            console.error("Error adding analysisDoc in collection: ", e);
        }
    }
    const remove = async(med) => {
        try{
            await deleteDoc(doc(db, 'users', authStore.user.id, 'medications', med.id));
        }catch (e) {
            console.log('Error while deleting medication from DB: ' + e);
        }
    }

    const totalCount = computed(() => {
        return filteredMedications.value.reduce((sum, elem) => {return sum + elem.cost}, 0).toFixed(2);
    });

    const chartMedicationsConfig = computed(()=> {
        let names = [];
        let costs = [];
        filteredMedications.value.forEach(elem => {
            names.push(elem.name);
            costs.push(elem.cost);
        });
        let backgrounds = colors.slice(0, names.length);

        return {
            labels: names,
            datasets: [
                {
                    backgroundColor: backgrounds,
                    data: costs
                }
            ]
        }

    })

    const filter = (conditionsFilter) => { // {name: '', doctor: '', patient: ''}
        let array = [];
        if(Object.values(conditionsFilter).every(elem => elem === '' || elem === null)){
            array = [...medications.value].sort((a, b) => new Date(b.date) - new Date(a.date));
        }else{
            let regExps = [];
            let keys = [];

            for(let key in conditionsFilter){
                if(conditionsFilter[key] !== '' && conditionsFilter[key] !== null){
                    keys.push(key);
                    regExps.push(new RegExp(conditionsFilter[key], 'i'));
                }
            }
            array = medications.value.filter(elem => {
               for(let i = 0; i < keys.length; i++){
                   if(!regExps[i].test(elem[keys[i]])) return false;
               }
               return true;
            });
        }
        filteredMedications.value = [...array];
    }


    return {
        filteredMedications,  config, totalCount, chartMedicationsConfig,
        getMedications, toggleShow, add, remove, filter, filteredKeys
    }
});