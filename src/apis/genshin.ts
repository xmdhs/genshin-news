import { ContentList, List } from '../interface/ContentList'
import { useDB } from '../utils/indexdb'

const cors = `https://quiet-disk-7a77.xmdhs.workers.dev`
const getContentListApi = `${cors}/https://ys.mihoyo.com/content/ysCn/getContentList?`

export async function getContentList(pageSize: number, pageNum: number, channelId: string = `10`): Promise<ContentList> {
    let u = new URLSearchParams()
    u.append(`pageSize`, pageSize.toString())
    u.append(`pageNum`, pageNum.toString())
    u.append(`channelId`, channelId)
    let res = await fetch(getContentListApi + u.toString())
    if (res.status !== 200) {
        throw new Error(`http code: ${res.status}`)
    }
    let json = await res.json() as ContentList
    if (json.retcode !== 0) {
        throw new Error(json.message)
    }
    return json
}

export async function getAllContentList(channelId: string = `10`, noCache: boolean = false): Promise<List[]> {
    let db = await useDB()
    if (!noCache) {
        let c = await db.get('total', "total")
        if (c != null) {
            let data = await getContentList(1, 1, channelId)
            if (c == data.data.total) {
                let list = await db.getAll('list')
                list.sort((a, b) => {
                    return Number(b.id) - Number(a.id)
                })
                return list
            }
        }
    }
    let res = await getContentList(2000, 1, channelId)
    let list = res.data.list
    let total = res.data.total
    let pageNum = Math.ceil(total / 2000)
    for (let i = 2; i <= pageNum; i++) {
        let res = await getContentList(2000, i, channelId)
        list = list.concat(res.data.list)
    }
    list.sort((a, b) => {
        return Number(b.id) - Number(a.id)
    })

    let tx = db.transaction(['list', 'total'], 'readwrite')
    let lists = tx.objectStore('list')
    let totals = tx.objectStore('total')
    await lists.clear()
    for (const v of list) {
        await lists.put(v)
    }
    await totals.put(total, "total")
    await tx.done
    return list
}


const getgetViedoApi = `${cors}/https://ys.mihoyo.com/main/news/detail/`
const viedoReg = /src=\\"(.*?.mp4)\\"/

export async function getViedo(id: string): Promise<string> {
    let res = await fetch(getgetViedoApi + id)
    if (res.status !== 200) {
        throw new Error(`http code: ${res.status}`)
    }
    let t = await res.text()
    let r = viedoReg.exec(t)
    if (r === null) {
        return ''
    }
    let s = '"' + r[1] + '"'
    return JSON.parse(s)
}