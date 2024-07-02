<template>
    <n-modal v-model:show="showModal" class="custom-card" preset="card" :style="bodyStyle" :title="title" size="small"
        :bordered="false" :segmented="segmented">
        <n-form ref="formRef" :model="model" size="small" :rules="rules" label-placement="left" label-width="auto"
            require-mark-placement="right-hanging" :style="{
                maxWidth: '640px'
            }">
            <n-form-item :label="$t('project.data_source.name')" path="name">
                <n-input v-model:value="model.name" :placeholder="$t('project.data_source.name_placeholder')" />
            </n-form-item>
            <n-form-item :label="$t('project.data_source.type')" path="type">
                <n-select v-model:value="model.type" :options="typeOptions"
                    :placeholder="$t('project.data_source.type_placeholder')" />
            </n-form-item>
            <n-form-item :label="$t('project.data_source.host')" path="host">
                <n-input v-model:value="model.host" :placeholder="$t('project.data_source.host_placeholder')" />
            </n-form-item>
            <n-form-item :label="$t('project.data_source.username')" path="username">
                <n-input v-model:value="model.username" :placeholder="$t('project.data_source.username_placeholder')" />
            </n-form-item>
            <n-form-item :label="$t('project.data_source.password')" path="password">
                <n-input v-model:value="model.password" :placeholder="$t('project.data_source.password_placeholder')" />
            </n-form-item>
            <n-form-item :label="$t('project.data_source.database')" path="database">
                <n-input v-model:value="model.database" :placeholder="$t('project.data_source.database_placeholder')" />
            </n-form-item>
            <n-form-item :label="$t('project.data_source.port')" path="port">
                <n-input-number v-model:value="model.port" :placeholder="$t('project.data_source.port_placeholder')" />
            </n-form-item>
            <n-form-item :label="$t('project.data_source.charset')" path="charset">
                <n-input v-model:value="model.charset" :placeholder="$t('project.data_source.charset_placeholder')" />
            </n-form-item>
            <n-form-item :label="$t('project.data_source.remark')" path="remark">
                <n-input v-model:value="model.remark" :placeholder="$t('project.data_source.remark_placeholder')" />
            </n-form-item>
        </n-form>
        <template #footer>
            <div class="d-flex d-end">
                <n-button ghost class="mr-5" size="small" @click="close">{{ $t('global.r_cancel') }}</n-button>
                <n-button ghost type="primary" size="small" @click="handleSubmmit">{{ $t('global.r_submmit')
                    }}</n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { createDataSource, editDataSource } from '@/api/path'
import { DataSourceItemType } from './index.d'
import { JSONParse } from '@/utils'

const emit = defineEmits(['fresh'])

const model = ref<DataSourceItemType>({
    id: 0,
    name: '',
    type: null,
    host: '',
    port: 0,
    username: '',
    password: '',
    database: '',
    charset: '',
    remark: ''
})

const title = ref('')
const formRef = ref<any>(null)
const typeOptions = [
    {
        label: 'MySQL',
        value: 'MySQL'
    },
    {
        label: 'PostgreSQL',
        value: 'PostgreSQL'
    }
]
const rules = {
    name: {
        required: true,
        trigger: ['blur', 'change'],
        message: window['$t']('project.data_source.name_placeholder')
    },
    type: {
        required: true,
        message: window['$t']('project.data_source.type_placeholder')
    },
    host: {
        required: true,
        trigger: ['blur', 'change'],
        message: window['$t']('project.data_source.host_placeholder')
    },
    username: {
        required: true,
        trigger: ['blur', 'change'],
        message: window['$t']('project.data_source.username_placeholder')
    },
    password: {
        required: true,
        trigger: ['blur', 'change'],
        message: window['$t']('project.data_source.password_placeholder')
    },
    database: {
        required: true,
        trigger: ['blur', 'change'],
        message: window['$t']('project.data_source.database_placeholder')
    },
    port: {
        type: 'number',
        required: true,
        trigger: ['blur', 'change'],
        message: window['$t']('project.data_source.port_placeholder')
    },
    charset: {
        required: true,
        trigger: ['blur', 'change'],
        message: window['$t']('project.data_source.charset_placeholder')
    }
}

const bodyStyle = ref({
    width: '600px'
})
const segmented = ref({
    content: 'soft',
    footer: 'soft'
})
const showModal = ref(false)

const open = (value: DataSourceItemType) => {
    if (value) {
        model.value = JSONParse(JSON.stringify(value))
    }
    if (model.value.id !== 0) {
        title.value = window['$t']('project.data_source.title') + window['$t']('global.r_edit')
    } else {
        title.value = window['$t']('project.data_source.title') + window['$t']('global.r_create')
    }
    showModal.value = true
}

const close = () => {
    showModal.value = false
    model.value = {
        id: 0,
        name: '',
        type: null,
        host: '',
        port: 0,
        username: '',
        password: '',
        database: '',
        charset: '',
        remark: ''
    }
}

const handleSubmmit = async (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate(async (errors: any) => {
        if (!errors) {
            if (model.value.id === 0) {
                const res = await createDataSource(model.value)
                // @ts-ignore
                if (res.code == 200) {
                    window['$message'].success(window['$t']('global.r_success'))
                    nextTick(() => {
                        close()
                    })
                }
            } else {
                const res = await editDataSource(model.value)
                // @ts-ignore
                if (res.code == 200) {
                    window['$message'].success(window['$t']('global.r_success'))
                    nextTick(() => {
                        close()
                    })
                }
            }
            emit('fresh')
        } else {
            console.log(errors)
            window['$message'].error(window['$t']('global.r_operation_fail'))
        }
    })
}

onMounted(() => {
    // @ts-ignore

})

defineExpose({ open, close })
</script>
