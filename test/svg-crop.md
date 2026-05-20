See https://stackoverflow.com/a/23698133/18433855 for cropping code. Here we would need to fetch image and insert into DOM in order to modify.

```javascript-render-include
let b = 'https://rweigel.github.io/phys305/figures/'
let p = fetch(b + 'Boundary_Value_Problems_2D_Left.svg')
        .then(response => response.text())
return p
```
