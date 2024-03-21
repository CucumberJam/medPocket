import { defineStore } from 'pinia'
import {computed, ref} from "vue";
import {useAuthStore} from "@/stores/auth.js";
import colors from "@/assets/colors.js";
import {addService, deleteService, getFilteredKeysService, getService} from "@/service/medication.service.js";

export const useMedicationStore = defineStore('medications', () => {
    const medications =  ref([]);
    const filteredMedications =  ref([]);
    const filteredKeys = ref({});
    const config = ref({
        error: '',
        success: '',
        showForm: false,
        showLoader: false,
        paginatePage: 1,
        paginateAmount: 10
    });
    const user = computed (() => useAuthStore().user);
    const toggleShow = () =>{
        config.value.showForm = !config.value.showForm;
    }
    const getMedications = async() => {
        config.value.showLoader = true;

        let array = await getService(user.value.id);
        medications.value = [...array];
        filteredMedications.value = array.sort((a, b) => new Date(b.date) - new Date(a.date));

        filteredKeys.value = getFilteredKeysService(array);

        config.value.showLoader = false;
    }
    const add = async(newMed) => {
        let result = addService(user.value.id, newMed);
        medications.value.push(result);
        filteredMedications.value = [...medications.value];
    }
    const remove = async(id) => {
        await deleteService(user.value.id, id);
        medications.value = medications.value.filter(analysis => analysis.id !== id);
        filteredMedications.value = [...medications.value];
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

/*    const getPages= computed(() => {
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
    };*/

    return {
        filteredMedications,  config, totalCount, chartMedicationsConfig,
        getMedications, toggleShow, add, remove, filter, filteredKeys,
    }
});