```svg-render-include
<svg height="100" width="100">
    <circle cx="50" cy="50" r="40"
            stroke="black" stroke-width="3" fill="red" />
</svg>
```

```svg-render-include
<svg height="102" width="100%">
  <line x1="0" y1="1"   x2="100%" y2="1" stroke="black" />
  <line x1="0" y1="51"  x2="100%" y2="51" stroke="black" />
  <line x1="0" y1="101" x2="100%" y2="101" stroke="black" />
</svg>
```

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