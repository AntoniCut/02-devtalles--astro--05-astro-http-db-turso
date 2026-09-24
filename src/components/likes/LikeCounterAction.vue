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


    interface Props {
        postId: string;
    }

    const props = defineProps<Props>();

    console.log('props.postId => ', props.postId);


    const likeCount = ref(0);
    const likeClicks = ref(0);
    const isLoading = ref(true);


    /** 
     * 
     * --------------------------
     * -----  `likesUrl()`  -----
     * --------------------------
     * URL base del API de likes
     */
    const likesUrl = (): string => {
        
        const base = import.meta.env.BASE_URL.replace(/\/$/, "");

        return `${base}/api/posts/likes/${encodeURIComponent(props.postId)}`;
    };



    /**
     * -------------------------------
     * -----  ` persistLikes()`  -----
     * -------------------------------
     * - persiste likes en Turso (debounced) 
     */
    const persistLikes = debounce((newVal: number) => {
        if (isLoading.value || likeClicks.value === 0) {
            return;
        }

        //console.log("New Likes => ", newVal);

        const clicksToSave = likeClicks.value;
        likeClicks.value = 0;

        void fetch(likesUrl(), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ likes: clicksToSave }),
        });

    }, 500);



    watch(likeCount, (newVal) => {
        persistLikes(newVal);
    });


    /**
     * ---------------------------
     * -----  ` likePost()`  -----
     * ---------------------------
     * Incrementa el contador de likes y persiste en Turso.
     */
    const likePost = async () => {
        
        console.log("likePost");

        likeCount.value++;
        likeClicks.value++;

        //  -----  implementacion de actions  -----
        const { data, error } = await actions.getGreeting({ 
            name: "John", 
            age: 30, 
            isActive: true 
        });

        if (error) {
            console.error('error => ', error);
            throw new Error(error.message);
        }

        console.log('data server actions => ', { data });



        //  -----  implementacion de confetti  -----
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
     * Obtiene el contador de likes actual desde el API.
     * @async
     */
    const getCurrentLikes = async () => {
        
        const { data, error } = await actions.getPostLikes(props.postId);

        if (error) {
            console.error('error => ', error);
            throw new Error(error.message);
        }

        console.log('data server actions => ', { data });

        likeCount.value = data.likes;
        isLoading.value = false;
        
    }


    getCurrentLikes();



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
