module Types where

import Prelude
import Data.List
import Data.Enum
import Data.Maybe
import qualified Data.StrMap as SM

-- Cube, Stack, Wall
data Cube = Cyan | Brown | Red | Orange | Yellow | Green | Blue | Purple |  Tran | Mark | FreeMark

instance showCube :: Show Cube where
    show Cyan   = "Cyan"
    show Brown  = "Brown"
    show Red    = "Red"
    show Orange = "Orange"
    show Yellow = "Yellow"
    show Green = "Green"
    show Blue = "Blue"
    show Purple = "Purple"
    show Tran = "Tran"
    show Mark = "Mark"
    show FreeMark = "FreeMark"

instance eqCube :: Eq Cube where
    eq a b = fromEnum a == fromEnum b

instance ordCube :: Ord Cube where
    compare a b = fromEnum a `compare` fromEnum b

instance boundedCube :: Bounded Cube where
    top    = Yellow
    bottom = Cyan

instance enumCube :: Enum Cube where
    cardinality = Cardinality 5
    succ = defaultSucc cubeToEnum cubeFromEnum
    pred = defaultPred cubeToEnum cubeFromEnum
    toEnum = cubeToEnum
    fromEnum = cubeFromEnum

cubeFromEnum Red   = 0
cubeFromEnum Orange  = 1
cubeFromEnum Yellow = 2
cubeFromEnum Green = 3
cubeFromEnum Blue = 4
cubeFromEnum Purple = 5
cubeFromEnum Brown = 6
cubeFromEnum Cyan = 7

cubeFromEnum Tran = 9
cubeFromEnum Mark = 10
cubeFromEnum FreeMark = 11

cubeToEnum 0 = Just Red
cubeToEnum 1 = Just Orange
cubeToEnum 2 = Just Yellow
cubeToEnum 3 = Just Green
cubeToEnum 4 = Just Blue
cubeToEnum 5 = Just Purple
cubeToEnum 6 = Just Brown
cubeToEnum 7 = Just Cyan

cubeToEnum 9 = Just Tran
cubeToEnum 10 = Just Mark
cubeToEnum 11 = Just FreeMark
cubeToEnum _ = Nothing

intToCube :: Int -> Cube
intToCube 0 = Red
intToCube 1 = Orange
intToCube 2 = Yellow
intToCube 3 = Green
intToCube 4 = Blue
intToCube 5 = Purple
intToCube 6 = Brown
intToCube 7 = Cyan

intToCube 9 = Tran
intToCube 10 = Mark
intToCube 11 = FreeMark
intToCube _ = Red

type Stack = List Cube
type Wall = List Stack
