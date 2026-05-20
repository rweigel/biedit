See TODO `marked-renderers.js/renderer.html()` for possible fix.

# Nested `divs`

**No error**
<div>
  <div>a</div>
  <div>b</div>
</div>

**With error**
<div>
  <div>a</div>
  <div>b</div>

<div>

# `img`

<img src="../test/test.svg" alt="Grid" style="width:100%"/>

Lost content

# Figure

<div>
<img src="../test/test.svg" alt="Grid" style="width:100%"/>
</div>

