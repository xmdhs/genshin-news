<template>
    <n-grid cols="3" item-responsive responsive="screen" :x-gap="12" :y-gap="8">
        <n-grid-item
            span="3 m:1"
            v-for="{ channelId, title, id, imgSrc, time } in props.card"
            :key="id"
        >
            <router-link :to="'/info/' + id" :class="$style.a">
                <n-card
                    :title="title"
                    :class="$style['n-card']"
                    @click.prevent="onClick(id, title)"
                >
                    <template #cover>
                        <img :src="imgSrc || 'https://ys.mihoyo.com/main/_nuxt/img/37207c1.jpg'" />
                    </template>
                    <div :class="$style.between">
                        <div :class="$style.column">
                            <span>{{ channelId2String(channelId).join(" ") }}</span>
                            <span>{{ time }}</span>
                        </div>
                        <a
                            :href="`https://ys.mihoyo.com/main/news/detail/${id}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            :class="$style.a"
                        >
                            <n-button
                                @click.stop.prevent="open(`https://ys.mihoyo.com/main/news/detail/${id}`)"
                            >官网查看</n-button>
                        </a>
                    </div>
                </n-card>
            </router-link>
        </n-grid-item>
    </n-grid>
</template>

<script setup lang="ts">

import { gcard } from '../interface/card'
import { NCard, NGridItem, NGrid, NButton } from 'naive-ui'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()

const props = defineProps<{
    card: gcard[]
}>()

function open(url: string) {
    window.open(url, "_blank", "noreferrer=yes")
}

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

<style module>
.column {
    display: flex;
    flex-direction: column;
}

.between {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
}

.n-card {
    cursor: pointer;
    height: 100%;
}

.a{
    text-decoration: inherit;
    color: inherit;
}
</style>