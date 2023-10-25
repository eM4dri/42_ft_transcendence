
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
}