import axios from 'axios';

export function getPersons() {
  return axios.get("https://rickandmortyapi.com/api/character")
}

export function postPerson(person) {
  return axios.post("https://rickandmortyapi.com/api/character", person)
}

export function deletePerson(id){
  return axios.delete(`https://rickandmortyapi.com/api/character/${id}`)
}

export function deleteAll(){
  return axios.delete("https://rickandmortyapi.com/api/character")
}

export function putPerson(id, person){
  return axios.put(`https://rickandmortyapi.com/api/character/${id}`, person)
}