<template>
  <div class="home">
    <div>
      <h1>Dad Jokes API</h1>
      <h3 v-if="dadJokes.loading">Loading...</h3>
      <h3 v-if="!dadJokes.loading && dadJokes.error">{{ dadJokes.error }}</h3>
      <h3 v-if="dadJokes.data !== null">
        <h4>{{ dadJokes.data.joke }}</h4>
      </h3>
      <button @click="generateRandomJokes">Generate random jokes</button>
    </div>

    <div class="nasa">
      <h1>NASA Image Search</h1>
      <input type="text" v-model="searchKey">

        <div class="image">
          <div v-for="(image, index) in nasaImages" :key="index" class="image__container">
                <img :src="image.url" />
                <h4>{{image.caption.replace(/_/g," ")}}</h4>
          </div>
       </div>

         <h3 v-if="nasaImageSearch.loading">Loading...</h3>
         <h3 v-if="!nasaImageSearch.loading && nasaImageSearch.error">{{ nasaImageSearch.error }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

import useFetch from "../hooks/useFetch";

interface DadJokesResponseInterface {
  id: string;
  joke: string;
  status: number;
}
interface Link {
  render?: string;
  rel: string;
  href: string;
  prompt?:string;
}

interface Images {
  nasa_id: string;
  title: string;
  keywords: string[];
  media_type: string;
  description: string;
  date_created: Date;
  center: string;
  description_508: string;
  secondary_creator: string;
  photographer: string;
  location: string;
  album: string[];
}

interface Item {
  links: Link[];
  data: Images[];
  href: string;
}


interface Metadata {
  total_hits: number;
}

interface Collection {
  items: Item[];
  links: Link[];
  metadata: Metadata;
  version: string;
  href: string;
}

interface NasaImagesResponseInterface {
  collection: Collection;
}

interface NasaImageInterface{
  caption: string;
  url:  string;
}

export default defineComponent({
  name: "Home",
  setup() {
    const dadJokesUrl = computed(()=> "https://icanhazdadjoke.com/")
    let dadJokes = ref(useFetch<DadJokesResponseInterface>(dadJokesUrl));
    
    const generateRandomJokes = (): void => {
       dadJokes.value = useFetch<DadJokesResponseInterface>(
        dadJokesUrl
      );
    };

    generateRandomJokes();


    let searchKey = ref('moon')
    const nasaSearchUrl = computed(()=>`https://images-api.nasa.gov/search?q=${searchKey.value}`)
    let nasaImageSearch = ref(useFetch<NasaImagesResponseInterface>(nasaSearchUrl))

     const nasaImages = computed<NasaImageInterface[]>(() => {  
          if(nasaImageSearch.value.data){
            if(nasaImageSearch.value.data.collection.items){
               return nasaImageSearch.value.data.collection.items.reduce((items,item)=>{
                 if(item.links){
                   const image = item.links.find((link) => link.rel === 'preview')
                   if(image){
                     items.push({
                       caption : item.data[0].title,
                       url:image.href
                     })
                   }
                 }
                 return items;
              },[] as NasaImageInterface[])
            }
          }
          return [];  
     }) 


    

    return { dadJokes, generateRandomJokes ,nasaImageSearch , nasaImages ,searchKey };
  },
});
</script>
<style lang="scss">
  .nasa{
    .image{
      display:grid;
      grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
      grid-gap:2rem;
        &__container{
          display:flex;
          flex-direction: column;
          justify-content:flex-start;
          align-items:flex-start;
          width:100%;
          height:100%; 
          img{
            width:100%;
            height:15rem;
            object-fit: cover;
          }
        }
       
    }
  }
</style>
