import { BaseEntity } from './baseEntity';

export class IndexMaster extends BaseEntity{
    id:number;
    indexName: string;
    isBSE: boolean = false;
    isIndexFilter:boolean = false;

    constructor(){
        super();
    } 

    
}
