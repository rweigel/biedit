# `html`

## `render`

```html-render
<div>
  a
</div>
```

## `render-include`

## `<div/>`

```html-render-include
<div>
  a
</div>
```

## `<figure/>`

```html-render-include
<figure>
    <img
        src="code-render.svg"
        alt="Grid"
        style="width:100%"
    />
    <figcaption>
        Fig. 1 - Grid
    </figcaption>
</figure>
```

# `javascript`

## `render`

```javascript-render
// Evaluation is done with "use strict"
let a = 2
return a
```

## `render-include`

### Return value

```javascript-render-include
// Evaluation is done with "use strict"
let a = 2
return a
```

### Return promise

```javascript-render-include
let u = 'https://rweigel.github.io/phys305/figures/'
let f = 'Boundary_Value_Problems_2D_Left.svg'
let p = fetch(u+f).then(res => res.text())
return p
```

# `svg`

## ```render-include```

### Circle
```svg-render-include
<svg height="100" width="100">
    <circle cx="50" cy="50" r="40"
            stroke="black" stroke-width="3" fill="red" />
</svg>
```

### Lines 
```svg-render-include
<svg height="102" width="100%">
  <line x1="0" y1="1"   x2="100%" y2="1" stroke="black" />
  <line x1="0" y1="51"  x2="100%" y2="51" stroke="black" />
  <line x1="0" y1="101" x2="100%" y2="101" stroke="black" />
</svg>
```

### Grid

```svg-render-include
<svg height="200" width="100%">
	<g>
		<defs>
			<pattern id="grid" width="20" height="20"
			    patternUnits="userSpaceOnUse">
				<path d="M 100 0 L 0 0 0 100" 
				    fill="none"
				    stroke="black"
				    stroke-width="1.0"
				/>
			</pattern>
		</defs>
		<rect width="100%" height="100%"
		    fill="url(#grid)"
		    stroke="black"
	    />
	</g>
</svg>
```