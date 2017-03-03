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

```
{select left or right; add red};
isolate [repeat 3 [add red left]]
if has color red [remove all]
while has height 0 [select left; add yellow]
select has row [row of left]
foreach [remove has row row of this]  
add red;  {select right; update color color of left}
```

```
move left 3 times
do 3 times add red top
move left until red
red cube size 3
surround this cube
copy this to the left
```

## Competition details

We award prizes for users contributing the most useful language, and users building the best structures. Six $50 prizes are handed out every two weeks for the top 3 language teachers and the top 3 best structures. To participate, you have to join our slack channel and login. More details on the competition can be found there.

## Definition

## About the project
