var t, dinero, faltante, tiempo_prox_llegada, tiempo_proximo_adopcion, tiempo_prox_donacion, tiempo_prox_evento;
t= dinero= faltante= tiempo_prox_llegada= tiempo_proximo_adopcion= tiempo_prox_donacion=tiempo_prox_evento=0;
var tiempo_final = 9999999;
var perros_rechazados_en_refugio, perros_rechazados_clinica, perros_atendidos;
perros_rechazados_en_refugio= perros_rechazados_clinica= perros_atendidos = 0
var calcularIntervaloArribos;

//colas
//ns_cachorros_hembra | ns_cachorros_macho | ns_adultos_hembra | ns_adultos_macho 
var colas_perros_en_refugio = [0,0,0,0]
var tiempos_comprometidos_salas_atencion = [0,0,0,0,0,0]

//cuchas totales
//cuchas_cachorro_hembra | cuchas_cachorro_macho | cuchas_adulto_hembra | cuchas_adulto_macho
var cantidad_cuchas = [10,10,10,10];


const COLA_CACHORROS_HEMBRA = 0;
const COLA_CACHORROS_MACHO = 1;
const COLA_ADULTOS_HEMBRA = 2;
const COLA_ADULTOS_MACHO = 3;

const PROBABILIDAD_CACHORRO = 0.48;
const PROBABILIDAD_CACHORRO_HEMBRA = 0.5;
const PROBABILIDAD_ADULTO_HEMBRA = 0.46;
const PORCENTAJE_ENFERMEDAD = 0.91;
const GASTOS_CACHORROS = 500;
const GASTOS_ADULTOS = 200;



function simulacion(){
 
    llegadaPerro();
    while(t < tiempo_final){
        if(tiempo_prox_llegada <= tiempo_proximo_adopcion){
            if(tiempo_prox_llegada <= tiempo_prox_donacion){
                tiempo_prox_evento = tiempo_prox_llegada;
                actualizarGastos();
                llegadaPerro();
            } else {
                donacion();
            }
        } else {
            tiempo_prox_evento = tiempo_proximo_adopcion;
                actualizarGastos();
                adopcion();
            }
        }
    let porcentaje_rechazados_por_falta_de_lugar_refugio = perros_rechazados_en_refugio / (perros_atendidos + perros_rechazados_en_refugio);
    let porcentaje_rechazados_por_falta_de_lugar_clinica = perros_rechazados_clinica / (perros_atendidos + perros_rechazados_clinica);
    let promedio_mensual_aportado = faltante / (t/30);

    console.log(`--------------------------------------`);
    console.log(`Fin de la simulacion`);
    console.log(`El total de perros atendidos fue de: ${perros_atendidos}`);
    console.log(`Porcentaje de perros rechazados por falta de alojamiento en el refugio: ${porcentaje_rechazados_por_falta_de_lugar_refugio}`);
    console.log(`Porcentaje de perros rechazados por falta de salas en la clinica: ${porcentaje_rechazados_por_falta_de_lugar_clinica}`);
    console.log(`Promedio mensual de aporte de responsable del refugio: ${promedio_mensual_aportado}`);
}

function llegadaPerro(){
    t = tiempo_prox_llegada;
    let ia = calcularIntervaloArribos();
    tiempo_prox_llegada = t + ia;
    let r1 = Math.random();
    let r2 = Math.random();
    let r3 = Math.random();
    if(r1 < PROBABILIDAD_CACHORRO){
        //ES CACHORRO
        if(r2 < PROBABILIDAD_CACHORRO_HEMBRA){
            //ES HEMBRA
            if(haySuficientesCamas(0)){
                if(r3> 0.91){
                    //ESTA ENFERMO
                    atenderEnfermo();
                }
                nuevoPerro(COLA_CACHORROS_HEMBRA);
            } else {
                rechazarPerro();
            }
        } else {
            // ES CACHORRO MACHO
          if(haySuficientesCamas(1)){
              if(r3> PORCENTAJE_ENFERMEDAD){
                  //ESTA ENFERMO
                atenderEnfermo();
              }
              nuevoPerro(COLA_CACHORROS_MACHO);
          }
        }
    } else {
        // ES ADULTO
        if(r2 < PROBABILIDAD_ADULTO_HEMBRA){
            if(haySuficientesCamas(2)){
                if(r3> PORCENTAJE_ENFERMEDAD){
                    //ESTA ENFERMO
                    atenderEnfermo();
                }
                nuevoPerro(COLA_ADULTOS_HEMBRA)
            } else {
                rechazarPerro();
            }
        } else {
            // ES ADULTO MACHO
            if(haySuficientesCamas(3)){
                if(r3> PORCENTAJE_ENFERMEDAD){
                    //ESTA ENFERMO
                    atenderEnfermo();
                }
                nuevoPerro(COLA_ADULTOS_MACHO);
                
            } else {
                rechazarPerro();
            }
        }
    }
}

function atenderEnfermo(){
    let menor_tiempo_comprometido = obtenerMenorTiempoComprometido();
    if(menor_tiempo_comprometido <= t){
        let prox_tiempo_comprometido = calcularTiempoComprometido();
        asignarNuevoTiempoComprometido(menor_tiempo_comprometido, prox_tiempo_comprometido);
    } else {
        perros_rechazados_clinica++;
    }
}

function obtenerMenorTiempoComprometido(){
    return Math.min(tiempos_comprometidos_salas_atencion);
}

function calcularTiempoComprometido(){
    let r = Math.random();
    return randomIntFromInterval(3,5);
//    return (363 * r + 121)^1/2 - 7;
}

function haySuficientesCamas(numero_cola){
    return colas_perros_en_refugio[numero_cola] < cantidad_cuchas[numero_cola];
}

function actualizarGastos(){
    let gastos_diarios = (colas_perros_en_refugio[COLA_ADULTOS_HEMBRA] + colas_perros_en_refugio[COLA_ADULTOS_MACHO])*GASTOS_ADULTOS + (colas_perros_en_refugio[COLA_CACHORROS_HEMBRA] + colas_perros_en_refugio[COLA_CACHORROS_MACHO]) * GASTOS_CACHORROS;
    dinero = dinero - (tiempo_prox_evento - t) * gastos_diarios;
    if(dinero < 0){
        faltante = faltante - dinero;
        dinero = 0;
    }
}

function donacion(){
    tiempo_prox_evento = tiempo_prox_donacion;
    let donacion = 200;
    dinero = dinero + donacion;
    actualizarGastos();
    t = tiempo_prox_donacion;
    tiempo_prox_donacion = tiempo_prox_donacion + 7;
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

var calcularIntervaloArribosComun = function(){
    //REVISAR
    let r = Math.random();
//    return 0.01467*((1-r)^(1/(-0.18553))-1)^(1/2.8288);
    return randomIntFromInterval(1,3);
}

var calcularIntervaloArribosVerano = function(){
    return 1;
}

function rechazarPerro(){
    perros_rechazados_en_refugio = perros_rechazados_en_refugio++;
}

function adopcion(){
    t = tiempo_proximo_adopcion;
    let ia = calcularIntervaloArribosAdoptante();
    tiempo_proximo_adopcion = t + ia;
    let cantidad_adoptados = calcularCantidadAdoptada();
    let r1 = Math.random();
    let r2 = Math.random();
    definirEdadYGenero(cantidad_adoptados, r1, r2);
}

function calcularIntervaloArribosAdoptante(){
    let r = Math.random();
    return randomIntFromInterval(3,7);
//    return 0.03614/(((-1) * Math.log(r))^(1/0.99254));
}

function calcularCantidadAdoptada(){
    let r = Math.random();
    if(r <0.9){
        return 1;
    } else if(r < 0.97){
        return 2;
    } else {
        return 3;
    }
}

function definirEdadYGenero(adoptados, random1, random2){
    if(random1 < 0.53){     // es adulto
        if(random2 < 0.3){     // es macho
            realizarAdopcion(adoptados, 3, random2);
        } else {        //es hembra
            realizarAdopcion(adoptados, 2, random2);
        }
    } else {        // es cachorro
        if(random2 < 0.77){      // es macho
            realizarAdopcion(adoptados, 1, random2);
        } else {
            realizarAdopcion(adoptados, 0, random2);
        }

    }
}

function realizarAdopcion(cantidad_adoptados, cola_a_restar, probabilidad_de_conformarse){
    if(colas_perros_en_refugio[cola_a_restar] > 0){   // si hay suficientes perros disponibles
        if(cantidad_adoptados > colas_perros_en_refugio[cola_a_restar]){
            cantidad_adoptados = colas_perros_en_refugio[cola_a_restar];
        }
        adoptarDe(cola_a_restar, cantidad_adoptados);
    } else {
        definirSiSeConforman(cantidad_adoptados, probabilidad_de_conformarse);
    }
}

function adoptarDe(cola, cantidad_adoptada){
    colas_perros_en_refugio[cola] = colas_perros_en_refugio[cola] - cantidad_adoptada;
}

function nuevoPerro(cola){
    colas_perros_en_refugio[cola]++;
    perros_atendidos++;
}

function definirSiSeConforman(cantidad_que_quieren_adoptar, probabilidad_de_conformarse){
    if(probabilidad_de_conformarse < 0.95){
        adopcionTipoMayoritario(cantidad_que_quieren_adoptar);
    }
}

function adopcionTipoMayoritario(cantidad_que_quieren_adoptar){
//    let lista_colas = [ns_adultos_hembra,ns_adultos_macho,ns_cachorros_hembra,ns_cachorros_macho];
    let sumatoria = colas_perros_en_refugio.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      },0);
    let max = 0;
    let cola_elegida;
    if(sumatoria > 0 ){
        for(let i=0;i<colas_perros_en_refugio.length;i++){
            if(colas_perros_en_refugio[i] >= max){
                max = colas_perros_en_refugio[i];
                cola_elegida = i;
            }
        }
    }
    adoptarDe(cola_elegida, max);
}

function parametrosDeSimulacion(){
    if(process.argv.length>3){
        cantidad_cuchas[0] = process.argv[3];
        cantidad_cuchas[1] = process.argv[4];
        cantidad_cuchas[2] = process.argv[5];
        cantidad_cuchas[3] = process.argv[6];
    } else if(process.argv.length===3){
        if(process.argv[2] == "verano"){
            calcularIntervaloArribos = calcularIntervaloArribosVerano;
        } else {
            calcularIntervaloArribos = calcularIntervaloArribosComun;
        }
    } else {
        calcularIntervaloArribos = calcularIntervaloArribosComun;
    }
}
//--------------------------------------------//
// ejecucion

parametrosDeSimulacion();
simulacion();