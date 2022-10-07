export function multiplicar(arr: Array<any>){

    //Primero aplanamos el array para quitar la profundidad
    const flated=arr.flat(Number.MAX_VALUE);    

    //Luego parseamos el array para tener números
    const parsed=flated.map(str=>{
        return Number(str);
    })

    //Sacamos el producto de todo nuestro array para luego poder dividirlo para sacar el array correcto
    const multi=flated.reduce((acc:number, y:number)=>{
        return acc*y;
    });

    //El nuevo array será el número que hemos sacado dividido por el producto
    const final=parsed.map((elem)=>{
        return Number(multi)/elem;
    })

    //Devolvemos el array final ya
    return final;


}

//Imprimimos por pantalla el resultado con un array de prueba
const array_prueba=["1",2,3,[["4"],5]];
console.log(multiplicar(array_prueba));