# conductometria-api

API para mediciones de conducta.

## Editor en línea

Usa la API directamente desde tu dispositivo en:

- [https://allnulled.github.io/conductometria-api/index.html](https://allnulled.github.io/conductometria-api/index.html)

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
   - será automáticamente traducido a objeto con `anio`, `mes` y `dia`.
   - será automáticamente propagado a `fecha_legible`.
- `hora`: texto que sigue el formato de [@allnulled/timeformat](https://github.com/allnulled/timeformat) para horas
   - será automáticamente traducido a objeto con `hora`, `minuto`, `segundo` y `milisegundo`.
   - será automáticamente propagado a `hora_legible`.
- `duracion`: texto que sigue el formato de [@allnulled/timeformat](https://github.com/allnulled/timeformat) para duración
   - será automáticamente traducido a milisegundos.
   - será automáticamente propagado a `duracion_legible`.
- `categorias`: no hace nada de momento. Pensado para búsquedas.
- `puntos`: número que se propaga por defecto del fenómeno al estado. De fenómeno a fenómeno (o concepto a concepto) no se propaga por defecto, hay que propagarlo en el `produce` del origen.
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
cm.persistIn("test.json");
```

## Basado en open-editor

La aplicación en línea de [`allnulled@conductometria-api`](https://github.com/allnulled/conductometria-api) está basada en la aplicación de [`allnulled@open-editor`](https://github.com/allnulled/open-editor). De hecho, [`open-editor`](https://github.com/allnulled/open-editor) incorpora *innecesariamente* (es decir, *no tiene dependientes*) a [`conductometria-api`](https://github.com/allnulled/conductometria-api).