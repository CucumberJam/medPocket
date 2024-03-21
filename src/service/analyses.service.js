import {addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc} from "firebase/firestore";
import {db} from "@/firebase/firebase.config.js";
import {AnalysisDTO, AnalysisSubDTO} from "@/dto/AnalysisDTO.js";

export const getService = async (userId) => {
    let array = [];
    const q = query(collection(db, 'users', userId, 'analyses'));
    try{
        const queryAnalyses = await getDocs(q);
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
export const getSubService = async (userId, array) =>{
    try{
        // по id получить список под-коллекции анализа и добавить ему в свойство list:
        for(const analysis of array){
            let subArray = [];
            const q = query(collection(db, 'users', userId, 'analyses', analysis.id, 'list'));
            const querySubList = await getDocs(q);
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
export async function addService(newAnalysis, userId){
    const userRef = doc(db, 'users', userId);

    // создали DTO и внесли в DB
    let objectDTO = AnalysisDTO(newAnalysis, userRef.id);
    let analysisRef = await insertNewAnalysis(userId, objectDTO, userRef);

    // создали subDTO и внесли в subDB:
    let subDTO = AnalysisSubDTO(newAnalysis, analysisRef.id);
    let subAnalysisRef = await insertNewAnalysisSub(analysisRef, subDTO);

    // возвращаем новый готовый анализ с id:
    return {...objectDTO, id: analysisRef.id, list: [{id: subAnalysisRef.id, ...subDTO}]}
}
export async function updateAddedService(newAnalysis, userId, oldAnalysis){
    const analysisRef = doc(db, 'users', userId, 'analyses', oldAnalysis.id);

    // создали subDTO и внесли в subDB:
    const subDTO = AnalysisSubDTO(newAnalysis, analysisRef.id);
    const subAnalysisRef = await insertNewAnalysisSub(analysisRef, subDTO);

    // пересчитать среднее значение, стоимость и последнюю дату:
    const [value_avg, total_cost, date_last] = recalculate(oldAnalysis, newAnalysis, true);

    // перезаписать полученные значения в DB:
    await updateAnalysis(analysisRef, {value_avg, total_cost, date_last});

    // отразить изменения в свойствах old analysis в UI:
    oldAnalysis.value_avg = +value_avg;
    oldAnalysis.total_cost = +total_cost;
    oldAnalysis.date_last = date_last;

    // отразить изменения в под-коллекции в UI
    oldAnalysis.list.push({id: subAnalysisRef.id, ...subDTO});
}
export async function deleteLastService(userId, analysisSub){
    // берем ссылку на анализ из основного списка
    const analysisRef = doc(db, 'users', userId, 'analyses', analysisSub.id_analysis);

    //удалить из subDB & DB:
    try {
        await deleteDoc(doc(analysisRef, 'list', analysisSub.id));
        await deleteDoc(analysisRef);
    }catch (e) {
        console.log('Error while deleting analysis from DB');
    }
    return analysisRef.id;
}
export async function updateDeletedService(userId, id_subAnalysis, oldAnalysis){
    const analysisRef =
        doc(db, 'users', userId, 'analyses', oldAnalysis.id);

    //удалить из subDB:
    await deleteAnalysisSub(analysisRef, id_subAnalysis);

    // отразить изменения в под-коллекции в UI
    oldAnalysis.list = oldAnalysis.list.filter(analysis => analysis.id !== id_subAnalysis);

    // пересчитать parameters:
    const [value_avg, total_cost, date_last] = recalculate(oldAnalysis);

    // перезаписать полученные значения в БД
    await updateAnalysis(analysisRef, {value_avg, total_cost, date_last});

    // отразить изменения в свойствах old analysis в UI:
    oldAnalysis.value_avg = +value_avg;
    oldAnalysis.total_cost = +total_cost;
    oldAnalysis.date_last = date_last;
}
export async function updateMinMaxService(analysisId, key, value, userID){
    const analysisRef = doc(db, 'users', userID,'analyses', analysisId);
    if(key === 'min') await updateKeyService(analysisRef, 'min', value);
    else await updateKeyService(analysisRef, 'max', value);
}



// helpers:
const updateKeyService = async (analysisRef, key, value)=>{
    let data = {};
    data[key] = value;
    try{
        await updateDoc(analysisRef, data);
    }catch (e) {
        console.log('Error while changing min of analysis in DB: ' + e);
    }
}
const insertNewAnalysis = async(userId, analysisDTO, userRef) => {
    let analysisRef;
    try{
        analysisRef = await  addDoc(collection(userRef, 'analyses'), analysisDTO);
    }catch (e) {
        console.error("Error adding analysisDoc in collection: ", e);
    }
    return analysisRef;
}
const insertNewAnalysisSub = async (analysisRef, analysisSubDTO) => {
    let analysisSubRef;
    try{
        analysisSubRef = await addDoc(collection(analysisRef, 'list'), analysisSubDTO);
    } catch(e){
        console.log("Error adding analysisDoc in subcollection: ", e);
    }
    return analysisSubRef;
}
const updateAnalysis = async(analysisRef, parameters)=>{
    try{
        await updateDoc(analysisRef, {...parameters});
    }catch (e) {
        console.log('Error while updating analysis in DB: ' + e);
    }
}
const deleteAnalysisSub = async(analysisRef, id_analysisSub)=>{
    try {
        await deleteDoc(doc(analysisRef, 'list', id_analysisSub));
    }catch (e) {
        console.log('Error while deleting analysis from subDB');
    }
}
const recalculate = (oldAnalysis, newAnalysis = null, isAdded = false)=> {
    let value_avg = 0;
    let total_cost = 0;
    let date_last = '';

    if(isAdded){
        const nums = oldAnalysis.list.length;
        value_avg = ((+oldAnalysis.value_avg * nums + newAnalysis.value) / (nums+1)).toFixed(2);
        total_cost = oldAnalysis.total_cost + newAnalysis.cost;
        date_last = (oldAnalysis.date_last > newAnalysis.date)? oldAnalysis.date_last : newAnalysis.date;
    } else{
        date_last = oldAnalysis.list[0].date;
        oldAnalysis.list.forEach(analysisSub => {
            console.log('date last: ' + date_last);
            console.log('analysisSub date: ' + analysisSub.date);
            if(date_last < analysisSub.date) {
                date_last = analysisSub.date;
            }
            value_avg += parseFloat(analysisSub.value);
            total_cost += parseFloat(analysisSub.cost);
        });
        value_avg = +(value_avg / oldAnalysis.list.length).toFixed(2);
    }

    return [value_avg, total_cost, date_last];
}
