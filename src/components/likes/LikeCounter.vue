<!--

    *  ------------------------------------------------------------------------  *
    *  -----  LikeCounter.vue  --  /src/components/likes/LikeCounter.vue  -----  *
    *  ------------------------------------------------------------------------  *
-->

<!--
    - Componente para mostrar el contador de likes de un post
    - Componente para incrementar el número de likes de un post
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

    import { ref } from 'vue';
    import confetti from 'canvas-confetti';

    interface Props {
        postId: string;
    }

    const props = defineProps<Props>();

    console.log('props.postId => ', props.postId);


    const likeCount = ref(0);
    const likeClicks = ref(0);
    const isLoading = ref(true);


    const likePost = () => {
        
        console.log("likePost");

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


    const getCurrentLikes = async () => {
        
        const resp = await fetch(`/api/posts/likes/${props.postId}`);

        if (!resp.ok) {
            throw new Error("Failed to fetch likes");
        }

        const data = await resp.json();

        console.log('data => ', data);
        
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
