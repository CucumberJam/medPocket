export function AnalysisDTO(newAnalysis, id){
    return {
        name: newAnalysis.name,
        date_last: newAnalysis.date,
        min: +newAnalysis.min,
        max: +newAnalysis.max,
        value_avg: +newAnalysis.value,
        total_cost: +newAnalysis.cost,
        id_user: id
    }
}
export function AnalysisSubDTO(newAnalysis, id){
    return {
        date: newAnalysis.date,
        min: +newAnalysis.min,
        max: +newAnalysis.max,
        value: +newAnalysis.value,
        cost: +newAnalysis.cost,
        id_analysis: id
    }
}