<template>
  <div class="my-component">
    <h2>Resposta da requisição</h2>
    <div>
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
    };
  },
  methods: {
    async requestPersons() {
      try{
        const response = await getPersons();
        if(response){
          if (response.status === 200) {
           this.persons = response.data.results;
          }
        }
      }
      catch(error){
        if(error.status === 404){
          this.persons = [];
        }
      }
    },
    async editPerson(person) {
      try{
        const response = await putPerson(person.id, {
          name: person.name,
          species: person.species,
        });
        if(response){
          if (response.status === 200) {
            await this.requestPersons();
        }
        }
      }
      catch(error){
        
      }
    },
    async addPerson(person) {
      try{
        const response = await postPerson(person);
        if (response.status === 201) {
          await this.requestPersons();
        }else if(response.status === 404){
          console.log(response);
        }
      }
      catch(e){

      }
    },
    async removePerson(personId) {
      try{
        const response = await deletePerson(personId);
        if (response.status === 204) {
          await this.requestPersons();
        }
      }
      catch(e){

      }
    },
    async deleteAll() {
      try{
        const response = await deleteAll();
        if (response.status === 204) {
          await this.requestPersons();
        }
      }
      catch(e){

      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
