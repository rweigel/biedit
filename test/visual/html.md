# Divs

**Single div with empty line after**
<div>
  a
</div>

**Single div with connected text before**

before
<div>
  in div
</div>

**Single div with connected text after**
<div>
  in div
</div>
after

**Two divs with empty line between**
<div>
  in div
</div>

<div>
  in div
</div>

**Two divs with no empty line between**
<div>
  in div 1
</div>
<div>
  in div 2
</div>

**Two divs with text between**

<div>
  in div
</div>
between
<div>
  in div
</div>

**Single div with connected html comment after**
<div>in div</div>
<!--abc-->

**Single div with connected html comment before**
<!--abc-->
<div>in div after html comment line</div>

**Single div with connected % comment before**

% abc
<div>in div after comment percent comment line</div>

<div>in div 1</div><div>
in div 2</div>after

<div>in div 1</div>text after div 1
<div>in div 2</div>

# `div` in list

10. a

   <div>
   *a*
   </div>

# Nested `divs`

<div>
  <div>a</div>
  <div>b</div>
</div>

**Empty div inside div**

<div> 
   <div>
   </div>
</div>

**Self-closing `div`, text, then empty `div`.**

<div/> abc <div></div>
<div/>abc

<div></div>

# `img`

<img src="test.svg" alt="Grid" style="width:100%"/>

# `img` in `div`

<div>
<img src="test.svg" alt="Grid" style="width:100%"/>
</div>

# `figure`

<figure>
<img src="test.svg" alt="Grid" style="width:100%"/>
<figcaption>Fig. 1 - **Grid** $a=1$</figcaption>
</figure>

# `img` followed by text

See resolved bug-028.

<img src="test.svg"/>
text

# `img` followed by percent comment

<img src="test.svg"/>
%\input{Capacitance/figures/Parallel_Plates_Example}