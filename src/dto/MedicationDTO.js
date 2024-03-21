export function MedicationDTO(newMed, id){
    return {
        name: newMed.name,
        date: newMed.date,
        cost: +newMed.cost,
        doctor: newMed.doctor,
        patient: newMed.patient,
        check: newMed.check,
        id_user: id
    }
}
