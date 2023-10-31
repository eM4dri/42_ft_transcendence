
interface MyCreatedAtObject {
    createdAt: string;
    // Otras propiedades que pueda tener su objeto
}

export class DateMutations {
    public toTimeLocale(date: string){
        return new Date(date).toLocaleTimeString([],{ hour: "2-digit", minute: "2-digit", hour12: false  });
    }

    public toDayLocale(time: number):string {
        let options: {} = {};
        const today: number = Date.now();
        const daysTillToday = Math.abs((today - time) / (1000 * 60 * 60 * 24));
        if (daysTillToday >  7 ) {
            if (new Date(time).getFullYear !== new Date().getFullYear) {
                options = {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                };
            } else {
                options = {
                    day: "numeric",
                    month: "long",
                };
            }
        } else if (daysTillToday > 1 ){
            options = {
                weekday: "long"
            };
        } else if (daysTillToday === 1 ){
            return "yesterday";
        } else {
            return "today";
        }
        return new Date(time).toLocaleDateString([navigator.language], options);
    }

    public toDateMap<T extends MyCreatedAtObject>(items: T[]): Map<number,T[]> {
        let groupedItems: Map<number,T[]> = new Map<number,T[]>();
        items.forEach((item) => {
            //parsing to avoid culture problems
        const local = new Date(item.createdAt);
        const fecha = new Date (
                local.getFullYear(), local.getMonth(), local.getDate()
            ).getTime();
        if (!groupedItems.has(fecha)) {
            groupedItems.set(fecha, []);
        }
        const currentItem = groupedItems.get(fecha);
        if (currentItem !== undefined) {
            currentItem?.push(item);
            groupedItems.set(fecha, currentItem);
        }
        });
        return groupedItems;
    }

    public timeLeft(date: Date){
        const diferencia = new Date(date).getTime() - Date.now();
        const days = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diferencia % (1000 * 60)) / 1000);

        let result: string = '';

        result += (days) ? `${days} days `: '';
        result += (hours) ? `${hours} hours `: '';
        result += (minutes) ? `${minutes} minutes `: '';
        result += (seconds) ? `${seconds} seconds `: '';
        
        return result;
    }
}