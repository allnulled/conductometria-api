Vue.component("windows-port", {
  name: "windows-port",
  template: $template,
  props: {
    
  },
  data() {
    return {
      alphabet: "abcdefghijklmnopqrstuvwxyz".split(""),
      is_showing_windows_port: false,
      window_component: undefined,
      active_windows: {},
    }
  },
  methods: {
    _generateId(len = 30) {
      let id = "";
      while (id.length < len) {
        id += this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
      }
      return id;
    },
    createWindow(template, generator) {
      this.$ensure({ template }).type("string");
      if(typeof generator === "undefined") {
        generator = function() {
          return {
            data() {
              return {};
            }
          };
        };
      }
      this.$ensure({ generator }).type("function");
      this.is_showing_windows_port = false;
      const componentDef = generator();
      const name = "window-port-" + this._generateId();
      Object.assign(componentDef, { name, template });
      this.$vue.component(name, componentDef);
      this.window_component = name;
      this.is_showing_windows_port = true;
      this.active_windows[name] = this.$refs.activeWindow;
      return () => {
        delete this.active_windows[name];
      };
    },
    close() {
      delete this.active_windows[this.window_component];
      this.is_showing_windows_port = false;
    }
  },
  mounted() {
    this.$logger.trace("mounted", arguments);
    this.$vue.prototype.$windowsPort = this;
  },
  unmounted() {
    this.$logger.trace("unmounted", arguments);

  }
});