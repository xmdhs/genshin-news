import { ContentList, List } from '../interface/ContentList'

const cors = `https://quiet-disk-7a77.xmdhs.workers.dev`
const getContentListApi = `${cors}/https://ys.mihoyo.com/content/ysCn/getContentList?`

export async function getContentList(pageSize: number, pageNum: number, channelId: string = `10`): Promise<ContentList> {
    let u = new URLSearchParams()
    u.append(`pageSize`, pageSize.toString())
    u.append(`pageNum`, pageNum.toString())
    u.append(`channelId`, channelId)
    let res = await fetch(getContentListApi + u.toString())
    let json = await res.json() as ContentList
    if (json.retcode !== 0) {
        throw new Error(json.message)
    }
    return json
}

let data: List[] = []

export async function getAllContentList(channelId: string = `10`, noCache: boolean = false): Promise<List[]> {
    if (!noCache && data.length > 0) {
        return data
    }
    let res = await getContentList(1000, 1, channelId)
    let list = res.data.list
    let total = res.data.total
    let pageNum = Math.ceil(total / 1000)
    for (let i = 2; i <= pageNum; i++) {
        let res = await getContentList(100, i, channelId)
        list = list.concat(res.data.list)
    }
    data = list
    return list
}


const getgetViedoApi = `${cors}/https://ys.mihoyo.com/main/news/detail/`
const viedoReg = /poster=.*?src=\\"(.*?)\\" style/

export async function getViedo(id: string): Promise<string> {
    let res = await fetch(getgetViedoApi + id)
    let t = await res.text()
    let r = viedoReg.exec(t)
    if (r === null) {
        return ''
    }
    let s = '"' + r[1] + '"'
    return JSON.parse(s)
}