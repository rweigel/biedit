
When converted to LaTeX, only `\foo` appears. This occurs because we do not put `raw` attribute in result when there is a rendering error. See comment in `marked-renderers.js/render()` for how to address.

$\foo$