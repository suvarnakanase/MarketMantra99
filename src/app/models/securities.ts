import { BaseEntity } from './baseEntity';


export class Securities extends BaseEntity{
    id: number;
    ticker:string;
    exchangeType:string;
    indexId:number;
    isNiftyFifty:boolean;  
} 

