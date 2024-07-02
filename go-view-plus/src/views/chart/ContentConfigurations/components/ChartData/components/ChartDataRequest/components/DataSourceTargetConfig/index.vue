<template>
  <!-- 组件配置 -->
  <n-divider class="go-my-3" title-placement="left"></n-divider>
  <setting-item-box :itemRightStyle="{
    gridTemplateColumns: '6fr 2fr'
  }" style="padding-right: 25px">
    <template #name>
      地址
      <n-tooltip trigger="hover" v-if="isDev()">
        <template #trigger>
          <n-icon size="21" :depth="3">
            <help-outline-icon></help-outline-icon>
          </n-icon>
        </template>
        <ul class="go-pl-0">
          开发环境使用 mock 数据，请输入
          <li v-for="item in apiList" :key="item.value">
            <n-text type="info"> {{ item.value }} </n-text>
          </li>
        </ul>
      </n-tooltip>
    </template>
    <div style="display:  flex; justify-content: space-between;">
      <setting-item name="请求方式 & URL 地址">
        <n-select class="select-type-options" v-model:value="requestHttpType" :options="selectPostTypeOptions" />
        <!-- 组件url -->
      </setting-item>
      <setting-item name="数据源">
        <n-select class="select-type-options" v-model:value="requestDataSourceId" filterable
          :options="chartDataSourceStore.getDataSourceOptions" :loading="loading" clearable 
          @update:value="handleUpdateValue" placeholder="请选择数据源" />
      </setting-item>
      <setting-item name="更新间隔，为 0 只会初始化">
        <n-input-group>
          <n-input-number v-model:value.trim="requestInterval" class="select-time-number" min="0" :show-button="false"
            placeholder="请输入更新间隔">
          </n-input-number>
          <!-- 单位 -->
          <n-select class="select-time-options" v-model:value="requestIntervalUnit" :options="selectTimeOptions" />
        </n-input-group>
      </setting-item>
    </div>

  </setting-item-box>
  <setting-item-box name="选择方式" class="go-mt-0">
    <!-- <request-header :targetDataRequest="targetDataRequest"  :type="`sql`"></request-header> -->
    <div>
      <template v-if="requestHttpType === RequestHttpEnum.GET">
        <n-text>SQL 类型不支持 Get 请求，请使用其它方式</n-text>
      </template>
      <template v-else>
        <n-tag type="warning">需要后台提供专门处理 sql 的接口</n-tag>
        <setting-item-box name="键名">
          <n-tag type="primary" :bordered="false" style="width: 40px; font-size: 16px"> sql </n-tag>
        </setting-item-box>
        <setting-item-box name="键值">
          <monaco-editor v-model:modelValue="requestSQLContent['sql']" width="600px" height="200px" language="sql" />
        </setting-item-box>
      </template>
    </div>
  </setting-item-box>
</template>

<script setup lang="ts">
import { PropType, ref, toRefs, watch } from 'vue'
import { MonacoEditor } from '@/components/Pages/MonacoEditor'
import { SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { useTargetData } from '@/views/chart/ContentConfigurations/components/hooks/useTargetData.hook'
import { selectPostTypeOptions, selectTimeOptions } from '@/views/chart/ContentConfigurations/components/ChartData/index.d'
import { RequestConfigType } from '@/store/modules/chartEditStore/chartEditStore.d'
import { RequestHeader } from '../RequestHeader'
import { isDev } from '@/utils'
import { icon } from '@/plugins'
import {
  graphUrl,
  chartDataUrl,
  chartSingleDataUrl,
  rankListUrl,
  scrollBoardUrl,
  numberFloatUrl,
  numberIntUrl,
  textUrl,
  imageUrl,
  radarUrl,
  heatMapUrl,
  scatterBasicUrl,
  mapUrl,
  capsuleUrl,
  wordCloudUrl,
  treemapUrl,
  threeEarth01Url,
  sankeyUrl
} from '@/api/mock'
import { RequestContentTypeEnum, RequestHttpEnum } from '@/enums/httpEnum'
import { useChartDataSourceStore } from '@/store/modules/chartDataSourceStore/chartDataSourceStore'

const props = defineProps({
  targetDataRequest: Object as PropType<RequestConfigType>
})



const { HelpOutlineIcon } = icon.ionicons5
const { chartEditStore } = useTargetData()
const { requestOriginUrl } = toRefs(chartEditStore.getRequestGlobalConfig)
const { requestInterval, requestIntervalUnit, requestHttpType, requestContentType, requestDataSourceId, requestSQLContent, requestDataSourceName } = toRefs(
  props.targetDataRequest as RequestConfigType
)
requestHttpType.value = RequestHttpEnum.POST
requestContentType.value = RequestContentTypeEnum.SQL

const loading = ref(false)
const dataSourceOptions = ref([{
  label: requestDataSourceName.value,
  value: requestDataSourceId.value
}])

const chartDataSourceStore = useChartDataSourceStore()

const handleUpdateValue = (value: string, option: any) => {
  // window['$message'].info('value: ' + JSON.stringify(value))
  // window['$message'].info('option: ' + JSON.stringify(option))
  requestDataSourceName.value = option.label
}


const apiList = [
  {
    value: `【图表】${chartDataUrl}`
  },
  {
    value: `【单数据图表】${chartSingleDataUrl}`
  },
  {
    value: `【文本】${textUrl}`
  },
  {
    value: `【0~100 整数】${numberIntUrl}`
  },
  {
    value: `【0~1小数】${numberFloatUrl}`
  },
  {
    value: `【图片地址】${imageUrl}`
  },
  {
    value: `【排名列表】${rankListUrl}`
  },
  {
    value: `【滚动表格】${scrollBoardUrl}`
  },
  {
    value: `【雷达】${radarUrl}`
  },
  {
    value: `【热力图】${heatMapUrl}`
  },
  {
    value: `【基础散点图】${scatterBasicUrl}`
  },
  {
    value: `【地图数据】${mapUrl}`
  },
  {
    value: `【胶囊柱图】${capsuleUrl}`
  },
  {
    value: `【词云】${wordCloudUrl}`
  },
  {
    value: `【树图】${treemapUrl}`
  },
  {
    value: `【三维地球】${threeEarth01Url}`
  },
  {
    value: `【桑基图】${sankeyUrl}`
  },
  {
    value: `【关系图】${graphUrl}`
  }
]
</script>

<style lang="scss" scoped>
.select-time-number {
  width: 100%;
}

.select-time-options {
  width: 100px;
}

.select-type-options {
  width: 120px;
}

:deep(.select-type-options) {
  width: 13em;
}
</style>
