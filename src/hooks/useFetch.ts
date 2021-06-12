import { ComputedRef, reactive , watchEffect} from "vue";

//interface with type T = Generic data
interface FetchStateInterface<T> {
    loading: boolean,
    error: string ,
    data: T | null
}

//function to fetch data type T = Generic data
const useFetch = <T> (url : ComputedRef<string>) => {
       
       const state =  reactive<FetchStateInterface<T>>({
            loading: false,
            error :'',
            data:null
       })

        const fetchData = async () => {
            state.loading = false;
            state.data = null
            state.error = ''
            try{
                state.loading = true
                const response = await fetch(url.value, {
                    headers : {
                        accept: 'application/json'
                    }
                })
                if(!response.ok){
                    throw Error('No data available')
                }
                const data = await response.json();
                state.data = data;
                
                console.log(state.data)
            }
            catch (error) {
               state.error = error.message
               console.log(state.error)
            }
            state.loading = false
        }

        watchEffect(() => {
           fetchData() 
        })

       return state;
}

export default useFetch