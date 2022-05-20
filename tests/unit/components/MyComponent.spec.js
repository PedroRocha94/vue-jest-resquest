import { flushPromises, shallowMount } from '@vue/test-utils';
import MyComponent from '../../../src/components/MyComponent';
import { getPersons, postPerson, deletePerson, deleteAll } from '../../../src/services/PersonService';

jest.mock('../../../src/services/PersonService');


describe('MyComponent.vue', () => {
  test('Checando se tem registros de pessoas', async () => {
    const mockPersons = {
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
    getPersons.mockResolvedValueOnce(mockPersons);

    const wrapper = shallowMount(MyComponent);
    await wrapper.get('[data-test="requestPersons"]').trigger('click');
    await flushPromises();
    const result = wrapper.findAll('[data-test="person"]');
    expect(result).toHaveLength(2);
  })

  test('Verificando personagme na posição 2', async () => {
    const persons = {
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
    getPersons.mockResolvedValueOnce(persons);

    let personagem = 'Personagem: Toin | Espécie: Alien';
    const wrapper = shallowMount(MyComponent);
    await wrapper.get('[data-test="requestPersons"]').trigger('click');
    await flushPromises();
    const result = wrapper.findAll('[data-test="person"]').at(2);
    expect(result.text()).toContain(personagem);
  })

  test('Adding a person', async () => {
    const mockAdd = {status: 201};
    const person = {
      id: 1,
      name: 'Pedro',
      species: 'Humano'
    }
    const mockData = {
      status: 200,
      data: {
        results: [person]
      }
    }
    postPerson.mockResolvedValueOnce(mockAdd);
    getPersons.mockResolvedValueOnce(mockData);

    const wrapper = shallowMount(MyComponent, {
      data() {
        return {
          persons: []
        }
      }
    });
    expect(wrapper.vm.persons).toHaveLength(0);
    wrapper.get('[data-test="name-person"]').setValue(person.name);
    wrapper.get('[data-test="specie-person"]').setValue(person.species);
    await wrapper.find('.form-add-person').trigger('submit');
    await flushPromises();
    expect(wrapper.vm.persons).toHaveLength(1);
    expect(wrapper.vm.persons[0].name).toEqual(person.name);
  })

  test('Delete a person', async () => {
    const mockDelete = { status: 204 };
    const mockData = {
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
    deletePerson.mockResolvedValueOnce(mockDelete);
    getPersons.mockResolvedValueOnce(mockData);

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
    const mockDeleteAll = { status: 204 };
    const mockData = {
      status: 200,
      data: {
        results: []
      }
    }
    deleteAll.mockResolvedValueOnce(mockDeleteAll);
    getPersons.mockResolvedValueOnce(mockData);

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

  
})


