# `if` with `\if`

## `\if` and `\fi` only

### Block 

**One line**

\ifsolutions
true
\fi

**Multi line**

\ifsolutions
true 1

true 2
\fi

**Attached text before**

before
\ifsolutions
true
\fi

**Attached text after**

\ifsolutions
true
\fi
after

**With attached text before and after**

before
\ifsolutions
true
\fi
after

### Inline

\ifsolutions true \fi

\ifsolutions true \else b \fi

\ifsolutions \else b \fi

\ifsolutions true \else false \fi

\ifsolutions true \fi

\ifsolutions true

\fi

## `if/else/fi`

### Block 

**Block**

\ifsolutions
true
\else
false
\fi

**Multiline**

\ifsolutions
true1

true2
\else
false1

false2
\fi

before
\ifsolutions
true
\else
false
\fi

**With attached text after**

\ifsolutions
true
\else
false
\fi
after

**With attached text before and after**

abc
\ifsolutions
true
\else
false
\fi
123

**In list as block**

1. a

   \ifsolutions
   true
   \fi

**In list with attached text before**

1. before
   \ifsolutions
   true
   \else
   false
   \fi
   after

**In list with attached text after**

1. a

   \ifsolutions
   true
   \else
   false
   \fi
   after

**In list with attached text before and after**

1. abc
   \ifsolutions
   true
   \else
   false
   \fi
   123

**Inline**

\ifsolutions true\else false\fi

**With attached text before**

a \ifsolutions true\else false\fi b

# If with `div`

True and false in sequence are combined

<div class="solutionstrue">
true
</div>

<div class="solutionsfalse">
false
</div>

1. a

   <div class="solutionstrue">
   true
   </div>

   <div class="solutionsfalse">
   false
   </div>

   c
