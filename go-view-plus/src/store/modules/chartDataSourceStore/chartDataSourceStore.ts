import { getDataSourceList } from '@/api/path'
import { defineStore } from 'pinia'

export const useChartDataSourceStore = defineStore('chartDataSourceStore', {
  state: () => {
    return {
      dataSourceOptions: []
    }
  },
  getters: {
    getDataSourceOptions: state => state.dataSourceOptions
  },
  actions: {
    async fetchDataSourceOptions() {
      const res = await getDataSourceList({ page: 1, pageSize: 999 })
      if (res && res.code == 200) {
        this.dataSourceOptions = []
        this.dataSourceOptions = res.data.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    }
  }
})
