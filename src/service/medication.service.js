import {addDoc, collection, deleteDoc, doc, getDocs, query} from "firebase/firestore";
import {db} from "@/firebase/firebase.config.js";
import {MedicationDTO} from "@/dto/MedicationDTO.js";

export async function getService(userId){
    let array = [];
    const q = query(collection(db, 'users', userId, 'medications'));
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
        console.log('Error while getting all medications from DB: '+ e);

    }
    return array;
}
export async function addService(userId, newMedication){
    const userRef = doc(db, 'users', userId);

    // создали DTO и внесли в DB
    let objectDTO = MedicationDTO(newMedication, userId);

    let medRef;
    try{
        medRef = await  addDoc(collection(userRef, 'medications'), objectDTO);
    }catch (e) {
        console.error("Error adding medication in collection: ", e);
    }
    // возвращаем новый готовый анализ с id:
    return {...objectDTO, id: medRef.id}
}
export async function deleteService(userId, medId){
    try{
        await deleteDoc(doc(db, 'users', userId, 'medications', medId));
    }catch (e) {
        console.log('Error while deleting medication from DB: ' + e);
    }
    return medId;
}

export function getFilteredKeysService(array){
    let names = new Set();
    let doctors = new Set();
    let patients = new Set();

    array.forEach(elem => {
        names.add(elem.name)
        doctors.add(elem.doctor);
        patients.add(elem.patient);
    });


    return {
        names: Array.from(names),
        doctors: Array.from(doctors),
        patients: Array.from(patients)
    }

}