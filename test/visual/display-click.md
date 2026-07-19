# Equations, text, and markdown

Single text node

Single text    node with extra spaces

 Paragraph with one leading space

  Paragraph with two leading spaces

   Paragraph with three leading spaces
 
node 1 $node 2$ node 3 

**abcdefg** 123

1234 A<sup>abcde</sup> **abcadssdf** def 

_**abcd123**_ abcd

12345 ~abc~

**Test**: abcdef $a = 1$ `1234` abcdef **abcd** *abcd*

# LaTeX

## No extra space

{\bf abc} 123 {\it 123} {\emph 123} \textbf{abcdef} {\emph 123}

\textbf{abc} 123 \emph{123} \textbf{abcdef} \texttt{abc} 1223

\emph{123456} \texttt{123456}

## Extra space

{ \bf 123456} { \it xyz} 


*Not implemented:*

\textbf{   abcdef  }12345

# Code blocks

```
a = 1
b = 2
```

# Lists

1. 222 \textbf{222}
   2. \textbf{12334} 123


1. **222** 222
   2. 12334

# Newlines

Not implemented

**Correct**: abcdef `1234` abcdef **abcd** *abcd*
**Incorrect**: `1234` abcdef **abcd** *abcd*
**Incorrect**: abcdef **abcd** *abcd*

* **Incorrect**: abcdef $a = 1$ abcdef **abcd** *abcd*
   * **Incorrect**: abcdef $a = 1$ abcdef **abcd** *abcd*

\ifsolutions
**Incorrect positioning:** Your force and the force due to the field are both perpendicular to the direction of movement. So the work done by both forces is zero: (a) $0\text{ J}$ (b) $0\text{ J}$ (c) $0 \text{ J}$.
\else
<div style="height:4em"/>
\fi


5. **Incorrect positioning:** You move a charge.
   \ifsolutions
   **Incorrect positioning:** Your force and the force.
   \else
   <div style="height:4em"/>
   \fi

# Internal links

[#lists](#lists)