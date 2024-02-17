import { defineStore } from 'pinia'
import {computed, ref} from "vue";
import {addDoc, collection, deleteDoc, doc, getDocs, query, onSnapshot} from "firebase/firestore";
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
        showLoader: false,
        paginatePage: 1,
        paginateAmount: 10
    });
    const authStore = useAuthStore();
    const toggleShow = () =>{
        config.value.showForm = !config.value.showForm;
    }
    const getMedications = async() => {
        config.value.showLoader = true;

        let array = [];
        const q = query(collection(db, 'users', authStore.user.id, 'medications'));
        try{
            const queryMedications = await getDocs(q);
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

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    console.log("New medication: ", change.doc.data());
                }
                if (change.type === "modified") {
                    console.log("Modified medication: ", change.doc.data());
                }
                if (change.type === "removed") {
                    console.log("Removed medication: ", change.doc.data());
                }
            }, (error) => {
                console.log("Error in snapchat city: ", error);
                unsubscribe();
            });
        });

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

    const getPages= computed(() => {
        return Math.ceil(filteredMedications.value.length / config.value.paginateAmount);
    });
    const needsPaginate = computed(()=> {
        return filteredMedications.value.length >= config.value.paginatePage;
    });
    const filteredByPagination = computed(() => {
        if(needsPaginate.value){
            let start = (config.value.paginatePage - 1) * config.value.paginateAmount;
            let end = config.value.paginatePage * config.value.paginateAmount - 1;

            return filteredMedications.value.filter((item, ind)=> {
                return ind >= start && ind <= end;
            });
        }
        return filteredMedications.value;
    });
    const changePaginate = (num) => {
        if(num < 1) num = getPages.value;
        else if(num > getPages.value) num = 1;

        config.value.paginatePage = num;
    }
    const changeItemsOnPage = (num) => {
        config.value.paginateAmount = num;
    };

    return {
        filteredMedications,  config, totalCount, chartMedicationsConfig,
        getMedications, toggleShow, add, remove, filter, filteredKeys,
        getPages, filteredByPagination, changePaginate, changeItemsOnPage
    }
});