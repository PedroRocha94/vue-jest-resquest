import { flushPromises, shallowMount } from '@vue/test-utils';
import MyComponent from '../../../src/components/MyComponent';
import { getPersons, postPerson, deletePerson, deleteAll, putPerson } from '../../../src/services/PersonService';

jest.mock('../../../src/services/PersonService');


describe('MyComponent.vue', () => {
  test('Checando se tem registros de pessoas', async () => {
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

    const wrapper = shallowMount(MyComponent);
    await wrapper.get('[data-test="requestPersons"]').trigger('click');
    await flushPromises();
    const result = wrapper.findAll('[data-test="person"]');
    expect(result).toHaveLength(2);
  })

  test('Verificando personagme na posição 2', async () => {
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
    const mockResponseAddPerson = {status: 201};
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

  test('Update a person', async ()=>{
    const mockResponseUpdatePerson = {status: 200};
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
      data(){
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

  test('Simulating the requests catch response', async ()=>{
    const mockResponseGetCatch = {
      status: 404,
      error: 'There is nothing here.'
    };
    getPersons.mockResolvedValueOnce(mockResponseGetCatch);

    const wrapper = shallowMount(MyComponent, {
      data(){
        return{
          messageError: {}
        }
      }
    })
    expect(wrapper.vm.isValid).toBe(false);
    expect(wrapper.vm.messageError).toEqual({});
    await wrapper.get('[data-test="requestPersons"]').trigger('click');
    await flushPromises();
    expect(wrapper.vm.messageError).toEqual(mockResponseGetCatch.error);


  })
})


