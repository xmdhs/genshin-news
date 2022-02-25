export interface Ext {
    arrtName: string;
    keyId: any;
    value: any;
}

export interface List {
    contentId: string;
    channelId: string[];
    title: string;
    author: string;
    type: string;
    tag: string;
    intro: string;
    url: string;
    ext: Ext[];
    start_time: string;
    id: string;
}

export interface Data {
    total: number;
    list: List[];
}

export interface ContentList {
    retcode: number;
    message: string;
    data: Data;
}



