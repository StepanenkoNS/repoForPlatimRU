

export function DDBObjectToMap<T>(obj: Object):Map<string, T>{
    const map = new Map<string, T>;
    for (const [k,v] of Object.entries(obj)){
        map.set(k.toString(),v as T);
        //console.log(k,v);
    }
    return map;
}
