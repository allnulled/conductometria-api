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
cm.persistIn("test.json");
```

## Tips para el editor en línea

- No tengo nada para mostrar la consola de momento.
- El `this` es el componente `open-editor` que es un proyecto no documentado todavía xD pero que está usándose en otros proyectos
- Desde el `this` puedes acceder a las APIs inyectadas vía `Vue.prototype.$*`:
- Usa el `await this.$ufs.require(file)` para importar ficheros del sistema de fichero simulado.
   - No hay ni `module.exports` ni `require`, pero puedes tirar con eso.
- Puedes acceder a `Conductometria` desde cualquier fichero.

### 1. ¿Cómo crear procesos de ventana?

Esto es un ejemplo de cómo crear un proceso de ventana:

La API de `src/components/open-editor/windows-port.js` se encarga de dejarte poder hacer:

```js
await this.$windowsPort.createWindow("Hello, window!", `
  <div>
    <div>
      <input type="text" style="width:100%;" v-model="value" />
      <div>{{ value }}</div>
      <button v-on:click="() => port.close()">Accept</button>
    </div>
  </div>
`, function() {
  return {
    props: {
      port: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        value: "Texto de la caja de texto"
      };
    }
  };
});
```

### 2. ¿Cómo crear diálogos espontáneos?

La API de `src/components/c-dialogs/c-dialogs.js` se encarga de dejarte poder hacer:

#### 2.1. Diálogo espontáneo de confirmación

```js
await this.$dialogs.confirmar({
  titulo: "Confirmación de tal",
  pregunta: "¿Estás seguro de tal?",
});
```

#### 2.2. Diálogo espontáneo de notificación

```js
await this.$dialogs.notificar({
  titulo: "Notificación de tal",
  pregunta: "Esto es una notificación de tal",
});
```

#### 2.3. Diálogo espontáneo de pedir texto

```js
await this.$dialogs.pedir_texto({
  titulo: "Pedir texto de tal",
  pregunta: "Escribe el texto de tal:",
});
```

#### 2.4. Diálogo espontáneo personalizado

```js
const respuesta = await this.$dialogs.personalizado({
  titulo: "Pedir texto de tal",
  plantilla: `<div>
    <div style="padding: 4px;">
      <div style="padding: 4px; padding-top: 0px;">Aquí pueden ir <b>componentes Vue.js v2</b></div>
      <input type="text" style="width: 100%; padding: 4px;" v-model="valor" />
    </div>
    <div style="display: flex; padding: 4px;">
      <span style="flex: 100;"></span>
      <button v-on:click="() => responder(valor).cerrar()">Aceptar</button>
      <button v-on:click="() => cerrar()" style="margin-left: 4px;">Cancelar</button>
    </div>
  </div>`,
  datos: function() {
    return {
      valor: "valor inicial"
    }
  }
});

await this.$dialogs.notificar({
  titulo: "Valor introducido desde diálogo personalizado",
  pregunta: respuesta
});
```

### 3. ¿Cómo crear un diálogo embedido?

La API de `src/components/c-dialog/c-dialog.js` se encarga de dejarte poder hacer:

```html
<c-dialog ref="notificacion_1">
    <template slot="title">
      Título del diálogo
    </template>
    <template slot="body">
        Cuerpo del diálogo
    </template>
    <template slot="bodyfooter">
        <div style="text-align: right; padding: 4px;">
            <button v-on:click="() => $refs.notificacion_1.set(true).close()">Aceptar</button>
            <button v-on:click="() => $refs.notificacion_1.close()">Cancelar</button>
        </div>
    </template>
    <template slot="footer">
        <span class="status-bar-field">Pie del diálogo</span>
    </template>
</c-dialog>
```

### 4. ¿Cuál es la diferencia entre diálogos espontáneos, diálogos embedidos y procesos de ventana?

Los diálogos embedidos son diálogos HTML5/Vue.js v2 que se pueden escribir en cualquier parte **de las plantillas** o **del html**.

Los diálogos espontáneos son diálogos también HTML5/Vue.js v2 que se pueden escribir en cualquier parte **de la lógica** o **del javascript**.

Los procesos de ventana son diálogos también HTML5/Vue.js v2 pero funcionan diferente. Se gestionan a través de un `WindowsManager`, y forman objetos `WindowProcess`, que tienen una herencia de la API de `src/external/process-interface.js` que es este proyecto:

  - [https://github.com/allnulled/process-interface/](https://github.com/allnulled/process-interface/)

La ventaja de los procesos de ventana es que su gestión puede supervisarse posteriormente. Cualquiera puede echar un `setTimeout` desde cualquier lugar y luego venga, busca. Pero de hacerlo bien, centralizamos la fábrica y proxificamos el producto.

### 5. ¿Qué otras APIs hay disponibles?

En esta parte del `src/index.js` hacemos la `global dependency injection`:

```js
Create_app: {
    const processInterface = new ProcessInterface();
    const processManager = new processInterface.ProcessManager();
    Vue.prototype.$process = {};
    Vue.prototype.$process.interface = processInterface;
    Vue.prototype.$process.manager = processManager;
    Vue.prototype.$vue = Vue;
    Vue.prototype.$dialogs = undefined;
    Vue.prototype.$ufs = undefined;
    Vue.prototype.$logger = BasicLogger.create("app", { trace: true });
    Vue.prototype.$window = window;
    Vue.prototype.$importer = importer;
    Vue.prototype.$socketio = io;
    Vue.prototype.$fetch = fetch;
    Vue.prototype.$ensure = ensure;
    Vue.prototype.$store = UniversalStore.create();
    Conflictive_point: {
        // Vue.prototype.$sqlite = new SQLitePolyfill("litestarter.main.db", "src/external/sql-wasm.wasm");
        // await Vue.prototype.$sqlite.init("litestarter.main.db", "src/external/sql-wasm.wasm");
        const dataSystem = SqliteDataSystem.create();
        Vue.prototype.$db = dataSystem.db;
        Vue.prototype.$auth = dataSystem.auth;
        Vue.prototype.$rest = dataSystem.rest;
        Vue.prototype.$ajax = fetch;
        await Vue.prototype.$db.init("litestarter.main.db", "src/external/sql-wasm.wasm");
    }
    const app = new Vue({
        render: h => h(Vue.options.components.app),
    }).$mount("#app");
}
```

Estaríamos metiendo todas estas APIs de proyectos externos:

- `@allnulled/basic-logger`: en [`Vue.prototype.$logger`](https://github.com/allnulled/basic-logger/)
- `@allnulled/browsie`: en [`Vue.prototype.$browsie`](https://github.com/allnulled/browsie)
- `@allnulled/conductometria-api`: en [`window.Conductometria`](https://github.com/allnulled/conductometria-api)
- `@allnulled/ensure`: en [`Vue.prototype.$ensure`](https://github.com/allnulled/ensure)
- `@allnulled/importer`: en [`Vue.prototype.$importer`](https://github.com/allnulled/importer)
- `@allnulled/process-interface`: en [`Vue.prototype.$process`](https://github.com/allnulled/process-interface/)
- `@allnulled/universal-file-system`: en [`Vue.prototype.$ufs`](https://github.com/allnulled/universal-file-system)
- `@allnulled/universal-store`: en [`Vue.prototype.$store`](https://github.com/allnulled/universal-store)
- `@allnulled/sqlite-data-system`: en [`Vue.prototype.$db`](https://github.com/allnulled/sqlite-data-system), [`Vue.prototype.$auth`](https://github.com/allnulled/sqlite-data-system) y [`Vue.prototype.$rest`](https://github.com/allnulled/sqlite-data-system)

E incluyendo algunas co ellos, como:

- [`sql.js`](https://sql.js.org/#/) con: `sql-wasm.js` con su `sql-wasm.wasm`
- [`beautifier.js`](https://github.com/beautifier/js-beautify?tab=readme-ov-file#web-library-1) con: `sql-wasm.js` con su `sql-wasm.wasm`

Y también incluyendo componentes Vue.js v2. Ah, y [Vue.js v2](https://v2.vuejs.org/v2/guide/). Sí, este sitio es muy importante si quieres usar esto:

- [https://v2.vuejs.org/v2/guide/](https://v2.vuejs.org/v2/guide/)

También puedes sobreentender que estaremos usando estilos de tipo `windows-7`, un clásico tonificante:

- [https://khang-nd.github.io/7.css/](https://khang-nd.github.io/7.css/)

### 6. ¿Qué comandos puedo usar en el proyecto?

En el `package.json` ahora mismo se definen estos:

```json
{
  "scripts": {
    "build": "node bundle.js",
    "create-component": "node create-component.js",
    "serve": "npx http-server -c-1 . -o",
    "reloader": "node reloader.js",
    "up": "node bundle.js && cd .. && npm run up"
  }
}
```

Para desarrollo te interesa poner 2 en funcionamiento: `npm run serve` y `npm run reloader`.

Cuando quieras preparar el entorno de producción, te interesa mirar el comando `npm run build` y los ficheros:

  - `src/bundle.components.js`: reúne todos los componentes vue.js v2 en orden para unificarlos. Saca `dist/components.{js|css}`.
     - estamos usando la API de [vuebundler](https://github.com/allnulled/vuebundler)
  - `src/bundle.css.js`: reúne todos los estilos css en orden para unificarlos. En 1 de ellos hay que poner los `dist/components.css`.
     - estamos usando la API de [htmlbundler](https://github.com/allnulled/htmlbundler) con `--wrap 0`.
  - `src/bundle.js.js`: reúne toda la lógica javascript en orden para unificarlos. En 1 de ellos hay que poner los `dist/components.js`.
     - estamos usando la API de [htmlbundler](https://github.com/allnulled/htmlbundler) con `--wrap 1`. 

No pensaba especificarlo, pero no hay un `watch` que te haga el `build`. Sería fácil de implementarlo, pero para desarrollo yo cargo los ficheros enteros por orden, es en producción que compilo con el `npm run build`. Y estaría molestando mientras desarrollo, además de ofuscando los errores. So, trabajo así, porque tiene más sentido. Y... sin... sin u... sin usar... *webpack* jej ya está, ya lo he dicho.

Lo último es usar el `npm run up` para subir más rápido los cambios.

Y seguimos. El último punto concentrado de código que destacaría, si vas a usar esto es `src/components/open-editor` donde dentro tiene varios componentes. Ahí se concentra bastante lógica también, pero ya es una API no tan genérica, mucho más específica.

Ah, bueno, y para crear componentes desde cero, tienes el comando `npm run create-component` que te pregunta y te genera el directorio y los ficheros base. Si quieres.

Sobre todo, si empiezas, es llevarte bien con `index.html` y `src/index.js`. Estos ficheros son los más clave.

### 7. ¿Qué otras APIs hay inyectadas?

Hay APIs inyectadas a posteriori, desde dentro de un componente.

En `src/components/open-editor` hay una inyección bastante destacable, que es el `require` para [`ufs`](https://github.com/allnulled/ufs). Aquí es:

```js
Vue.prototype.$ufs.require = (path, parameters = []) => {
    const filepath = Vue.prototype.$ufs.resolve_path(path);
    const filecontents = Vue.prototype.$ufs.read_file(filepath);
    const asyncExample = async function () { };
    const AsyncFunction = asyncExample.constructor;
    const filedata = new AsyncFunction(filecontents);
    return filedata.call(this, ...parameters);
};
```

Con esto podemos hacer includes de los ficheros que hay guardados por `Vue.prototype.$ufs`.

La otra API inyectada, ésta desde `src/components/open-editor/windows-port.js` es la de `WindowManager` que deriva de [`process-interface`](https://github.com/allnulled/process-interface).

```js
{
  mounted() {
    this.$logger.trace("mounted", arguments);
    this.$vue.prototype.$windowsPort = this;
  }
}
```

Inyecta `Vue.prototype.$windowsPort` globalmente en el `mounted`. Y desde aquí podemos tirar un **proceso de ventana** o **WindowProcess**.

