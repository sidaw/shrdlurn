## Module Types

#### `Cube`

``` purescript
data Cube
  = Cyan
  | Brown
  | Red
  | Orange
  | Yellow
```

##### Instances
``` purescript
Show Cube
Eq Cube
Ord Cube
Bounded Cube
Enum Cube
```

#### `intToCube`

``` purescript
intToCube :: Int -> Cube
```

#### `Stack`

``` purescript
type Stack = List Cube
```

#### `Wall`

``` purescript
type Wall = List Stack
```


