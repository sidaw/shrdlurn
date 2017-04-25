# Voxelurn

Voxelurn is a command interface for building voxel structures. It is an experimental platform for developing technologies allowing computers to understand a naturalized programming language, which allows people to access to the power of programming languages without conforming to their uncompromising syntax. Voxlurn does this by learning from its user community interactively.

This document contains information about the core language,
rules of the competition,
how definition works,
and other details about the project.

## Core language
The system always understands a core language, which is just a programming language designed to interpolate well with natural language.

Directions:
`top, bot, left, right, front, back`

Extreme directions: `very top, very bot, very left ...`

Colors:
`red, orange, yellow, green, blue`
`white, black, pink, brown`
[any css colors](https://www.w3schools.com/cssref/css_colors.asp)

Operators:
`has, of, not, and, or`
`+, -`

Sets: `all, none, this, previous, origin`

Primitive actions:
`select, add, remove, move`

Control flow: `repeat, ;, [], {}, if, while, foreach, isolate`

### Examples
```
add red top
add yellow
repeat 3 [add yellow top]
select top
select has color red<
move top, move bot
```

```
repeat 3 add red top
select top of left of this
select this or top of left of this
select all and not this
repeat 3 [add red; select top]
```

### Advanced
```
{select left or right; add red};
isolate [repeat 3 [add red left]]
if has color red [remove all]
while has height 0 [select left; add yellow]
select has row [row of left]
foreach [remove has row row of this]  
add red;  {select right; update color color of left}
```

### User defined

```
add red place 3 x 5
red cube size 3
add green monster
dancer
add girl
music box
```
