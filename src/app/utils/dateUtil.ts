export class DateUtil{ 
    //from dd-MM-yyyy to yyyy-MM-dd;
    public static convertToSqlFormat(date:string): String{
        if(!date) return new Date().toString();
        return this.getDataFromddMMyyyy(date).toISOString().split('T')[0] ;
    } 

    public static  getDataFromddMMyyyy(date:string): Date{
        return new Date(date.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
    }

    public static addDays  = function(days: number, date:Date): Date{ 
        date.setDate(date.getDate() + days);
        return date;
    }

    public static addDaysFromTimeFrame (timeFrame, dateStr): String{
        let date = this.getDataFromddMMyyyy(dateStr);
        if(timeFrame == 'DAILY') { 
                date = this.addDays(-150,date);
                return date.toISOString().split('T')[0] ; 
        }

        if(timeFrame == 'WEEKLY') { 
            date = this.addDays(-354,date);
            return date.toISOString().split('T')[0] ;
        } 

        if(timeFrame == 'MONTHLY') { 
            date = this.addDays(-1200,date);
            return date.toISOString().split('T')[0] ;
        }

        if(timeFrame == 'QUOTERLY') { 
            date = this.addDays(-2000,date);
            return date.toISOString().split('T')[0] ;
        }
        return this.convertToSqlFormat('');
    } 
}
 