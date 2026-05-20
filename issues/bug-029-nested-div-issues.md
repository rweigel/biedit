
**Indentation gets interpreted as code**

Could address this by modifying indentation so it is relative to the parent div indentation. So in the case below, the `a` would be parsed the same as if it was a ` a` (space followed by `a`).

<div> 
   <div>
      <div>
       a
      <div>
   </div>
</div>
