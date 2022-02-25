<template>
    <div id="dplayer" ref="dplayer" v-show="!loaded"></div>
    <n-skeleton height="50vh" width="100%" v-show="loaded" />

    <n-result status="warning" title="警告" description="此 id 没有视频" v-if="NotViedo">
        <template #footer>
            <n-space justify="center">
                <n-button @click="router.go(-1)">返回列表</n-button>
                <n-button
                    @click="open('https://ys.mihoyo.com/main/news/detail/' + props.id)"
                >到米哈游官网查看</n-button>
            </n-space>
        </template>
    </n-result>
</template>

<script setup lang="ts">
import DPlayer, { DPlayerOptions } from 'dplayer';
import { useMessage, NResult, NButton, NSpace, NSkeleton } from 'naive-ui';
import { ref, watchEffect } from 'vue';
import { getAllContentList, getContentList, getViedo } from '../apis/genshin';
import router from '../router';

const message = useMessage()

const NotViedo = ref(false)
const dplayer = ref<HTMLElement | null>(null)

const props = defineProps<{
    id: string
}>()

const loaded = ref(true)

function open(url: string) {
    window.open(url)
}


watchEffect(async () => {
    try {
        let d = await getAllContentList()
        let v = d.find(item => item.id == props.id)
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
            newPlayer(dplayer.value, r)
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