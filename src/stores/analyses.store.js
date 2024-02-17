import { defineStore } from 'pinia'
import {computed, ref,} from "vue";
import {doc, addDoc, collection, getCountFromServer, getDocs, updateDoc, deleteDoc} from "firebase/firestore";
import {db} from "@/firebase/firebase.config.js";
import {useAuthStore} from "@/stores/auth.js";
import colors from '../assets/colors.js';

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
    const authStore = useAuthStore();
    const user = computed (() => authStore.user);

    const getAllAnalyses = async() => {
        config.value.showLoader = true;
        let array = await getAnalyses(user.value.id);
        await getAnalysesSubList(user.value.id, array);
        if(array.length){
            analyses.value = [...array];
            filteredAnalyses.value = array.sort((a, b) => new Date(b.date_last) - new Date(a.date_last));
            filteredKeys.value = [...analyses.value].map(elem => elem.name);
        }
        config.value.showLoader = false;
    }
    const getPages= computed(() => {
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
    };
    const add = async (newAnalysis) => {
        const userRef = doc(db, 'users', user.value.id);
        let found =
            analyses.value.find(elem => elem.name === newAnalysis.name);
        if(typeof found === 'undefined'){ //если такого анализа еще нет, то добавляем его в базу анализов
            await insertNewAnalysis(user.value.id, newAnalysis, userRef);
        }else{
            const analysisRef = doc(userRef, 'analyses', found.id);

            // добавить новый анализ в под-коллекцию анализов у анализа с нашим id:
            await insertNewAnalysisSub(analysisRef, newAnalysis);

            // обновить данные об анализе:
            await upDateAnalysis(analysisRef, found, newAnalysis);
        }
        toggleShow();
    }
    const deleteAnalysis = async (analysisSubList) => {
        let found = analyses.value.find(elem => elem.id =  analysisSubList.id_analysis);
        const isLast = found.list.length === 1;

        const analysisRef = doc(db, 'users', user.value.id, 'analyses', analysisSubList.id_analysis);

        await deleteDoc(doc(analysisRef, 'list', analysisSubList.id));

        if(isLast) {
            // если это был последний в под-коллекции анализов, то его удаляем и из основного списка:
            await deleteDoc(analysisRef);
        } else{
            //update analysis
            await upDateAnalysis(analysisRef);
        }
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
        const analysisRef = doc(db, 'users', authStore.user.id,'analyses', analysisId);
        if(key === 'min') await updateSingleKeyAnalysis(analysisRef, 'min', value);
        else await updateSingleKeyAnalysis(analysisRef, 'max', value);
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
        config, user, analyses, filteredByPagination, filteredAnalyses,
        getPages, changePaginate, changeItemsOnPage,
        toggleShow, getAllAnalyses, deleteAnalysis, changeMinMax,
        add, filter, isDangerSub, totalCount, chartAnalysesConfig, filteredKeys
    }
})

// service functions:
const insertNewAnalysis = async(userId, newAnalysis, userRef) => {
    let analysisRef;

    try{
        analysisRef = await  addDoc(collection(userRef, 'analyses'), {
            name: newAnalysis.name,
            date_last: newAnalysis.date,
            min: +newAnalysis.min,
            max: +newAnalysis.max,
            value_avg: +newAnalysis.value,
            total_cost: +newAnalysis.cost,
            id_analysis: userRef.id
        });
        console.log("New analysis was written in DB analyses! " + analysisRef.id);
        console.log(analysisRef);

    }catch (e) {
        console.error("Error adding analysisDoc in collection: ", e);
    }

    // а также добавляем его в под-коллекцию этого анализа:
    await insertNewAnalysisSub(analysisRef, newAnalysis);
}
const insertNewAnalysisSub = async (analysisRef, newAnalysis) => {
    try{
        const analysisSubRef = await addDoc(collection(analysisRef, 'list'), {
            date: newAnalysis.date,
            min: +newAnalysis.min,
            max: +newAnalysis.max,
            value: +newAnalysis.value,
            cost: +newAnalysis.cost,
            id_analysis: analysisRef.id
        });
        console.log("New analysis was written in subcollection of analysis " + analysisSubRef.id);
    } catch(e){
        console.log("Error adding analysisDoc in subcollection: ", e);
    }
}
const upDateAnalysis = async(analysisRef, oldAnalysis = null, newAnalysis = null) => {
    let value_avg = 0;
    let total_cost = 0;
    let date_last = '';

    // обновление при добавлении:
    if(oldAnalysis && newAnalysis){
        // пересчитать среднее значение, стоимость и последнюю дату:
        const coll = collection(analysisRef, 'list');
        const snapshot = await getCountFromServer(coll);

        let numsDocs = snapshot.data().count;
        value_avg = ((oldAnalysis.value_avg * (numsDocs-1) + newAnalysis.value) / numsDocs).toFixed(2);;
        total_cost = oldAnalysis.total_cost + newAnalysis.cost;
        date_last = (oldAnalysis.date_last > newAnalysis.date)? oldAnalysis.date_last : newAnalysis.date;

    }// обновление при удалении:
    else{
        const listAnalyses = await getAnalysisSubList(analysisRef);
        date_last = listAnalyses[0].date;

        listAnalyses.forEach(analysisList => {
            if(date_last > analysisList.date) date_last = analysisList.date;
            value_avg += parseFloat(analysisList.value);
            total_cost += parseFloat(analysisList.cost);
        });
        value_avg = (value_avg / listAnalyses.length).toFixed(2);
    }
    // перезаписать полученные значения в БД анализа:
    try{
        await updateDoc(analysisRef, {
            date_last: date_last,
            value_avg: value_avg,
            total_cost: total_cost
        });
    }catch (e) {
        console.log('Error while updating analysis in DB: ' + e);
    }

}
const getAnalyses = async (userId) => {
    let array = [];
    try{
        //through query shapShot (update data automatically:
/*        const q = query(collection(db, 'users', userId, 'analyses'));
        onSnapshot(q, (querySnapshot) => {
            let array = [];
            querySnapshot.forEach((doc) => {
                let analysis = {
                    id: doc.id,
                    ...doc.data()
                };
                array.push(analysis);
            });
            return array;
        }, error => console.log(error));*/

        // simple get data from DB:
        const queryAnalyses = await getDocs(collection(db, 'users', userId, 'analyses'));
        queryAnalyses.forEach( (doc) => {
            let analysis = {
                id: doc.id,
                ...doc.data()
            };
            array.push(analysis);
        });
    }catch (e) {
        console.log('error while getting all analyses from DB: '+ e)
    }
    return array;
}
const getAnalysesSubList = async (userId, array) =>{
    try{
        // по id получить список под-коллекции анализа и добавить ему в свойство list:
        for(const analysis of array){
            let subArray = [];
            const querySubList = await getDocs(collection(db, 'users', userId, 'analyses', analysis.id, 'list'));
            querySubList.forEach((doc) => {
                let analysisList = {
                    id: doc.id,
                    ...doc.data()
                };
                subArray.push(analysisList);
            });
            subArray.sort((a, b) => new Date(b.date) - new Date(a.date));
            analysis.list = [...subArray];
        }
    }catch (e) {
        console.log('error while getting sub list for analyses from DB: '+ e)
    }
}
const getAnalysisSubList = async (analysisRef) =>{
    let subArray = [];
    try{
        const querySubList = await getDocs(collection(analysisRef, 'list'));
        querySubList.forEach((doc) => {
            let analysisList = {
                id: doc.id,
                ...doc.data()
            };
            subArray.push(analysisList);
        });
    }catch (e) {
        console.log('error while getting sub list for analysis from DB: '+ doc.data().id_analysis + e);
    }
    return subArray;
}

const updateSingleKeyAnalysis = async (analysisRef, key, value)=>{
    let data = {};
    data[key] = value;
    try{
        await updateDoc(analysisRef, data);
    }catch (e) {
        console.log('Error while changing min of analysis in DB: ' + e);
    }
}