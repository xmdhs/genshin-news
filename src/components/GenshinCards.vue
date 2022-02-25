<template>
    <n-grid cols="3" item-responsive responsive="screen" :x-gap="12" :y-gap="8">
        <n-grid-item
            span="3 m:1"
            v-for="{ channelId, title, id, imgSrc, time } in props.card"
            :key="id"
        >
            <n-card :title="title" class="n-card" @click="onClick(id, title)">
                <template #cover>
                    <img :src="imgSrc || 'https://ys.mihoyo.com/main/_nuxt/img/37207c1.jpg'" />
                </template>
                <div class="between">
                    <span>{{ channelId2String(channelId).join(" ") }}</span>
                    <span>{{ time }}</span>
                </div>
            </n-card>
        </n-grid-item>
    </n-grid>
</template>

<script setup lang="ts">

import { gcard } from '../interface/card'
import { NCard, NGridItem, NGrid } from 'naive-ui'
import router from '../router';

const props = defineProps<{
    card: gcard[]
}>()

function channelId2String(ids: string[]): string[] {
    let result: string[] = [];
    for (let id of ids) {
        switch (id) {
            case '11':
                result.push('新闻');
                break;
            case '12':
                result.push('公告');
                break;
            case '258':
                result.push('活动');
                break;
            default:
                break;
        }
    }
    return result;
}

function onClick(id: string, title: string) {
    document.title = title
    router.push("/info/" + id)
}


</script>

<style scoped>
.n-card {
    cursor: pointer;
    height: 100%;
}

.between {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>