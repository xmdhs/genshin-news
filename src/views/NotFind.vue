<template>
    <n-result status="404" title="404 资源不存在" description="啥都没有">
        <template #footer>
            <n-button @click="route.back()">返回上一页</n-button>
        </template>
    </n-result>
</template>

<script setup lang="ts">
import { NButton, NResult } from 'naive-ui';
import { useRouter } from 'vue-router';
const route = useRouter();
</script>