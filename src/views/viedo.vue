<template>
    <div id="dplayer" ref="dplayer" v-show="!loaded"></div>
    <n-spin v-if="loaded">
        <n-skeleton height="30vh" width="100%" />
        <template #description>数据加载中</template>
    </n-spin>
    <n-result status="warning" title="警告" description="此 id 没有视频" v-if="NotViedo">
        <template #footer>
            <n-space justify="center">
                <router-link to="/" style="text-decoration: none; color: inherit;">
                    <n-button>返回列表</n-button>
                </router-link>
                <a
                    :href="'https://ys.mihoyo.com/main/news/detail/' + props.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="text-decoration: none; color: inherit;"
                >
                    <n-button>到米哈游官网查看</n-button>
                </a>
            </n-space>
        </template>
    </n-result>
</template>

<script setup lang="ts">
import DPlayer, { DPlayerOptions } from 'dplayer';
import { useMessage, NResult, NButton, NSpace, NSkeleton, NSpin } from 'naive-ui';
import { ref, watchEffect, onBeforeUnmount } from 'vue';
import { getAllContentList, getViedo } from '../apis/genshin';
import { RouterLink } from 'vue-router';
import { useDB } from '../utils/indexdb';

const message = useMessage()

const NotViedo = ref(false)
const dplayer = ref<HTMLElement | null>(null)

const props = defineProps<{
    id: string
}>()

onBeforeUnmount(() => {
    adplayer?.destroy()
})

const loaded = ref(true)

let adplayer: DPlayer;

watchEffect(async () => {
    try {
        let db = await useDB()
        let v = await db.get('list', props.id)
        if (v == null) {
            let d = await getAllContentList()
            v = d.find(item => item.id == props.id)
        }
        if (v) {
            document.title = v.title
        }
        let r = await getViedo(props.id)
        if (r == "") {
            loaded.value = false
            NotViedo.value = true
            return
        }
        if (dplayer.value) {
            adplayer = newPlayer(dplayer.value, r)
        }
        loaded.value = false
    } catch (e) {
        message.error(String(e), { closable: true, duration: 0 })
        console.log(e)
        loaded.value = false
    }
})


function newPlayer(dplayer: HTMLElement, url: string) {
    let o: DPlayerOptions = {
        container: dplayer,
        video: {
            url: url,
        },
    };
    return new DPlayer(o)
}
</script>