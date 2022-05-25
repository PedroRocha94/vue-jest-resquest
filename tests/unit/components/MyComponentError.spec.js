import { flushPromises, shallowMount } from '@vue/test-utils';
import MyComponent from '../../../src/components/MyComponent';

const mockError = {
    status: 404,
    data: {
      error: 'There is nothing here.'
    }
};

jest.mock('../../../src/services/PersonService', ()=>({
    getPersons: ()=> Promise.reject(mockError)
}))

describe('MyComponentError.vue', () => {
    
    test('Simulating the get requests catch response', async ()=>{
        const wrapper = shallowMount(MyComponent, {
          data(){
            return{
              persons: []
            }
          }
        })
        expect(wrapper.vm.persons).toEqual([]);
        await wrapper.get('[data-test="requestPersons"]').trigger('click');
        await flushPromises();
        expect(wrapper.vm.persons).toEqual([]);
        
    
      })
})