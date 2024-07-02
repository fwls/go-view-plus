import { http } from '@/api/http'
import { httpErrorHandle } from '@/utils'
import { RequestHttpEnum, ModuleTypeEnum } from '@/enums/httpEnum'

// * 列表
export const getDataSourceList = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.GET)<any>(`${ModuleTypeEnum.DATA_SOURCE}/list`, data)
    return res
  } catch (err) {
    httpErrorHandle()
  }
}

// 创建
export const createDataSource = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.POST)<any>(`${ModuleTypeEnum.DATA_SOURCE}/create`, data)
    return res
  } catch (err) {
    httpErrorHandle()
  }
}

//编辑
export const editDataSource = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.PUT)<any>(`${ModuleTypeEnum.DATA_SOURCE}/update`, data)
    return res
  } catch (err) {
    httpErrorHandle()
  }
}

//删除
export const deleteDataSource = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.DELETE)<any>(`${ModuleTypeEnum.DATA_SOURCE}/delete`, data)
    return res
  } catch (err) {
    httpErrorHandle()
  }
}

//执行
export const executeDataSource = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.POST)<any>(`${ModuleTypeEnum.DATA_SOURCE}/execute`, data)
    return res
  } catch (err) {
    httpErrorHandle()
  }
}
