<!--

    *  ------------------------------------------------------------------------------------  *
    *  -----  LikeCounterAction.vue  --  /src/components/likes/LikeCounterAction.vue  -----  *
    *  ------------------------------------------------------------------------------------  *
-->


<template>
    
    <div v-if="isLoading">
        Loading...
    </div>
    
    <button v-else-if="likeCount === 0" @click="likePost">
        Like this post
    </button>

    <button v-else @click="likePost">
        Like
        <span> {{ likeCount }} </span>
    </button>

    <p>
        Clicks: {{ likeClicks }}
    </p>

</template>



<script lang="ts" setup>


    import { ref, watch } from "vue";
    import confetti from "canvas-confetti";
    import debounce from "@/src/lib/debounce";
    import { actions } from "astro:actions";



    /**
     * -----------------------------------
     * -----  interface  -  `Props`  -----
     * -----------------------------------
     * - `props del contador de likes`
     */
    interface Props {

        /** - `id del post` */
        postId: string;
    }



    const props = defineProps<Props>();

    const likeCount = ref(0);
    const likeClicks = ref(0);
    const isLoading = ref(true);


    /**
     * -------------------------------
     * -----  ` persistLikes()`  -----
     * -------------------------------
     * Persiste clics acumulados con server action (debounced).
     */
    const persistLikes = debounce(async () => {
        
        if (isLoading.value || likeClicks.value === 0) {
            return;
        }
       
        const clicksToSave = likeClicks.value;
        likeClicks.value = 0;

        //  -----  respuesta de server action  -----
        const { data, error } = await actions.updateLikes({
            postId: props.postId,
            increment: clicksToSave,
        });

        if (error) {
            console.error("updateLikes error =>", error);
            likeClicks.value += clicksToSave;
            return;
        }

        if (data) {
            likeCount.value = data.likes;
        }

    }, 500);



    watch(likeCount, () => {
        void persistLikes();
    });


    /**
     * ---------------------------
     * -----  ` likePost()`  -----
     * ---------------------------
     * Incrementa el contador de likes y persiste en Turso.
     */
    const likePost = (): void => {
        
        likeCount.value++;
        likeClicks.value++;

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { 
                x: Math.random(),
                y: Math.random() - 0.2 }
        });
    }


    /**
     * ----------------------------------
     * -----  ` getCurrentLikes()`  -----
     * ----------------------------------
     * Obtiene el contador de likes con server action.
     * @async
     */
    const getCurrentLikes = async () => {
        
        //  -----  respuesta de server action  -----
        const { data, error } = await actions.getPostLikes(props.postId);

        if (error) {
            console.error('error => ', error);
            throw new Error(error.message);
        }

        likeCount.value = data?.likes ?? 0;
        isLoading.value = false;

    }

    void getCurrentLikes();



</script>



<style scoped>
    
    button {
        background-color: #5e51bc;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    button:hover {
        background-color: #4a3d9c;
    }

</style>
