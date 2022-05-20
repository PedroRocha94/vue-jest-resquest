import axios from 'axios';

export function getPersons() {
  return axios.get("https://rickandmortyapi.com/api/character")
    .then(response => {
      return response;
    })
    .catch(error => {
      return error.response;
    })
}

export function postPerson(person) {
  return axios.post("https://rickandmortyapi.com/api/character", person)
    .then(response => {
      return response;
    })
    .catch(error =>{
      return error.response;
    })
}

export function deletePerson(id){
  return axios.delete(`https://rickandmortyapi.com/api/character/${id}`)
    .then(response =>{
      return response;
    })
    .catch(error =>{
      return error.response;
    })
}

export function deleteAll(){
  return axios.delete("https://rickandmortyapi.com/api/character")
    .then(response => {
      return response;
    })
    .catch(error => {
      return error.response;
    })
}

export function putPerson(id, person){
  return axios.put(`https://rickandmortyapi.com/api/character/${id}`, person)
    .then(response => {
      return response;
    })
    .catch(error => {
      return error.response;
    })
}