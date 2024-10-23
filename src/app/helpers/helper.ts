import { AnounceEntity } from "../models/admin/nounceEntity";

export const getSiteName = () : string =>{
    let siteName = "Bailleurnet";

    return  siteName;
}

export const getExtension = (fileName : any )=> {
    console.log(fileName);
    var parts = fileName.name.split('.');
    return parts[parts.length - 1];
}

export const is_image = (fileName : string) => {
    var ext = getExtension(fileName) ;
    console.log(ext);
    
    switch (ext.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
        case 'jpeg':

        return true;
    }

    return false;
}

export const getEntityPoperties = (entity: string) : Array<string> =>{

    let results : any = []
    let entityClass : any;
    
    if (entity == "anouces") {
        entityClass = new AnounceEntity()
    }

    if (entityClass) {
        results = Object.keys(entityClass)
    }

    return entityClass ;

}