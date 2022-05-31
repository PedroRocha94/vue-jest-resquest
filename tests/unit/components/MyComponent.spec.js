import { flushPromises, shallowMount } from '@vue/test-utils';
import MyComponent from '../../../src/components/MyComponent';
import { getPersons, postPerson, deletePerson, deleteAll, putPerson } from '../../../src/services/PersonService';

jest.mock('../../../src/services/PersonService');

describe('MyComponent.vue', () => {
  test('Testing receiving data', async () => {
    const mockResponseGetAllPersons = {
      status: 200,
      data: {
        results: [
          {
            name: 'Pedro',
            species: 'Humano'
          },
          {
            name: 'Cátia',
            species: 'Humano'
          }
        ]
      }
    }
    getPersons.mockResolvedValueOnce(mockResponseGetAllPersons);
    const wrapper = shallowMount(MyComponent,{
      data(){
        return{
          persons: []
        }
      }
    });
    expect(wrapper.vm.persons).toHaveLength(0);
    await wrapper.get('[data-test="requestPersons"]').trigger('click');
    await flushPromises();
    expect(wrapper.vm.persons).toHaveLength(2);
  })

  test('Checking person in position 2', async () => {
    const mockResponseGetAllPersons = {
      status: 200,
      data: {
        results: [
          {
            name: 'Pedro',
            species: 'Humano'
          },
          {
            name: 'Cátia',
            species: 'Humano'
          },
          {
            name: 'Toin',
            species: 'Alien'
          }
        ]
      }
    }
    getPersons.mockResolvedValueOnce(mockResponseGetAllPersons);

    let person = 'Pessoa: Toin | Espécie: Alien';
    const wrapper = shallowMount(MyComponent);
    await wrapper.get('[data-test="requestPersons"]').trigger('click');
    await flushPromises();
    const result = wrapper.findAll('[data-test="person"]').at(2);
    expect(result.text()).toContain(person);
  })

  test('Adding a person', async () => {
    const mockResponseAddPerson = { status: 201 };
    const mockPerson = {
      id: 1,
      name: 'Pedro',
      species: 'Humano'
    }
    const mockResponseGetAllPersons = {
      status: 200,
      data: {
        results: [mockPerson]
      }
    }
    postPerson.mockResolvedValueOnce(mockResponseAddPerson);
    getPersons.mockResolvedValueOnce(mockResponseGetAllPersons);

    const wrapper = shallowMount(MyComponent, {
      data() {
        return {
          persons: []
        }
      }
    });
    expect(wrapper.vm.persons).toHaveLength(0);
    wrapper.get('[data-test="name-person"]').setValue(mockPerson.name);
    wrapper.get('[data-test="specie-person"]').setValue(mockPerson.species);
    await wrapper.find('.form-add-person').trigger('submit');
    await flushPromises();
    expect(wrapper.vm.persons).toHaveLength(1);
    expect(wrapper.vm.persons[0].name).toEqual(mockPerson.name);
  })

  test('Delete a person', async () => {
    const mockResponseDeletePerson = { status: 204 };
    const mockResponseGetAllPersons = {
      status: 200,
      data: {
        results: [
          {
            id: 1,
            name: 'Pedro',
            species: 'Humano'
          }
        ]
      }
    }
    deletePerson.mockResolvedValueOnce(mockResponseDeletePerson);
    getPersons.mockResolvedValueOnce(mockResponseGetAllPersons);

    const wrapper = shallowMount(MyComponent, {
      data() {
        return {
          persons: [
            {
              id: 1,
              name: 'Pedro',
              species: 'Humano'
            },
            {
              id: 2,
              name: 'Cátia',
              species: 'Humano'
            }
          ]
        }
      }
    });
    const person = wrapper.findAll('.iten-person').at(1);
    person.get('[data-test="remove-person"]').trigger('click');
    await flushPromises();
    expect(wrapper.vm.persons).toHaveLength(1);
  })

  test('Delete all persons', async () => {
    const mockResponseDeleteAllPersons = { status: 204 };
    const mockResponseGetAllPersons = {
      status: 200,
      data: {
        results: []
      }
    }
    deleteAll.mockResolvedValueOnce(mockResponseDeleteAllPersons);
    getPersons.mockResolvedValueOnce(mockResponseGetAllPersons);

    const wrapper = shallowMount(MyComponent, {
      data() {
        return {
          persons: [
            {
              id: 1,
              name: 'Pedro',
              species: 'Humano'
            },
            {
              id: 2,
              name: 'Cátia',
              species: 'Humano'
            }
          ]
        }
      }
    })
    expect(wrapper.vm.persons).toHaveLength(2);
    await wrapper.get('[data-test="deletAll"]').trigger('click');
    await flushPromises();
    expect(wrapper.vm.persons).toHaveLength(0);
  })

  test('Update a person', async () => {
    const mockResponseUpdatePerson = { status: 200 };
    const mockPerson = {
      id: 1,
      name: 'Pedro',
      species: 'Humano'
    }
    const mockResponseGetAllPersons = {
      status: 200,
      data: {
        results: [mockPerson]
      }
    }
    putPerson.mockResolvedValueOnce(mockResponseUpdatePerson);
    getPersons.mockResolvedValueOnce(mockResponseGetAllPersons);

    const wrapper = shallowMount(MyComponent, {
      data() {
        return {
          persons: [
            {
              id: 1,
              name: 'Cátia',
              species: 'Alien'
            }
          ]
        }
      }
    })
    expect(wrapper.vm.persons[0].name).toEqual('Cátia');
    expect(wrapper.vm.persons[0].species).toEqual('Alien');
    const person = wrapper.findAll('.iten-person').at(0);
    wrapper.get('[data-test="name-person"]').setValue(mockPerson.name);
    wrapper.get('[data-test="specie-person"]').setValue(mockPerson.species);
    await person.get('[data-test="edit-person"]').trigger('click');
    await flushPromises();
    expect(wrapper.vm.persons[0].name).toEqual(mockPerson.name);
    expect(wrapper.vm.persons[0].species).toEqual(mockPerson.species);

  })

  test('Get requests catch response', async () => {
    const mockError = {
      status: 404,
      data: {
        error: 'There is nothing here.'
      }
    };
    getPersons.mockRejectedValueOnce(mockError)
    const wrapper = shallowMount(MyComponent, {
      data() {
        return {
          persons: []
        }
      }
    })
    expect(wrapper.vm.persons.length).toEqual(0);
    await wrapper.get('[data-test="requestPersons"]').trigger('click');
    await flushPromises();
    expect(wrapper.vm.persons.length).toEqual(0);
  })

  test('Error adding a person', async ()=>{
    const mockError = {
      status: 400,
      data: {
        error: 'Um ou mais campos estão vazios.'
      }
    }
    const mockPerson = {
      id: 1,
      name: '',
      species: 'Humano'
    }
    const mockRejectedPostPerson = {
      status: 200,
      data: {
        results: []
      }
    }
    postPerson.mockRejectedValueOnce(mockError);
    getPersons.mockResolvedValueOnce(mockRejectedPostPerson);

    const wrapper = shallowMount(MyComponent, {
      data(){
        return {
          persons: []
        }
      }
    })
    expect(wrapper.vm.persons).toHaveLength(0);
    wrapper.get('[data-test="name-person"]').setValue(mockPerson.name);
    wrapper.get('[data-test="specie-person"]').setValue(mockPerson.species);
    await wrapper.find('.form-add-person').trigger('submit');
    await flushPromises();
    expect(wrapper.vm.persons).toHaveLength(0);
  })

  test('Error delete a person', async ()=>{
    const mockError = {
      status: 400,
      data: {
        error: 'Não foi possível remover esta pessoa.'
      }
    }
    
    deletePerson.mockRejectedValueOnce(mockError);

    const wrapper = shallowMount(MyComponent, {
      data(){
        return{
          persons: [
            {
              id: 1,
              name: 'Pedro',
              species: 'Humano'
            },
            {
              id: 2,
              name: 'Cátia',
              species: 'Humano'
            }
          ]
        }
      }
    })
    expect(wrapper.vm.persons).toHaveLength(2);
    const person = wrapper.findAll('.iten-person').at(1);
    person.get('[data-test="remove-person"]').trigger('click');
    await flushPromises();
    expect(wrapper.vm.persons).toHaveLength(2);

  })

  test('Error update a person', async ()=>{
    const mockError = {
      status: 400,
      data: {
        error: 'Não foi possível editar esta pessoa.'
      }
    }
    const mockPerson = {
      id: 1,
      name: 'Pedro',
      species: 'Humano'
    }
    const mockResponseGetPersons = {
      status: 200,
      data: {
        results: [
          {
            id: 1,
            name: 'Cátia',
            species: 'Alien'
          }
        ]
      }
    }
    putPerson.mockRejectedValueOnce(mockError);

    const wrapper = shallowMount(MyComponent, {
      data() {
        return {
          persons: [
            {
              id: 1,
              name: 'Cátia',
              species: 'Alien'
            }
          ]
        }
      }
    })
    expect(wrapper.vm.persons[0].name).toEqual('Cátia');
    expect(wrapper.vm.persons[0].species).toEqual('Alien');
    const person = wrapper.findAll('.iten-person').at(0);
    wrapper.get('[data-test="name-person"]').setValue(mockPerson.name);
    wrapper.get('[data-test="specie-person"]').setValue(mockPerson.species);
    await person.get('[data-test="edit-person"]').trigger('click');
    await flushPromises();
    expect(wrapper.vm.persons[0].name).toEqual(mockResponseGetPersons.data.results[0].name);
    expect(wrapper.vm.persons[0].species).toEqual(mockResponseGetPersons.data.results[0].species);
  })
})