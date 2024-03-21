import { defineStore } from 'pinia'
import {computed, ref,} from "vue";
import {useAuthStore} from "@/stores/auth.js";
import colors from '../assets/colors.js';
import {
    addService,
    deleteLastService,
    getService, getSubService,
    updateAddedService,
    updateDeletedService,
    updateMinMaxService
} from "@/service/analyses.service.js";


export const useAnalysisStore = defineStore('analyse', () => {
    const analyses =  ref([]);
    const filteredAnalyses = ref([]);
    const filteredKeys = ref([]);
    const config = ref({
        error: '',
        success: '',
        showForm: false,
        showLoader: false,
        paginatePage: 1,
        paginateAmount: 10
    });
    const user = computed (() => useAuthStore().user);
    const getAllAnalyses = async() => {
        config.value.showLoader = true;

        let array = await getService(user.value.id);
        await getSubService(user.value.id, array);

        if(array.length){
            analyses.value = [...array];
            filteredAnalyses.value = array.sort((a, b) => new Date(b.date_last) - new Date(a.date_last));
            filteredKeys.value = [...analyses.value].map(elem => elem.name);
        }
        config.value.showLoader = false;
    }


/*    const getPages= computed(() => {
        return Math.ceil(filteredAnalyses.value.length / config.value.paginateAmount);
    });
    const needsPaginate = computed(()=> {
        return filteredAnalyses.value.length >= config.value.paginatePage;
    });

    const filteredByPagination = computed(() => {
        if(needsPaginate.value){
            let start = (config.value.paginatePage - 1) * config.value.paginateAmount;
            let end = config.value.paginatePage * config.value.paginateAmount - 1;

            return filteredAnalyses.value.filter((item, ind)=> {
                return ind >= start && ind <= end;
            });
        }
        return filteredAnalyses.value;
    });
    const changePaginate = (num) => {
        if(num < 1) num = getPages.value;
        else if(num > getPages.value) num = 1;

        config.value.paginatePage = num;
    }
    const changeItemsOnPage = (num) => {
        config.value.paginateAmount = num;
    };*/
    const add = async (newAnalysis) => {
        let found = analyses.value.find(elem => elem.name === newAnalysis.name);
        if(!found)  {
            let result = await addService(newAnalysis, user.value.id);
            analyses.value.push(result);
            filteredAnalyses.value = [...analyses.value];
        }
        else {
            await updateAddedService(newAnalysis, user.value.id, found);
        }
        toggleShow();
    }
    const deleteAnalysis = async (analysisSubList) => {
        let found = analyses.value.find(elem => elem.id =  analysisSubList.id_analysis);
        if(found.list.length === 1) {
            let resultId = await deleteLastService(user.value.id, analysisSubList);
            analyses.value = analyses.value.filter(analysis => analysis.id !== resultId);
        } else{
            await updateDeletedService(user.value.id, analysisSubList.id, found);
        }
        filteredAnalyses.value = [...analyses.value];
    }
    const filter = (searchLine = null) => {
        let array = [];
        if(!searchLine || searchLine === '') {
            array = [...analyses.value].sort((a, b) => new Date(b.date_last) - new Date(a.date_last));
        }
        else{
            const regExpr = new RegExp(searchLine, 'i');
            array = analyses.value.filter(elem => regExpr.test(elem.name));
       }
        filteredAnalyses.value = [...array];
    };
    const toggleShow = () =>{
        config.value.showForm = !config.value.showForm;
    }

    const isDangerSub = computed((analysisName) => {
        const found = analyses.value.find(elem => elem.name === analysisName);
        return {max: found.max, min: found.min};
    });

    const totalCount = computed(() => {
       return filteredAnalyses.value.reduce((sum, elem) => {return sum + elem.total_cost}, 0).toFixed(2);
    });

    const changeMinMax = async(analysisId, key, value) =>{
        await updateMinMaxService(analysisId, key, value, user.value.id);
    }

    const chartAnalysesConfig = computed(()=> {
        let names = [];
        let costs = [];
        filteredAnalyses.value.forEach(elem => {
            names.push(elem.name);
            costs.push(elem.total_cost);
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

    });

    return {
        config, user, analyses, filteredAnalyses,
        toggleShow, getAllAnalyses, deleteAnalysis, changeMinMax,
        add, filter, isDangerSub, totalCount, chartAnalysesConfig, filteredKeys
    }
})
