module Main (App(..), main, renderJSON) where

import Prelude
import Control.Apply
import Control.Bind
import Control.Monad
import Control.Monad.Eff
import Control.Monad.Eff.Console
import DOM
import DOM.Event.EventTypes (change, click, keydown)
import DOM.Event.Types (Event())
import DOM.HTML (window)
import DOM.HTML.Types (windowToEventTarget, htmlElementToEventTarget, htmlElementToElement)
import DOM.Node.Document (createElement)
import DOM.Node.Element (setAttribute)
import DOM.Node.Node (appendChild, setTextContent, parentElement)
import DOM.Node.Types (Element(), Node(), elementToNode, elementToEventTarget)
import Data.Enum
import Data.Foldable
import Data.Int
import Data.List
import Data.Maybe
import Data.Either
-- import Data.Nullable (toMaybe)
import Data.String.Regex (regex, parseFlags, replace)
-- import Data.String (split)
-- import Data.Traversable
import qualified Data.StrMap as SM
import Data.Foreign
import Data.Foreign.Class

import Analytics
import DOMHelper
import Isomer
import Levels
import Storage
-- import Transformer
import Types
import Helper

-- | Type synonyms for different combinations of effects
type EffIsomer = forall eff. Eff (isomer :: ISOMER | eff) Unit
type EffDOM    = forall eff. Eff (dom :: DOM | eff) Unit
type App       = forall eff. Eff (dom :: DOM, console :: CONSOLE, isomer :: ISOMER, storage :: STORAGE | eff) Unit

-- | RGB codes for the abstract colors
cubeColor :: Cube -> IsomerColor
cubeColor Cyan   = colorFromRGB   0 160 176
cubeColor Brown  = colorFromRGB 106  74  60
cubeColor Red    = colorFromRGB 204  51  63
cubeColor Orange = colorFromRGB 235 104  65
cubeColor Yellow = colorFromRGB 237 201  81

-- | Spacing between two walls
spacing :: Number
spacing = 6.0

-- | Like traverse_, but the function also takes an index parameter
traverseWithIndex_ :: forall a b m. (Applicative m) => (Int -> a -> m b) -> (List a) -> m Unit
traverseWithIndex_ f xs = go xs 0
    where go Nil _         = return unit
          go (Cons x xs) i = f i x *> go xs (i + 1)

-- | Traverse a StrMap while performing monadic side effects
traverseWithKey_ :: forall a m. (Monad m) => (String -> a -> m Unit) -> SM.StrMap a -> m Unit
traverseWithKey_ f sm = SM.foldM (const f) unit sm

-- | Render a single stack of cubes
renderStack :: IsomerInstance -> Number -> Number -> Stack -> EffIsomer
renderStack isomer y x stack =
    traverseWithIndex_ (\z -> renderCube isomer x (-spacing * y) (toNumber z)) $ map cubeColor stack

-- | Render a wall (multiple stacks)
renderWall :: IsomerInstance -> Number -> Wall -> EffIsomer
renderWall isomer y Nil =
    -- Render a gray placeholder for the empty wall
    renderBlock isomer 1.0 (-spacing * y) 0.0 5.0 0.9 0.1 (colorFromRGB 100 100 100)
renderWall isomer y wall =
    if isEmptyWall wall
    then traverseWithIndex_ (\x -> renderStack isomer y (toNumber (length wall - x))) (reverse wall)
    else renderBlock isomer 1.0 (-spacing * y) 0.0 5.0 0.9 0.1 (colorFromRGB 100 100 100)
    
isEmptyWall :: Wall -> Boolean
isEmptyWall wall =
    if length wall == 0 then true
    else Nothing /= findIndex isEmptyStack wall
isEmptyStack :: Stack -> Boolean
isEmptyStack stack = length stack > 0


-- | Render a series of walls
renderWalls :: IsomerInstance -> (List Wall) -> EffIsomer
renderWalls isomer walls = do
    setIsomerConfig isomer 35.0 40.0 400.0
    traverseWithIndex_ (\y -> renderWall isomer (toNumber y)) walls

-- | Render the target shape
renderTarget :: IsomerInstance -> Wall -> EffIsomer
renderTarget isomer target = do
    setIsomerConfig isomer 30.0 1280.0 500.0
    renderWall isomer 0.0 target

-- | Replace all occurences of a pattern in a string with a replacement
replaceAll :: String -> String -> String -> String
replaceAll pattern replacement = replace (regex pattern flags) replacement
    where flags = parseFlags "g"

ignoreErrorWall = either (const [[]]) (id)
jsonToWall :: String -> Wall
jsonToWall x =  intToWall $ ignoreErrorWall $ readJSON x :: F (Array (Array Int))

ignoreErrorWalls = either (const [[[]]]) (id)
jsonToWalls :: String -> (List Wall)
jsonToWalls x =  intToWalls $ ignoreErrorWalls $ readJSON x :: F (Array (Array (Array Int)))

renderJSON :: String -> App
renderJSON jsonwalls = do
    doc <- getDocument
    isomer <- getIsomerInstance "canvas"
    -- On-canvas rendering
    clearCanvas isomer
    renderWalls isomer $ jsonToWalls jsonwalls
    -- renderTarget isomer $ jsonToWall jsontarget
    -- parsedJSON <- readJSON cmdsequence :: F (Array (Array Int))
    -- renderWalls isomer (toList [intToWall (rights parsedJSON)])
    -- [[1, 2, 3], [3, 2], [1], [1,2]]
    -- cmdsequence <- Nil
    log "here"
    print $ either (const [[0]]) (id) (readJSON jsonwalls :: F (Array (Array Int)))
    -- modifyGameStateAndRender true (mod cmdsequence)
    --  where mod cmdsequence gs = gs { levelState = SM.insert gs.currentLevel cmdsequence gs.levelState }
    
-- | Initial game state for first-time visitors
initialGS :: GameState
initialGS = { currentLevel: firstLevel, levelState: SM.empty }

main :: App
main = do
    renderJSON "[[[]]]"
