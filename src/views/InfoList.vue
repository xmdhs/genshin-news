<template>
    <n-spin v-if="!hasData">
        <n-skeleton text :repeat="10" />
        <template #description>数据加载中</template>
    </n-spin>
    <n-space vertical v-if="hasData">
        <n-input size="medium" round placeholder="正则搜索" clearable v-model:value="keyWord" />
        <div ref="listTopRef"></div>
        <n-space size="small" :align="'center'">
            <n-pagination v-model:page="page" :page-count="pageCount" :class="$style.warp" />
            <span>跳转</span>
            <n-input
                v-model:value="enterV"
                @keyup.enter="onenter"
                :placeholder="''"
                autosize
                style="min-width: 2em"
            ></n-input>
        </n-space>
        <GenshinCards :card="cards" />
        <n-space size="small" :align="'center'">
            <n-pagination v-model:page="page" :page-count="pageCount" :class="$style.warp" />
            <span>跳转</span>
            <n-input
                v-model:value="enterV"
                @keyup.enter="onenter"
                :placeholder="''"
                autosize
                style="min-width: 2em"
            ></n-input>
        </n-space>
    </n-space>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onActivated } from 'vue';
import GenshinCards from '../components/GenshinCards.vue'
import { gcard } from '../interface/card';
import { List } from '../interface/ContentList';
import { getAllContentList } from '../apis/genshin';
import { useMessage, NSkeleton, NPagination, NSpace, NInput, NSpin } from 'naive-ui'

const message = useMessage()

const cards = ref([] as gcard[]);
const page = ref(1);
const pageCount = ref(1);
const hasData = ref(false);
let data: gcard[] = [];
const keyWord = ref("");
const listTopRef = ref<Element>();

function onload() {
    document.title = "原神视频列表"
}

onActivated(onload)
onMounted(onload)

const enterV = ref("")
function onenter() {
    if (isNaN(Number(enterV.value))) {
        enterV.value = ""
        return
    }
    if (Number(enterV.value) > pageCount.value) {
        enterV.value = ""
        return
    }
    page.value = Number(enterV.value)
    enterV.value = ""
}

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
        listTopRef.value?.scrollIntoView({ behavior: "smooth" })
    })

    watch(keyWord, (key) => {
        key = key.trim()
        if (key == "") {
            oldData = []
            cards.value = data.slice(0, 30)
            pageCount.value = Math.ceil(data.length / 30) || 1
            page.value = 1
            return
        }
        if (keyF) { clearTimeout(keyF) }
        if (key) {
            keyF = setTimeout(() => {
                if (key != keyWord.value) { return }
                let keyReg: RegExp;
                try {
                    keyReg = new RegExp(key, "i")
                } catch (e) {
                    message.error(String(e), { closable: true, duration: 1500 })
                    console.warn(e)
                    return
                }
                oldData = data.filter(v => keyReg.test(v.title))
                cards.value = oldData.slice(0, 30)
                pageCount.value = Math.ceil(oldData.length / 30) || 1
                page.value = 1
            }, 200)
        }
    })
}


</script>

<style module>
.warp {
    flex-wrap: wrap;
}
</style>