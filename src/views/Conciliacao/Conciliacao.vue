<template>
	<div class="conciliacao">
		<v-row class="container-dados">
			<v-col md="4" class="column-dados">
				<v-textarea rows="1" label="Cole o extrato do nubank" no-resize v-model="textNubank"></v-textarea>
				<div class="d-flex">
					<div>
						<v-btn @click="loadNubank" color="success">Carregar</v-btn>
					</div>
					<div class="d-flex flex-column align-end flex-grow-1">
						<span class="small">Conciliado: {{dadosConciliados.length}} / {{dadosNubank.length}}</span>
						<span class="small">R$ Não Conciliado: {{valueNaoConciliadoNu | valorBR}}</span>
					</div>
				</div>
				<div class="list-dados">
					<v-card
						@click="clickSyncNu(conta.id)"
						:disabled="conta.conciliado ? true : false"
						v-for="(conta) in dadosNubankFiltered"
						:key="conta.id"
						class="mt-4"
						:class="[
							conta.id == idNuSync ? 'selected' : '',
							conta.conciliado ? 'conciliado' : ''
						]"
					>
						<div class="d-flex flex-column px-2">
							<div class="d-flex justify-space-between">
								<span class="small">{{conta.data}}</span>
								<span class="small">{{conta.valor}}</span>
							</div>
							<div class="d-flex flex-start">
								<span>{{conta.descricao}}</span>
								<v-spacer></v-spacer>
								<v-icon @click="deleteDespesaNubank(conta.id)" x-small>mdi mdi-trash-can</v-icon>
							</div>
						</div>
					</v-card>
				</div>
			</v-col>
			<v-col md="4" class="column-dados">
				<div>
					<v-text-field v-model="search" label="Pesquisar"></v-text-field>
					<div class="d-flex">
						<v-btn class="mb-4" @click="conciliacaoAuto()" color="info">
							Conciliação
							<br />Automática
						</v-btn>
						<div class="d-flex flex-column align-end flex-grow-1">
							<span class="small">Conciliado: {{dadosConciliados.length}}</span>
							<span class="small">R$ Conciliado: {{valueConciliado | valorBR}}</span>
						</div>
					</div>
				</div>
				<div class="list-dados">
					<div class="d-flex pa-0" v-for="(conciliacao) in dadosConciliados" :key="conciliacao.id">
						<div style="width: 50%;" class="pa-1">
							<v-card class="mt-4" style="min-height: 70px">
								<div class="d-flex flex-column px-2">
									<div class="d-flex justify-space-between">
										<span class="small">{{conciliacao.nubank.data}}</span>
										<span class="small">{{conciliacao.nubank.valor}}</span>
									</div>
									<div class="d-flex flex-start">
										<span>{{conciliacao.nubank.descricao}}</span>
									</div>
								</div>
							</v-card>
						</div>
						<div style="width: 50%;" class="pa-1">
							<v-card class="mt-4" style="min-height: 70px">
								<div class="d-flex flex-column px-2">
									<div class="d-flex justify-space-between">
										<span class="small">{{conciliacao.mobills.data}}</span>
										<span class="small">{{conciliacao.mobills.valor}}</span>
									</div>
									<div class="d-flex flex-start">
										<span>{{conciliacao.mobills.descricao}}</span>
									</div>
								</div>
							</v-card>
						</div>
						<div class="d-flex">
							<v-icon @click="removerConciliacao(conciliacao.id)" x-small>mdi mdi-link-variant-off</v-icon>
						</div>
					</div>
				</div>
			</v-col>
			<v-col md="4" class="column-dados">
				<v-file-input ref="inputFile" label="Selecionar arquivo .xls"></v-file-input>
				<div class="d-flex">
					<v-btn @click="loadMobills" color="success">Carregar</v-btn>
					<div class="d-flex flex-column align-end flex-grow-1">
						<span class="small">Conciliado: {{dadosConciliados.length}} / {{dadosMobills.length}}</span>
						<span class="small">R$ Não Conciliado: {{valueNaoConciliadoMobills | valorBR}}</span>
					</div>
				</div>
				<div class="list-dados">
					<v-card
						@click="clickSyncMobills(conta.id)"
						:disabled="conta.conciliado ? true : false"
						v-for="(conta) in dadosMobillsFiltered"
						:key="conta.id"
						class="mt-4"
						:class="[
							conta.id == idMobillsSync ? 'selected' : '',
							conta.conciliado ? 'conciliado' : ''
						]"
					>
						<div class="d-flex flex-column px-2">
							<div class="d-flex justify-space-between">
								<span class="small">{{conta.data}}</span>
								<span class="small">{{conta.valor}}</span>
							</div>
							<div class="d-flex flex-start">
								<span>{{conta.descricao}}</span>
							</div>
						</div>
					</v-card>
				</div>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import readXlsxFile from "read-excel-file";
import { nameMonthToMonth } from "../../js/util";
import moment from "moment";
import { mapGetters, mapMutations } from "vuex";

export default {
	components: {},
	data() {
		return {
			textNubank: "",
			xlsMobills: [],
			idNuSync: undefined,
			idMobillsSync: undefined,
			search: "",
		};
	},
	filters: {
		valorBR: function (value) {
			if (value == undefined) return;
			return value.toFixed(2).replaceAll(",", "").replace(".", ",");
		},
	},
	computed: {
		...mapGetters("conciliacao", ["dadosNubank", "dadosMobills", "dadosConciliados"]),
		dadosMobillsFiltered() {
			return this.dadosMobills.filter((dados) => {
				if (this.search == "") return true;

				let str = dados.data + " " + dados.descricao + " " + dados.valor;
				this.search = this.search.toUpperCase();

				if (str.toUpperCase().indexOf(this.search) > -1) return true;
				else return false;
			});
		},
		dadosNubankFiltered() {
			return this.dadosNubank.filter((dados) => {
				if (this.search == "") return true;

				let str = dados.data + " " + dados.descricao + " " + dados.valor;
				this.search = this.search.toUpperCase();

				if (str.toUpperCase().indexOf(this.search) > -1) return true;
				else return false;
			});
		},
		valueConciliado() {
			if (this.dadosConciliados.length == 0) return 0;
			return this.dadosConciliados
				.map((conciliacao) => {
					return conciliacao.nubank.valor;
				})
				.reduce((total, valor) => {
					let floatValue = parseFloat(valor.replaceAll(".", "").replace(",", "."));
					return parseFloat(total) + floatValue;
				});
		},
		valueNaoConciliadoNu() {
			if (this.dadosNubank.length == 0) return 0;
			return this.dadosNubank
				.map((despesa) => {
					if (despesa.conciliado) return "0";
					else return despesa.valor;
				})
				.reduce((total, valor) => {
					let floatValue = parseFloat(valor.replaceAll(".", "").replace(",", "."));
					return parseFloat(total) + floatValue;
				});
		},
		valueNaoConciliadoMobills() {
			if (this.dadosMobills.length == 0) return 0;
			return this.dadosMobills
				.map((despesa) => {
					if (despesa.conciliado) return "0";
					else return despesa.valor;
				})
				.reduce((total, valor) => {
					let floatValue = parseFloat(valor.replaceAll(".", "").replace(",", "."));
					return parseFloat(total) + floatValue;
				});
		},
	},
	methods: {
		...mapMutations("conciliacao", [
			"setDadosNubank",
			"setDadosMobills",
			"pushDadosConciliados",
			"deleteConciliacao",
			"setDadosConciliados",
			"deleteDespesaNubank",
		]),
		clearDados() {
			if (this.dadosNubank.length == 0) return;

			if (this.dadosMobills.length == 0) return;

			this.setDadosNubank([]);
			this.setDadosMobills([]);
			this.setDadosConciliados([]);
			this.idNuSync = undefined;
			this.idMobillsSync = undefined;
		},
		loadNubank() {
			this.clearDados();

			let count = 0;
			let dados = this.textNubank.match(/\d{2} \D{3}\n.*/g);

			let dadosNubank = dados.map((value) => {
				value = value.split(/\n/g);
				let data = value[0];
				let [dia, mes] = data.split(" ");
				dia = dia.toString().padStart(2, "0");
				mes = nameMonthToMonth(mes).toString().padStart(2, "0");

				return {
					id: count++,
					data: moment(`2021-${mes}-${dia}`).format("DD/MM/YYYY"),
					descricao: value[1].match(/.*	/g)[0].trim(),
					valor: value[1].match(/	.*/g)[0].trim(),
					conciliado: 0,
				};
			});

			this.setDadosNubank(dadosNubank);
		},
		loadMobills() {
			this.clearDados();

			let count = 0;
			this.xlsMobills = this.xlsMobills[0];
			this.xlsMobills.splice(0, 1);
			let dadosMobills = this.xlsMobills.map((value) => {
				let [dia, mes, ano] = value[0].split("/");
				return {
					id: count++,
					moment: moment([ano, mes - 1, dia]),
					data: value[0],
					descricao: value[1],
					valor: value[3].replace("R$ ", ""),
					conciliado: 0,
				};
			});

			this.setDadosMobills(dadosMobills.reverse());
		},
		clickSyncNu(id) {
			if (this.idNuSync == id) {
				this.idNuSync = undefined;
				return;
			}
			this.idNuSync = id;
			this.pushConciliacao();
		},
		clickSyncMobills(id) {
			if (this.idMobillsSync == id) {
				this.idMobillsSync = undefined;
				return;
			}
			this.idMobillsSync = id;
			this.pushConciliacao();
		},
		pushConciliacao() {
			if (this.idNuSync != undefined && this.idMobillsSync != undefined) {
				let nubank = this.dadosNubank.find((conta) => conta.id == this.idNuSync);
				nubank.conciliado = 1;
				let mobills = this.dadosMobills.find((conta) => conta.id == this.idMobillsSync);
				mobills.conciliado = 1;
				let dadosConciliados = {
					id: this.dadosConciliados.length + 1,
					nubank: nubank,
					mobills: mobills,
				};
				this.pushDadosConciliados(dadosConciliados);
				this.idNuSync = undefined;
				this.idMobillsSync = undefined;
			}
		},
		removerConciliacao(id) {
			this.deleteConciliacao(id);
			// this.$forceUpdate();
		},
		conciliacaoAuto() {
			this.dadosNubank.map((despesa) => {
				if (despesa.conciliado) return;

				let rs = this.dadosMobills.filter((despesaMobills) => {
					if (despesaMobills.conciliado) {
						return false;
					}
					return despesa.valor == despesaMobills.valor && despesa.data == despesaMobills.data;
				});

				//"dia anterior"
				if (rs.length == 0) {
					rs = this.dadosMobills.filter((despesaMobills) => {
						if (despesaMobills.conciliado) {
							return false;
						}

						let [dia, mes, ano] = despesaMobills.data.split("/");
						let dataAnterior = moment([ano, mes - 1, dia])
							.add(-1)
							.format("DD/MM/YYYY");
						return despesa.valor == despesaMobills.valor && despesa.data == dataAnterior;
					});
				}

				// "dia anterior"
				if (rs.length == 0) {
					rs = this.dadosMobills.filter((despesaMobills) => {
						if (despesaMobills.conciliado) {
							return false;
						}

						let [dia, mes, ano] = despesaMobills.data.split("/");
						let dataPosterior = moment([ano, mes - 1, dia])
							.add(1)
							.format("DD/MM/YYYY");
						return despesa.valor == despesaMobills.valor && despesa.data == dataPosterior;
					});
				}

				// "apenas valor"
				if (rs.length == 0) {
					rs = this.dadosMobills.filter((despesaMobills) => {
						if (despesaMobills.conciliado) {
							return false;
						}

						return despesa.valor == despesaMobills.valor;
					});
				}

				if (rs.length == 1) {
					this.idNuSync = despesa.id;
					this.idMobillsSync = rs[0].id;
					this.pushConciliacao();
				}
			});
		},
	},
	async mounted() {
		await this.$nextTick();
		let input = this.$refs.inputFile.$refs.input;
		input.addEventListener("change", () => {
			this.xlsMobills = [];
			readXlsxFile(input.files[0]).then((rows) => {
				this.xlsMobills.push(rows);
				// `rows` is an array of rows
				// each row being an array of cells.
			});
		});
	},
};
</script>

<style lang="sass">
.conciliacao
	padding: 10px
	width: 100%
	height: calc( 100vh - 70px )

.conciliacao .container-dados
	width: 100%
	height: 100%
	margin: 0px
	display: flex
	justify-content: center
	overflow: auto

.conciliacao .column-dados
	height: 100%

.conciliacao .list-dados
	height: calc( 100% - 110px )
	overflow-y: auto
	overflow-x: hidden

.conciliacao span.small
	font-size: 12px

.conciliacao .selected
	border: 1px solid green

.conciliacao .conciliado
	color: green
	display: none
</style>