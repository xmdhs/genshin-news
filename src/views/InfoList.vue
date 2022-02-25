<template>
    <n-skeleton text :repeat="10" v-if="!hasData" />
    <n-space vertical v-if="hasData">
        <n-input
            size="medium"
            round
            placeholder="搜索"
            clearable
            autofocus
            :on-update:value="(s) => keyWord = s"
        />
        <n-pagination v-model:page="page" :page-count="pageCount" show-quick-jumper />
        <GenshinCards :card="cards" />
        <n-pagination v-model:page="page" :page-count="pageCount" show-quick-jumper />
    </n-space>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onActivated } from 'vue';
import GenshinCards from '../components/GenshinCards.vue'
import { gcard } from '../interface/card';
import { List } from '../interface/ContentList';
import { getAllContentList } from '../apis/genshin';
import { useMessage, NSkeleton, NPagination, NSpace, NInput } from 'naive-ui'

const message = useMessage()

const cards = ref([] as gcard[]);
const page = ref(1);
const pageCount = ref(1);
const hasData = ref(false);
let data: gcard[] = [];
const keyWord = ref("");

function onload() {
    document.title = "原神视频列表"
}

onActivated(onload)
onMounted(onload)

if (data.length == 0) {
    (async () => {
        try {
            const res = await getAllContentList()
            for (const item of res) {
                data.push({
                    id: item.id,
                    title: item.title,
                    channelId: item.channelId,
                    time: item.start_time,
                    imgSrc: ((item: List): string => {
                        let url = ""
                        item.ext.forEach(element => {
                            if (element.arrtName == 'banner') {
                                url = element?.value[0]?.url
                            }
                        });
                        return url
                    })(item),
                })
            }
            hasData.value = true
            cards.value = data.slice(0, 30)
            pageCount.value = Math.ceil(data.length / 30) || 1
        } catch (e) {
            message.error(String(e), { closable: true, duration: 0 })
            console.warn(e)
        }
    })()

    let oldData: gcard[] = []

    let keyF: NodeJS.Timeout;
    watch(page, (newVal) => {
        let d = oldData.length == 0 ? data : oldData
        cards.value = d.slice((newVal - 1) * 30, newVal * 30)
    })

    watch(keyWord, (key) => {
        key = key.trim()
        if (key == "") {
            oldData = []
            cards.value = data.slice(0, 30)
            pageCount.value = Math.ceil(data.length / 30) || 1
            return
        }
        if (keyF) { clearTimeout(keyF) }
        if (key) {
            keyF = setTimeout(() => {
                if (key != keyWord.value) { return }
                oldData = data.filter(v => v.title.indexOf(key) != -1)
                cards.value = oldData.slice(0, 30)
                pageCount.value = Math.ceil(oldData.length / 30) || 1
            }, 200)
        }
    })
}


</script>

<style>
.n-pagination {
    flex-wrap: wrap;
}
</style>