// extender el protroipo de array en los tipos
// es decir, un array va a tener un nuevo metodo
declare global {
    interface Array<T> {
        /**
         * 
         * Decimos que un array del tipo T(cualquier tipo) puede tener un metodo 'toSorted'
         * que tenga como parametro un funcion(compareFn) que tiene 2 parametros a y b ambos 
         * del tipo T(en nuestro caso User), compareFn devuelve un number y 
         * toSorted devuelve un array del tipo T
         */
        toSorted(compareFn?: (a: T, b: T) => number): T[]
    }
}

export interface User {
    id: bigint;
    name: string;
    lastName: string;
    characteristics: string;
}

// Para ordenar haciendo click en el encabezado de la tabla
export enum SortBy {
    NONE = 'none',
    NAME = 'name',
    LAST = 'last',
    CHARACTERISTICS = 'characteristics'
}