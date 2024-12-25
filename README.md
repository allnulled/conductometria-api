# conductometria-api

API para mediciones de conducta.

## Instalación

```sh
npm i -s @allnulled/conductometria-api
```

## Inicio

En node.js:

```js
require("@allnulled/conductometria");
```

En HTML:

```html
<script src="node_modules/@allnulled/conductometria/dist/conductometria.js"></script>
```

Y ahora puedes:

```js
const cm = Conductometria.crear();
```

## Uso

Aquí tienes el ejemplo del test.

De momento, hay algunas propiedades mágicas:

- `concepto`: define el nombre del `fenomeno` y del `concepto` y del `estado` también.
- `fecha`: texto que sigue el formato de [@allnulled/timeformat](https://github.com/allnulled/timeformat) para fechas
- `hora`: texto que sigue el formato de [@allnulled/timeformat](https://github.com/allnulled/timeformat) para horas
- `duracion`: texto que sigue el formato de [@allnulled/timeformat](https://github.com/allnulled/timeformat) para duración
   - será automáticamente traducido a milisegundos.
- `duracion_legible`: campo sobreescrito. texto que sigue el formato de [@allnulled/timeformat](https://github.com/allnulled/timeformat) para duración
   - será automáticamente traducido a duración formateada.
- `puntos`: número que se propaga por defecto del fenómeno al estado.
- `produce`: mapa con el *concepto propagado* y la *función propagadora*. Esta función:
   - recibe coger datos de su **fenómeno causal** y de su **concepto causal**
   - retorna el nuevo fenómeno que se propaga.
   - puede retornar una lista de fenómenos que se propagan.

```js
require(__dirname + "/dist/conductometria.bundle.js");
// Ejemplo de uso
const cm = Conductometria.crear({ tracear: 1 });

cm.registrar.concepto({
  concepto: "observación",
  definicion: "El hecho de pararse a observar",
  categorias: ["tal", "cual", "pascual"],
  produce: {
    disciplina: function({puntos = 0, duracion = 0}, concepto) {
      return {
        duracion: duracion * 0.2,
        puntos: puntos * 0.2
      };
    },
    calma: function({puntos = 0, duracion = 0}, concepto) {
      return {
        duracion: this.formatear.duracion.a.tiempo(duracion || 0) * 0.2,
        puntos: puntos * 0.3
      };
    },
  }
});

cm.registrar.fenomeno({
  concepto: "observación",
  fecha: "2025/01/01",
  hora: "08:00",
  duracion: "1h",
  puntos: 100,
  matices: { clima: "soleado", intensidad: "moderada" },
});

cm.registrar.fenomeno({
  concepto: "observación",
  fecha: "2025/01/01",
  hora: "08:00",
  duracion: "1h",
  puntos: 200,
  matices: { clima: "soleado", intensidad: "moderada" },
});

cm.registrar.fenomeno({
  concepto: "observación",
  fecha: "2025/01/01",
  hora: "08:00",
  duracion: "1h",
  puntos: 300,
  matices: { clima: "soleado", intensidad: "moderada" },
});

console.log(cm.obtener.fenomenos());
console.log(cm.obtener.conceptos());
console.log(cm.obtener.estados());

console.log(cm.jsonify());
```