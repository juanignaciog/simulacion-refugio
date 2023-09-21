Para correr ejecutar en cmd:
`node app.js`

Si se ejecuta sin parametros, los valores default son 10 cuchas de cada tipo y fdp de intervalo en "comun".
Con parametros:

* Para solo modificar la fdp de intervalo de arribos a verano

`node app.js verano`
(con cualquier otro valor de parametro toma la fdp comun)

* Para modificar la cantidad de cuchas:

`node app.js verano {cantidad-cachorro-hembra} {cantidad-cachorro-macho} {cantidad-adulto-hembra} {cantidad-adulto-macho}`
