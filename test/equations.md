# Inline

before $\color{red} b = 1$ middle $a=1$ after

before <span style="background-color:green">$b = 1$</span> middle $a=1$ after

<span style="background-color:green">$b = 1$</span> middle $a=1$ after

# No newlines

$$
\mathbf{A}=1\ihat
$$

\begin{equation*}
\mathbf{A}=1\ihat
\end{equation*}

\begin{equation}
\mathbf{A}=1\ihat
\end{equation}

\begin{aligned}
\mathbf{A}=1\ihat
\end{aligned}

# Block in list

1. before `$$`

   $$
   \mathbf{A}=1\ihat
   $$
   
   after `$$`

1. a $a$

   a $$
   \mathbf{A}=1\ihat
   $$ b

1. before `begin{equation*}`
   \begin{equation*}
   \mathbf{A}=1\ihat
   \end{equation*}
   after `begin{equation*}`

1. before `begin{equation}`
   \begin{equation}
   \mathbf{A}=1\ihat
   \end{equation}
   after `end{equation}`

1. before `begin{aligned}`
   \begin{aligned}
   \mathbf{A}=1\ihat
   \end{aligned}
   after `end{aligned}`

Equations should be rendered in first paragraph if `ifsoslutions` attached.

5. **Correct positioning:** You move a charge of $-3\text{ C}$ straight downward from $A$ to $D$. (a) How much work did you do? (b) How much work was done by the electric field? (c) By how much has the potential energy of the charge changed?
   \ifsolutions
   **Correct positioning:** Your force and the force due to the field are both perpendicular to the direction of movement. So the work done by both forces is zero: (a) $0\text{ J}$ (b) $0\text{ J}$ (c) $0 \text{ J}$.
   \else
   **Correct positioning:** Your force and the force due to the field are both perpendicular to the direction of movement. So the work done by both forces is zero: (a) $0\text{ J}$ (b) $0\text{ J}$ (c) $0 \text{ J}$.
   \fi


1. before
   $$
   \mathbf{A}=1\ihat
   $$

**Error:** Caused by `$$` after "before" and "after"

1. before `$$`
   $$
   \mathbf{A}=1\ihat
   $$
   after `$$`

1. before `$$`
   $$
   \mathbf{A}=1\ihat
   $$
   after `$$`

# Newlines (TODO?)

$$
\mathbf{A}=1\ihat

$$

\begin{equation*}
\mathbf{A}=1\ihat

\end{equation*}

\begin{equation}
\mathbf{A}=1\ihat

\end{equation}

\begin{aligned}
\mathbf{A}=1\ihat

\end{aligned}

# Inline

before $\mathbf{A}=1\ihat$ after

before
$
\mathbf{A}=1\ihat
$
after

before

$
\mathbf{A}=1\ihat
$

after

# `*`, `_`, and `'`

$$
A_*=B_*
$$

$$
A_**=B_**
$$

$A**=B**$

$$
A**=B**
$$

$A**=B**$

$A'=B'$

# In HTML

**Test of dealing with `<` and `<`**

<div>
$r<R$, ...  $a>b$
</div>

<div>
$$a<R,...,b<c$$
</div>

<div>
\begin{equation*}
r<R, ...  a>b
\end{equation*}
</div>

<div>
\begin{equation}
r<R, ...  a>b
\end{equation}
</div>
