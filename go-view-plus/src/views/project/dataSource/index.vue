<template>
    <div class="go-project-data-source">
        <n-space>
            <n-button type="primary" ghost @click="handleAdd">
                {{ $t('global.r_create') }}
            </n-button>
        </n-space>
        <div class="table">
            <n-data-table :columns="columns" :data="data" :bordered="false" @update:sorter="handleSorterChange" />
        </div>
        <div class="d-flex d-end" style="margin-top: 20px">
            <n-pagination :item-count="paginationReactive.itemCount" :page-sizes="paginationReactive.pageSizes"
                :on-update:page="paginationReactive.onChange" :on-update:page-size="paginationReactive.onUpdatePageSize"
                show-size-picker />
        </div>
        <add-modal ref="addModalRef" @fresh="getDataList"></add-modal>
    </div>
</template>

<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import { DataSourceItemType, DataSourceType } from './index.d'
import { NButton, NSpace, useDialog } from 'naive-ui'
import addModal from './add.vue'
import { getDataSourceList, deleteDataSource } from '@/api/path'

const dialog = useDialog()

const data = ref([])
const sorter = ref({})
const addModalRef = ref<any>(null)
const paginationReactive = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 20, 30, 50],
    itemCount: 10,
    onChange: (page: number) => {
        paginationReactive.page = page
        getDataList()
    },
    onUpdatePageSize: (pageSize: number) => {
        paginationReactive.pageSize = pageSize
        paginationReactive.page = 1
        getDataList()
    }
})

const columns = [
    {
        title: 'ID',
        key: 'id',
        sorter: 'descend'
    },
    {
        title: '名称',
        key: 'name'
    },
    {
        title: '类型',
        key: 'type'
    },
    {
        title: '地址',
        key: 'host'
    },
    {
        title: '操作',
        key: 'host',
        width: 120,
        render(row: DataSourceType) {
            const edit = h(
                NButton,
                {
                    size: 'tiny',
                    ghost: true,
                    onClick: () => { handleEdit(row) }
                },
                { default: () => window['$t']('global.r_edit') }
            )
            const del = h(
                NButton,
                {
                    size: 'tiny',
                    ghost: true,
                    type: 'error',
                    onClick: () => { handleDel(row) }
                },
                { default: () => window['$t']('global.r_delete') }
            )
            return h('div', { class: 'd-flex d-around' }, [edit, del])
        }
    }
]

const handleAdd = async () => {
    addModalRef.value.open()
}

const handleEdit = (row: DataSourceItemType) => {
    addModalRef.value.open(row)
}

const handleDel = async (row: DataSourceItemType) => {
    dialog.warning({
        title: window['$t']('global.r_warning'),
        content: window['$t']('global.r_confirm_delete'),
        positiveText: window['$t']('global.r_confirm'),
        negativeText: window['$t']('global.r_cancel'),
        onPositiveClick: async () => {
            const res = await deleteDataSource({ id: row.id })
            if (res && res.code == 200) {
                window['$message'].success(window['$t']('global.r_delete_success'))
                getDataList()
            }
        }
    })
}

const handleSorterChange = (options: any) => {
    sorter.value = options
    getDataList()
}

const getDataList = async () => {
    const params = {
        page: paginationReactive.page,
        pageSize: paginationReactive.pageSize,
        sorter: sorter.value
    }
    const res = await getDataSourceList(params)
    if (res && res.code == 200) {
        data.value = res.data
        // @ts-ignore
        paginationReactive.itemCount = res.count
    }
}

onMounted(() => {
    getDataList()
})
</script>

<style lang="scss" scoped>
@include go('project-data-source') {
    padding: 20px 20px;

    .table {
        margin-top: 1rem;
        min-height: 33rem;
    }
}
</style>: MouseEvent: MouseEvent
