# Newcomb 1898

[Newcomb 1898](https://dn790009.ca.archive.org/0/items/06AstronomicalPapersPreparedForTheUse/06-Astronomical_Papers_Prepared_for_the_Use.pdf), Page 9

I. BASIS OF THE TABLES.

The elements, masses, and other data on which these tables are based are those derived in the author's work entitled _The elements of the four inner Planets and the fundamental Constants of Astronomy_, forming a supplement to the _American Ephemeris and Nautical Almanac_ for the year 1897. An ulterior correction of $-0".33 + 0".30\,T$ (1850) has been applied to the undisturbed mean longitude to balance the change in terms of long period. The variable quantities have been reduced to the epoch

1900, Jan. 0, Greenwich Mean Noon,

as the fundamental epoch of the tables. The time from this epoch, reckoned in terms of the Julian century, or 36525 days as the unit, is represented by the symbol $T$.

The following are the expressions for the principal elements of the Earth's motion around the Sun, or of the Sun's apparent motion around the Earth, as derived from the data in question.

The Sun's geometric mean longitude, freed from aberration ;

$L = 279°\;41'\;48".04 + 129\;602\;768".13\,T + 1".089\,T^2$

----
**Notes**

Is $T$ in increments of $1/36525$, or can it be fractional?

With the base angle in decimal degrees instead of degrees-minutes-seconds,

$L = 279.6966\overline{7}^\circ + 8\;640\;184^\text{s}.542\,T +  0^\text{s}.0726\,T^2$

using $279 + 41/60 + 48.04/3600 = 279 + 62701/90000 = 279.6966\overline{7}$,

$129\;602\;768".13\cdot\displaystyle\frac{1^\text{s}}{15"} = 8\;640\;184^\text{s}.542^\text{s}$
and
$1".089\cdot\displaystyle\frac{1^\text{s}}{15"} = 0.0726^\text{s}$

In terms of hour-angle (unconventional in this form because not an astronomical time, but useful for comparison
to $\tau$)

$L = 18^\text{h} \; 38^\text{m} \;47^\text{s}.2 + ...$

using

$(279 + 41/60 + 48/3600)^\circ \cdot (\text{hr}/15^\circ) = (18 + 2909/4500)^\text{h}$,

$(2909/4500)^\text{h}\cdot(60\;\text{min}/\text{hr}) = (38 \frac{59}{75})^\text{m}$, and

$(59/75)^\text{m}\cdot(60\;\text{s}/\text{min}) = (47 \frac{1}{5})^\text{s}$.

----

The Sun's mean sidereal motion in a Julian year;

$n = 1 \;295\;977".4320 - 0".000403\,T$

The longitude of the solar perigee, also freed from aberration ;

$\pi = 281°\;13'\;15".0 + 6189".03\,T + 1".63\,T^2 + 0".012\,T^3$

----
**Notes**

Or

$\pi = 281.2208\overline{3}^\circ + ...$

$\pi = 18^\text{h} 44^\text{m} 53^\text{s}.0 + ...$

using

$281 + 13/60 + 15/3600 = 281 \frac{53}{240} = 281.2208\overline{3}$,

$(281 + 13/60 + 15/3600)/15 =  (18 + 2693/3600)^\text{h}$,

$(2693/3600)\cdot60 = (44 + 53/60)^\text{m}$, and

$(53/60)\cdot 60 = 53^\text{m}$.


----

The Right Ascension of the fictitious mean Sun, affected by aberration, and so taken as to have a uniform motion in the plane of the Earth's equator corresponding to the motion of the mean Sun in longitude at the epoch 1900;

$\tau = 18^\text{h}\;38^\text{m}\;45^\text{s}.836 + 8\;640\;184^\text{s}.542\,T + 0^\text{s}.0929\,T^2$

----
**Notes**

From above, we have

$L = 18^\text{h} \; 38^\text{m} \;47^\text{s}.2 + 8\;640\;184^\text{s}.542\,T +  0^\text{s}.0726\,T^2$

Or

$\tau = 279^\circ \frac{41459}{60000} = 279.69098333333335...^\circ + ...$

$L - \tau = (279 + 41459/60000) - (279 + 62701/90000)$

$L - \tau = (41/7200)^\circ = 20.5"$ (exactly).

On page 12, Newcomb (1898) gives a value $20".501 = 0.005\;694\;722\;...^\circ$ for aberration.


The first terms differs from that in $\tau$ because of aberration. The second terms match. Why don't the third terms match?

From USNO 1961 page 22: "_The Besselian solar year_. For certain applications it is more convenient to measure time in units of tropical centuries of 3652.21988 ephemeris days, the fundamental epoch being the beginning of the Besselian (fictitious) solar year
1900.0, or 1900 January 0$^\text{d}$·813 E.T. In the great majority of such cases the
difference in length of the century is not significant: the same symbol $T$ is accordingly used, though always with a specific explanation. The difference between the lengths of the Besselian solar year and the tropical year ($0^\text{s}.148\;T$) can always be neglected and multiples of 0.01 in $T$ thus relate to the beginning of the corresponding Besselian year (see section 2B)."

**Given formulas:**

$$L = 279^\circ 41' 48.04'' + 129\,602\,768.13''\,T + 1.089''\,T^2$$

$$\tau = 18^h 38^m 45.836^s + 8\,640\,184.542^s\,T + 0.0929^s\,T^2$$

**Linear term**:

$8\,640\,184.542^s \times 15"/1^\text{s} = 129\,602\,768.13''$ (exact match)

**Quadratic term**

Convert $\tau$'s $T^2$ term to arcseconds:

$0^\text{s}.0929 \times 15"/1^\text{s} = 1.3935"$

$\Delta = 1.3935" - 1.089" = 0.3045" = 0.0203^\text{s}$

This is documented in the *Explanatory Supplement to the Ephemeris* as the **"excess of the secular acceleration of the right ascension of the fictitious mean sun over the mean longitude of the Sun,"** and manifests as the Besselian year being shorter than the tropical year by:

$$\delta_{year} \approx 0.148^s \, T$$

(a linear-in-$T$ effect, consistent with being the time-derivative of a $T^2$ position offset, since $\dfrac{d}{dT}\!\left(k\,T^2\right) = 2kT$).


----

The beginning of the solar year 1900, known also as the BESSELIAN fictitious year ; defined as the moment when the Right Ascension of the fictitious mean sun is 280°;

1900\. January $0^\text{d}.3135$, Greenwich Mean Time.

The Earth's mean anomaly ;

$g = 358^\circ\;28'\;33".0 + 129\;596\;579.10"\,T - 0".54\,T^2 - 0".012\,T^3$

The eccentricity of the Earth's orbit;

$e = 0.016\;751\;04 - .000\;041\;80T - .000\;000\;126\,T^2$

$\phantom{e} = 3455".150 - 8".621\,T - 0".0260\,T^2$

`Page 10`

The obliquity of the ecliptic;

$\epsilon = 23^\circ\;27'\;8".26 - 46".845\,T - 0".0059\,T^2 + 0".001\;81T^2$

# [HMNO 1961]()

`Page 73`

3\. Universal time

Universal time is the precise measure of time used as the basis for all civil time-keeping; it conforms with a very close approximation of the mean diural motion of the Sun. $^*$

$^*$See note on page vi regarding the current basis of civil time scales. In genral the term "universal time" (U.T.) may be identified throughout this Supplement with the system of U.T.I defined on page 86.

It is, and since the introduction of Newcomb's _Tables of the Sun_ has been, defined as 12 hours $+$ the Greenwich hour angle of a point on the equator whos right ascention, measured from the mean equinox of date, is:
...

$R_\text{U} = 18^\text{h}\; 38^\text{m}\; 45^\text{s}.836 + 8640184^\text{s}.542\;T_U + 0\text{s}.0929\;T_U^2$

where $T_U$ is the number of Julian centuries of 36525 days of universal time elapsed since the epoch of Greenwich mean noon (regarded as 12$^\text{h}$ U.T.) on 1900 January 0. The expression for $R_U$ is identical with that given by Newcomb (_Tables of the Sun, A.P.A.E._, **6**, part I, page 9, 1895) for the right ascension of the fictious mean sun, with the exception that Newcomb used $T$ instead of $T_U$ and did not specify in what measure of time $T$ was to be reconed. Newcomb, not recognising the variable rotation of the Earth, considered that $T$ was measured in mean solar time applicable alike to orbital motions and to hour angles; as explained in sub-section B.I, Newcomb's $T$ may now be identified with ephemeris time. The poin on the equator whose right ascension is $R_U$ is not identical with the "fictitious mean sun" as defined by Newcomb; the right ascension of the fictitious mean sun is:

$R_\text{U} = 18^\text{h}\; 38^\text{m}\; 45^\text{s}.836 + 8640184^\text{s}.542\;T_\text{E} + 0\text{s}.0929\;T_\text{E}^2$

where $T_\text{E}$ is the number of Julian centuries of 36525 days of ephemeris time elapsed since the epoch of $12^\text{h}$ E.T. on 1900 January 0. $R_\text{E}$ differs from $R_\text{U}$ by $0.002738\; \Delta T$, where $\Delta T$ is the difference E.T. $-$ U.T.

The implications of this distinction are considered in sub-section B.4.

The measure of universal time at time $T_U$, expressed in hours, minutes, and seconds, is thus:

12$^\text{h} + $ the Greenwich hour angle of the mean equinox of date $-R_U$

The date expressed in teh form either of a calendar date or of a Julian date (see sub-section B.I), is that corresponding to the time $T_U$.

...

Greenwich men sidereal time = U.T. $+$  $R_U$ $+$ $12^\text{h}$

for $0^\text{h}$ U.T. of every day; at U.T. = $0^\text{h}$ the value of the right-hand side is obtainedby adding $12^\text{h}$ to the expression $R_\text{U}$ for the mean sidereal time of $12^\text{h}$ U.T., and the relation becomes

G.M.S.T of $0^\text{h}$ U.T. = $6^\text{h}\; 38^\text{m}\; 45^\text{s}.836 + 86\;40184^\text{s}.542 T_\text{U} + 0^\text{s}.0929T_\text{U}^2$
where $T_\text{U}$ takes on successive values at a uniform interval of $1/36525$.

...

# [Russell 1971](https://drive.google.com/drive/folders/1AkyaDdOa2sDiEX8QrMjUNMMoSGzLrKS1)

Appendix 2. The Calculation of the Position of the Sun

G.D. Mead (private communication) has written a simple subroutine to calculate the position of the Sun in GEI coordinates. It is accurate for years 1901 through 2099, to within 0.006 deg. The input is the year, day of year and seconds of the day in UT. The output is Greenwich Mean Sidereal Time in degrees, the ecliptic longitude, apparent right ascension and declination of the Sun in degrees. The listing of this program follows. We note that the cartesian coordinates of the vector from the Earth to the Sun are:

```
X = cos(SRASN) cos(SDEC)
Y = sin(SRASN) cos(SDEC)
Z = sin(SDEC)
```

```fortran
    SUBROUTINE SUN(IYR, IDAY, SECS, GST, SLONG, SRASN, SDEC)
  C PROGRAM TO CALCULATE SIDEREAL TIME AND POSITION OF THE SUN.
  C GOOD FOR YEARS 1901 THROUGH 2099. ACCURACY 0.006 DEGREE.
  C INPUT IS IYR, IDAY (INTEGERS), AND SECS, DEFINING UN. TIME.
  C OUTPUT IS GREENWICH MEAN SIDEREAL TIME (GST) IN DEGREES,
  C LONGITUDE ALONG ECLIPTIC (SLONG), AND APPARENT RIGHT ASCENSION
  C AND DECLINATION (SRASN, SDEC) OF THE SUN, ALL IN DEGREES
    DATA RAD /57.29578/
    DOUBLE PRECISION DJ, FDAY
    IF(IYR. LT. 1901. OR. IYR. GT. 2099) RETURN
    FDAY = SECS/86400
    DJ = 365* (IYR-1900) + (IYR-1901)/4 + IDAY + FDAY -0.5D0 
    T = DJ / 36525
    VL = DMOD (279.696678 + 0.9856473354*DJ, 360.D0)
    GST = DMOD (279.690983 + 0.9856473354*DJ + 360.*FDAY + 180., 360.D0)
    ...
```

----
**Notes**

The code above also appears in Geopack-2008.

On `IYEAR = 1900`, `IDAY = 1`, `FDAY = 0.5`, `DJ = 0`, so

```
GST = (279.690983 + 360.0*0.5 + 180.0) % 360.0
GST = (279.690983 + 360.0) % 360.0
GST = 279.690983
```

[Newcomb 1898](https://dn790009.ca.archive.org/0/items/06AstronomicalPapersPreparedForTheUse/06-Astronomical_Papers_Prepared_for_the_Use.pdf) page 9 gives "the Right Ascension of the fictitious mean Sun, affected by aberration", as

$\tau = 18^\text{h}\;38^\text{m}\;45^\text{s}.836 + 8\;640\;184^\text{s}.542T + 0.0929\,T^2$

where $T$ is the number the number of Julian centuries of 36525 days since 1900, Jan 0, Greenwich Mean Noon. This can be written as

$\tau = 279.69098333333335...° + (8640184^\text{s}.542)\frac{15^\circ}{3600\text{ s}}\;T + 0^\text{s}.0929T^2$

$\phantom{\tau} = 279.69098333333335...° + (36000.7689249999966705...^\circ)\;T + 0^\text{s}.0929T^2$

Using $T=$ `DJ`$/36525$ gives

$\tau = 279.69098333333335...° + (0.9856473353867213...^\circ)$`DJ`$ + 0^\text{s}.0929T^2$

which matches

```
GST = 279.690983 + 0.9856473354*DJ
```

to the precision used in `GST` and if the $T^2$ is ignored.

When `T = 0`, corresponding to 1900, Jan. 0, Grenwich Mean Noon `𝜏 = 279.69098333333335...°`, which matches the R71 value `279.690983` to the precision given even though the R71 equation is said to be valid for only `iyear > 1901`).

----

# [Hapgood 1992](https://drive.google.com/drive/folders/1AkyaDdOa2sDiEX8QrMjUNMMoSGzLrKS1)

Section 3.1

All of the fundamental transformations defined in the following sections are time dependent. To maintain a uniform style, time is there specified by modified Julian date ($\text{MJD}$), which is the time measured in days from 00:00 $\text{UT}$ on 17 November 1858 (Julian date $2400000.5$). In this paper we use only the integer part of MJD, i.e. the value at 00:00 $\text{UT}$ on the day of interest. For some applications it is also necessary to give the time within the day as Universal Time in hours ($\text{UT}$).

Section 4.1

The rotation angle $\theta$ is the Greenwich mean sidereal time. This can be calculated using the following formula (U.S. Naval Observatory, 1989):

$\theta = 100.461 + 36000.770\;T_0 + 15.04107\;\text{UT}$,

where

(3) $\quad$ $T_0 = \displaystyle\frac{\text{MJD} - 51544.5}{36525.0}$.

Note that $T_0$ is the time in Julian centuries (36525 days) from 12:00 $\text{UT}$ on 1 January 2000 (known as epoch 2000.0) to the previous midnight.

----
**Notes**

1\.

In Hapgood (1992) $\text{UT}$ has to meanings: 1. Universal Time and 2. the fractional hour of the
day. In the following equations $\text{UT}$ should be read $UT$ (similar to notation used in USNO 1989).

2\.

[U.S. Naval Observatory, 1989](https://drive.google.com/file/d/16p5o-hhDLoiUSAbX0PSWShQ0Mvc7W5g3/view?usp=sharing) does not give the Hapgood (1992) equation for $\theta$ explicitly. It gives, on page B2, eqn 2:

$\text{GMST} = 6^\text{h}.69737456 + 2400.051336\;T_0 + 0.0000258622\;T_0^2 + 1.002737909\;UT$

[note the missing dimensions on the last three coefficients] with definitions on page B3:

$T_0$ and $T$ are time intervals in Julian centuries from J2000.0:

$\quad T_0 = (\text{JD}_0 - 2451545.0) / 36525$ $\quad$  $T = (\text{JD} - 2451545.0) / 36525$;

$UT$ is the universal time in hours;

$\text{JD}_0$ and $\text{JD}$ are the Julian dates at $0^\text{h}$ $\text{UT}$ and at an arbitrary time of the day, respectively;

Converting to degrees using

```
15*6.69737456 = 100.4606184

15*2400.051336 = 36000.77004

15*0.0000258622 = 0.000387933

15*1.002737909 = 15.041068635
```

gives

$\text{GMST} = 100.4606184^\circ + (36000.77004^\circ)\;T_0 + 0.000387933^\circ\;T_0^2 + (15.041068635^\circ)\;\text{UT}$

and Hapgood (1992) is

$\theta = 100.461 + 36000.770\;T_0 + 15.04107\;\text{UT}$

3\.

$\theta$ in Hapgood (1992) follows from Eqn 12.3 for $\Theta_0$ in [Meeus (1998)](https://drive.google.com/file/d/1vFTXBqhPbiMGgpG5qOTnWLTVOnibU9S0/view?usp=sharing):

$\Theta_0 = 100.46061837^\circ + 36000.770053608\;T + 0.000387933\;T^2 - T^3/38710000$

with $T = (\text{JD}-2451\;545.0)/36525$. This equation in Meeus (1998) is followed by the statement "... To obtain the sidereal time $\theta_0$ at Greenwich for any instant UT of a given date, multiply that instant by $1.002\;737\;909\;35$ and add the result to the sidereal time $\Theta_0$ at $0^\text{h}$ $\text{UT}$."

Doing so gives

$\theta_0 = 100.46061837^\circ + 36000.770053608\;T + 0.000387933\;T^2 - T^3/38710000 + (15.0410686402499998...)\;\text{UT}$

where $15\cdot 1.00273790935 = 15.0410686402499998...$ was used. Eqn 3 for $\theta$ in Hapgood (1992) has the same constants as $\theta_o$ rounded to the nearest $0.001$ degree and the $T^2$ and $T^3$ terms omitted.

# [Meeus (1998)](https://drive.google.com/file/d/1vFTXBqhPbiMGgpG5qOTnWLTVOnibU9S0/view?usp=sharing)

`Chapter 12`

We shall denote by $\Theta_0$ the sidereal time at Greenwich at $0^\text{h}$ UT of a given date, and by $\theta_0$ the sidereal time at Greenwich for any given instant UT.

The sidereal time at the meridian of Greenwich, at $0^\text{h}$ Universal Time of a given date, can be obtained as follows.

Calculate the JD corresponding to that date at $0^\text{h}$ $\text{UT}$ (Chapter 7). Thus, this is a number ending on $.$5. Then find $T$ by

(12.1) $\quad$ $T = \displaystyle\frac{\text{JD} - 2451\;545.0}{36525}$

The _mean_ sidereal time at Greenwich at $0^\text{h}$ $\text{UT}$ is then given by the following expression which was adopted in 1982 by the International Astronomical Union:

 (12.2) $\quad$ $\Theta_0 = 6^\text{h}41^\text{m}50^\text{s}.54841 + 8640\;184^\text{s}.812\;866\;T + 0^\text{s}.093\;104\;T^2 - 0^\text{s}.000\;0062\;T^3$

Expressed in degrees and decimals, this formula can be written

 (12.3) $\quad$ $\Theta_0 = 100.460\;618\;37 + 36000.770\;053\;608\;T + 0.000\;387\;933\;T^2 - T^3/38\;710\;000$

Important: the formulae (12.2) and (12.3) are valid only for those values of $T$ which correspond to $0^\text{h}$ $\text{UT}$ of a date. All other values would give incorrect results.

To obtain the sidereal time $\theta_0$ at Greenwich for any instant $\text{UT}$ of a given date, multiply that instant by $1.002\;737\;909\;35$ and add the result to the sidereal time $\Theta_0$ at $0^\text{h}$ $\text{UT}$.

The mean sidereal time at Greenwich, expressed in _degrees_, can also be found directly for any instant as follows. If JD is the Julian Day corresponding to that instant in $\text{UT}$ (not necessarily $0^\text{h}$), find $T$ by formula (12.1), and then

(12.4) $\quad$ $\theta_0 = 280.460\;618\;37 + 360.985\;647\;366\;29\;(\text{JD} - 2451\;545.0) + 0.000\;387\;933\;T^2 - T^3/38 710 000$ 

----
**Notes**

From the notes for Hapgood (1992), we can write

$\theta_0 = 100.46061837^\circ + 36000.770053608\;T + 0.000387933\;T^2 - T^3/38710000 + (15.0410686402499998...)\;\text{UT}$

----

# [Hapgood 1995]()

Section 3

The Russell (1971) paper is more complex. GST and $\lambda_{\odot}$ are given by the Fortran subroutine in his Appendix 2. The statements in that routine are functionally equivalent to the equations in Hapgood (1992) and thus yield values in the mean epoch-of-date.
...

However, the values of GST and $\lambda_{\odot}$ predicted by Russell agree with those of Hapgood (1992) to within $0.01^\circ$.

# [Fränz and Harper (2002)](https://drive.google.com/file/d/1-GvR6sbPC-pkAbPRp1_WIaU6f2QaEUvL/view?usp=sharing)

Section 1

We also cite the formulae and methods given by Hapgood (1992) for geocentric systems, which are based on the Astronomical Almanac for Computers (1988) which is no longer updated by the Nautical Almanac Offices. The formulae used by Hapgood (1992) are first order approximations of the third order formulae given in Expl. Suppl. (1961).

Section 2

The Julian Day Number ($JD$) starts at Greenwich mean noon 4713 Jan. 1, B.C. [S. 2.26]. The _epoch day number_ is defined in this paper as the fractional number of days of $86400$ seconds from the epoch:

(1) $\quad$ $d_0 = (JD - 2451545.0)$.

Formulae from S. and A. use Julian centuries ($T_0$) from J2000.0. One Julian century has 36525 days, one Julian year has 365.25 days, s.t. [S. T3.222.2]

(2) $\quad$ $T_0 = d_0/36525.0$ $\quad$ and $\quad$ $y_0 = d_0/365.25$.

Section 3.3.1

For the precision needed in this paper, we may neglect the difference between $T_U$ and $T_0$, such that (Meeus, 2000):

(20) $\quad$ $\text{GMST} ≈ 280^\circ.46061837 + 360^\circ.98564736629\;d_0 + 0^\circ.0003875\;T_0^2 - 2^\circ.6\cdot 10^{-8}\;T_0^3$.

----
**Notes**

$1/38710000$ ($= 2.583311805...10^{-8}$) is given in Meeus (1998) Eqn 12.4 and $2.6e-08$ is used in Fränz and Harper (2002) above (and Siedelman 1992). Also, $0.000387933$ is used in Meeus (1998) Eqn 12.4 (and Siedelman 1992) but $0.0003875$ is used in Fränz and Harper (2002). Also, $0.000387933\;T^2$ used in Meeus (1998) Eqn 12.4 (and Seidelmann 1992) but $0.0003875\;T_0^2$ is used in Fränz and Harper (2002).

Finally, Fränz and Harper 2002 cite "Meeus, J, 2000, Astronomical Algorithms 2nd Edition" but but I am only able to find Meeus, J, 1998, Astronomical Algorithms 2nd Edition.
