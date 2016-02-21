## Module Helper

#### `fromArray`

``` purescript
fromArray :: forall a. Array (Tuple String a) -> StrMap a
```

Create a StrMap from an Array of (key, value) pairs

#### `(:>)`

``` purescript
(:>) :: forall a b. a -> b -> Tuple a b
```

_left-associative / precedence 6_

Operator to create tuples, especially for creating maps with
`Map.fromList ["key1" :> "value1", "key2" :> "value2"]`

#### `AStack`

``` purescript
type AStack = Array Cube
```

Array analogs of the Stack and Wall types

#### `AWall`

``` purescript
type AWall = Array AStack
```

#### `convert`

``` purescript
convert :: AWall -> Wall
```

Convert 2D Array to List

#### `intToStack`

``` purescript
intToStack :: Array Int -> Stack
```

#### `intToWall`

``` purescript
intToWall :: Array (Array Int) -> Wall
```

#### `intToWalls`

``` purescript
intToWalls :: Array (Array (Array Int)) -> List Wall
```


