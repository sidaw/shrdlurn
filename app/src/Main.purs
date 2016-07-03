module Main (App(..), main, renderJSON, renderTargetJSON, renderUserTargetJSON) where
import Prelude
import Control.Apply
import Control.Monad.Eff
import Control.Monad.Eff.Console
import DOM
import Data.Int
import Data.List
import Data.Maybe
import Data.Either
import qualified Data.StrMap as SM
import Data.Foreign
import Data.Foreign.Class
import DOMHelper
import Isomer

-- import Transformer
import Types
import Helper

import Math (sin)
import Data.String.Regex (regex, parseFlags, replace)

-- | Type synonyms for different combinations of effects
type EffIsomer = forall eff. Eff (isomer :: ISOMER | eff) Unit
type EffDOM    = forall eff. Eff (dom :: DOM | eff) Unit
type App       = forall eff. Eff (dom :: DOM, console :: CONSOLE, isomer :: ISOMER | eff) Unit

-- | RGB codes for the abstract colors
cubeColor :: Cube -> IsomerColor
cubeColor Yellow   = colorFromRGB 204  51  63
cubeColor Green  = colorFromRGB 235 104  65
cubeColor Blue    = colorFromRGB 237 201  8
cubeColor Cyan = colorFromRGB 50 205 50
cubeColor Brown = colorFromRGB 30 144 255
cubeColor Red = colorFromRGB 10 160 176 -- brown
cubeColor Orange = colorFromRGB 106  74  60 -- cyan
cubeColor Purple = colorFromRGB 160 32 240
cubeColor _ = colorFromRGB 0 0 0

gray = (colorFromRGB 185 185 185)
darkgray = (colorFromRGB 100 100 100)
markcolor = (colorFromRGB 80 80 80)

-- | Spacing between two walls
spacing :: Number
spacing = 8.0
cubesize :: Number
cubesize = 35.0
worldsize = 8.0

-- | Like traverse_, but the function also takes an index parameter
traverseWithIndex_ :: forall a b m. (Applicative m) => (Int -> a -> m b) -> (List a) -> m Unit
traverseWithIndex_ f xs = go xs 0
    where go Nil _         = return unit
          go (Cons x xs) i = f i x *> go xs (i + 1)
-- | Render a single colored cube at the given position

relsize = 0.9
renderCube :: forall eff. IsomerInstance
           -> Number
           -> Number
           -> Number
           -> IsomerColor
           -> Eff (isomer :: ISOMER | eff) Unit
renderCube isomer x y z col = renderBlock isomer x y z relsize relsize relsize col


xPosition :: Number -> Number -> Number
-- xPosition x y = (x+y*(spacing))
xPosition x y = x
-- | Render a single stack of cubes
renderStack :: IsomerInstance -> Number -> Number -> Stack -> EffIsomer
renderStack isomer y x stack = do
    renderBlock isomer (x+0.05) (y+0.05) (-0.1) 0.9 0.9 0.1 gray
    draw stack 0.0
    where draw Nil _ = return unit
          draw (Cons Tran cs) z = return unit *> draw cs (z + 1.0)
          draw (Cons Mark cs) z = renderBlock isomer (x+(1.0-marksize)/2.0) (y+(1.0-marksize)/2.0) (z-0.1) marksize marksize 0.25 markcolor *> draw cs (z) where marksize=0.5
          draw (Cons c cs) z = renderCube isomer (x+0.05) (y+0.05) z (cubeColor c) *> draw cs (z + 1.0)
    -- renderBlock isomer (xPosition x y) (-spacing * y) (-0.1) 1.0 0.9 0.1 gray

-- | Render a wall (multiple stacks)
renderWall :: IsomerInstance -> Number -> Number -> Wall -> EffIsomer
renderWall isomer initlen y wall  = do
    renderBlock isomer (1.0 + (spacing)*y - y*factor) (-spacing*y - worldsize + 1.0 - y*factor) (-0.1) worldsize worldsize 0.1 darkgray
    traverseWithIndex_ (\x -> renderStack isomer (-spacing*y - advance x - y*factor) (worldsize - advanceCol x + spacing*y - y*factor)) (reverse wall)
        where
        factor = 2.25 --sin (75.0/180.0*3.14159)

    --if wallNotEmpty wall
    --then traverseWithIndex_ (\x -> renderStack isomer y (toNumber (length wall - x))) (reverse wall)
    --else renderBlock isomer (xPosition 1.0 y) (-spacing * y) (-0.1) (initlen-0.1) 0.9 0.1 (colorFromRGB 100 100 100)
advance :: Int -> Number
advance x = toNumber (floor ((toNumber x) / worldsize))

advanceCol :: Int -> Number
advanceCol x = toNumber (mod x $ floor worldsize)

-- | Render a series of walls
renderWalls :: IsomerInstance -> (List Wall) -> EffIsomer
renderWalls isomer walls = do
    traverseWithIndex_ (\y -> renderWall isomer worldsize (toNumber y)) walls

-- | Replace all occurences of a pattern in a string with a replacement
replaceAll :: String -> String -> String -> String
replaceAll pattern replacement = replace (regex pattern flags) replacement
    where flags = parseFlags "g"

ignoreErrorWall :: forall a b. Either a (Array (Array b)) -> Array (Array b)
ignoreErrorWall = either (const [[]]) (id)
jsonToWall :: String -> Wall
jsonToWall x =  intToWall $ ignoreErrorWall $ readJSON x :: F (Array (Array Int))

ignoreErrorWalls :: forall t30 t32. Either t30 (Array (Array (Array t32))) -> Array (Array (Array t32))
ignoreErrorWalls = either (const [[[]]]) (id)
jsonToWalls :: String -> (List Wall)
jsonToWalls x =  intToWalls $ ignoreErrorWalls $ readJSON x :: F (Array (Array (Array Int)))

renderJSON :: String -> App
renderJSON jsonwalls = do
    doc <- getDocument
    isomer <- getIsomerInstance "canvas"
    -- On-canvas rendering
    clearCanvas isomer
    setIsomerConfig isomer 35.0 30.0 (350.0+248.0)
    renderWalls isomer $ jsonToWalls jsonwalls
    -- renderTarget isomer $ jsonToWall jsontarget
    -- parsedJSON <- readJSON cmdsequence :: F (Array (Array Int))
    -- renderWalls isomer (toList [intToWall (rights parsedJSON)])
    -- [[1, 2, 3], [3, 2], [1], [1,2]]
    -- cmdsequence <- Nil
    -- print $ either (const [[0]]) (id) (readJSON jsonwalls :: F (Array (Array Int)))
    -- modifyGameStateAndRender true (mod cmdsequence)
    --  where mod cmdsequence gs = gs { levelState = SM.insert gs.currentLevel cmdsequence gs.levelState }

renderTargetJSON :: String -> App
renderTargetJSON jsonwalls = do
    doc <- getDocument
    isomer <- getIsomerInstance "canvastarget"
    -- On-canvas rendering
    clearCanvas isomer
    setIsomerConfig isomer 12.0 5.0 160.0
    renderWalls isomer $ jsonToWalls jsonwalls
    print $ either (const [[0]]) (id) (readJSON jsonwalls :: F (Array (Array Int)))

renderUserTargetJSON :: String -> String -> App
renderUserTargetJSON jsonwalls canvasId = do
    doc <- getDocument
    isomer <- getIsomerInstance canvasId
    -- On-canvas rendering
    clearCanvas isomer
    setIsomerConfig isomer 7.0 5.0 80.0
    renderWalls isomer $ jsonToWalls jsonwalls
    print $ either (const [[0]]) (id) (readJSON jsonwalls :: F (Array (Array Int)))

main :: App
main = do
    renderJSON "[[[]]]"
    renderTargetJSON "[[]]"
