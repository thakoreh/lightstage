# LightStage private concept
Static DOM-based shared light experiment. No released package, backend or external data. Materials share one pointer/light position and derive local highlight and shadow variables. Stylized rendering, not physical ray tracing.

Run `node test.cjs` and `node --check dist/app.js`. Serve dist through a static server. Keyboard: focus stage, arrow keys move light, Home resets. Pointer and touch movement controls light; page vertical scrolling remains native. Auto light is opt-in and pauses when hidden. Reduced-motion never starts automatic animation.

Browser visual QA could not complete in this environment: portable server session started, but separate local curl and cloud browser both refused loopback connections. No private access broadened to bypass this.
