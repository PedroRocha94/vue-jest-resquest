<template>
  <div class="my-component">
    <h2>Resposta da requisição</h2>
    <div v-if="isValid">
      <ul>
        <li 
          v-for="(person, index) in persons" 
          :key="index" class="iten-person"
        >
          <span 
            data-test="person" 
            class="person"
          >
            Pessoa: {{ person.name }} | Espécie: {{ person.species }}
          </span>

          <button 
            @click="editPerson(person)" 
            data-test="edit-person"
          >
            Editar Pessoas
          </button>

          <button
            @click="removePerson(person.id)"
            data-test="remove-person"
            class="remove-person"
          >
            Remover Pessoas
          </button>
        </li>
      </ul>

      
    </div>

    <div 
      v-else
      data-test="catch-request"
    >
      <p>{{ messageError }}</p>
    </div>

    <div>
      <button 
        @click="requestPersons" 
        data-test="requestPersons"
      >
        Ver Pessoas
      </button>

      <button 
        @click="deleteAll" 
        data-test="deletAll"
      >
        Deletar Todos
      </button>
    </div>

    <form
      @submit.prevent="addPerson(person)"
      data-test="form-add-person"
      class="form-add-person"
    >
      <input
        type="text"
        v-model="person.name"
        placeholder="Nome"
        data-test="name-person"
      />
      <input
        type="text"
        v-model="person.species"
        placeholder="Especie"
        data-test="specie-person"
      />
      <button 
        type="submit" 
        data-test="addPerson"
      >
        Adicionar Pessoa
      </button>
    </form>
  </div>
</template>

<script>
import {
  getPersons,
  postPerson,
  deletePerson,
  deleteAll,
  putPerson,
} from "../services/PersonService";

export default {
  name: "MyComponent",
  data() {
    return {
      persons: [],
      person: {},
      idValid: true,
      messageError: ''
    };
  },
  methods: {
    async requestPersons() {
      const response = await getPersons();
      if (response.status === 200) {
        this.persons = response.data.results;
      }else if(response.status === 404){
        this.messageError = response.data.error;
        this.isValid = false;
      }
    },
    async editPerson(person) {
      const response = await putPerson(person.id, {
        name: person.name,
        species: person.species,
      });
      if (response.status === 200) {
        await this.requestPersons();
      }
    },
    async addPerson(person) {
      const response = await postPerson(person);
      if (response.status === 201) {
        await this.requestPersons();
      }
    },
    async removePerson(personId) {
      const response = await deletePerson(personId);
      if (response.status === 204) {
        // let index = this.personagens.findIndex(personagem => personagem.id === personagemId.id);
        // this.personagens.splice(index,1);
        await this.requestPersons();
      }
    },
    async deleteAll() {
      const response = await deleteAll();
      if (response.status === 204) {
        await this.requestPersons();
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
