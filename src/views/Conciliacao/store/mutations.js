export const setDadosNubank = (state, value) => {
    state.dadosNubank = value
}

export const setDadosMobills = (state, value) => {
    state.dadosMobills = value
}

export const setDadosConciliados = (state, value) => {
    state.dadosConciliados = value
}

export const pushDadosConciliados = (state, value) => {
    state.dadosConciliados.push(value)
}

export const deleteConciliacao = (state, id) => {
    let index = state.dadosConciliados.findIndex((conciliacao) => conciliacao.id == id);
    let conciliacao = state.dadosConciliados[index]
    let contaNubank = state.dadosNubank.find((conta) => conta.id == conciliacao.nubank.id)
    let contaMobills = state.dadosMobills.find((conta) => conta.id == conciliacao.mobills.id)
    contaNubank.conciliado = 0
    contaMobills.conciliado = 0

    state.dadosConciliados.splice(index, 1)
    // state.dadosNubank.push(nubank)
    // state.dadosMobills.push(mobills)
}

export const deleteDespesaNubank = (state, id) => {
    let index = state.dadosNubank.findIndex((despesa) => despesa.id == id);
    state.dadosNubank.splice(index, 1)
}