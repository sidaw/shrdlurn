module Main (App(..), main) where

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
import Sempre


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
spacing = 9.0

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
    traverseWithIndex_ (\x -> renderStack isomer y (toNumber (length wall - x))) (reverse wall)

-- | Render a series of walls
renderWalls :: IsomerInstance -> (List Wall) -> EffIsomer
renderWalls isomer walls = do
    setIsomerConfig isomer 40.0 10.0 320.0
    traverseWithIndex_ (\y -> renderWall isomer (toNumber y)) walls

-- | Render the target shape
renderTarget :: IsomerInstance -> Wall -> EffIsomer
renderTarget isomer target = do
    setIsomerConfig isomer 28.0 1280.0 410.0
    renderWall isomer 0.0 target


-- | Render all UI components, DOM and canvas
render :: Boolean -> GameState -> App
render setupUI gs = do
    doc <- getDocument
    isomer <- getIsomerInstance "canvas"
    let level   = getLevel gs.currentLevel
       -- wallee    = getCurrentWallList gs

    -- Set up UI, only if new level is loaded
    when setupUI $ do
        withElementById "levels" doc $ \selectLevel -> do
            setInnerHTML "" selectLevel
            traverse_ (appendLevelElement selectLevel gs.currentLevel) allLevelIds

    -- let transformers = mapMaybe (getTransformer chapter) tids
    -- let transformers = toList [mapStack Yellow, mapStack Yellow, mapStack Red]
    -- let steps = allSteps transformers level.initial

    -- On-canvas rendering
    clearCanvas isomer
    -- renderWalls isomer steps
    -- renderWalls isomer wallee
    renderWalls isomer (getWallList "")
    renderTarget isomer level.target

    -- DOM 'rendering'
    -- let solved = maybe false (== (level.target)) (last wallee)
    --    visibility = if solved then "visible" else "hidden"
    --    cssAction = if solved then classAdd "flash" else classRemove "flash"

    -- withElementById "message" doc (setStyleAttribute "visibility" visibility <<< unsafeElementToHTMLElement)
    -- withElementById "solved" doc cssAction

    withElementById "help" doc $ \helpText -> do
       setInnerHTML (fromMaybe "" level.help) helpText

    -- Debug output:
    let toArray = fromList :: forall a. List a -> Array a
        toArrays = toArray <<< map toArray
    log $ "Target: " ++ show (toArrays level.target)
    log ""

getWallList :: String -> (List Wall)
getWallList json = (toList [convert [[Yellow, Red, Red], [Yellow, Red], [Red], [Red]], convert [[Yellow, Yellow, Red], [Yellow, Red], [Red], [Red]]])

-- | Replace all occurences of a pattern in a string with a replacement
replaceAll :: String -> String -> String -> String
replaceAll pattern replacement = replace (regex pattern flags) replacement
    where flags = parseFlags "g"

-- | Clear all functions for the current level
resetLevel = modifyGameStateAndRender false mod
    where mod gs = gs { levelState = SM.insert gs.currentLevel Nil gs.levelState }
   

-- | clicked enter
enteredText = do
    doc <- getDocument
    Just maintextarea <- getElementById' "maintextarea" doc
    cmdsequence <- getValue maintextarea

    isomer <- getIsomerInstance "canvas"
    -- On-canvas rendering
    clearCanvas isomer
    -- renderWalls isomer (toList [wallFromJSON "{}"])
    renderWalls isomer (toList [intToWall [[1, 2, 3], [3, 2], [1], [1,2]]])
    -- cmdsequence <- Nil
    log either "" (readJSON cmdsequence :: F (Array (Array Int)))
    -- modifyGameStateAndRender true (mod cmdsequence)
    --  where mod cmdsequence gs = gs { levelState = SM.insert gs.currentLevel cmdsequence gs.levelState }

-- | Go to the previous level
prevLevel = modifyGameStateAndRender true mod
    where mod gs   = gs { currentLevel = prev gs.currentLevel }
          prev cur = fromMaybe cur $ before cur allLevelIds
          before _ Nil                   = Nothing
          before _ (Cons _ Nil)          = Nothing
          before x (Cons b (Cons x' xs)) = if x == x'
                                           then Just b
                                           else before x (x':xs)

-- | Go to the next level
nextLevel = do
    mgs <- loadGameState
    let gs' = fromMaybe initialGS mgs
--    analyticsLevelChanged (next gs'.currentLevel)

    modifyGameStateAndRender true mod
    where mod gs   = gs { currentLevel = next gs.currentLevel }
          next cur = fromMaybe cur $ head =<< (tail $ dropWhile (/= cur) allLevelIds)

-- | General key press handler
keyPress :: Event -> App
keyPress event = do
    doc <- getDocument
    let kev = unsafeEventToKeyboardEvent event
        code = keyCode kev
        ctrlPressed = ctrlKey kev

    when (not ctrlPressed) $
        case code of
             _ -> return unit

    return unit

-- | Add an option-element corresponding to the given Level
appendLevelElement :: Element -> LevelId -> LevelId -> EffDOM
appendLevelElement select currentId lid = do
    let chapter = getChapter lid
        level = getLevel lid
    doc <- getDocument
    option <- createElement "option" doc
    setAttribute "value" lid option
    when (currentId == lid) $
        setAttribute "selected" "selected" option
    setTextContent (levelTitle lid level) (elementToNode option)
    appendChild (elementToNode option) (elementToNode select)
    return unit

-- | Initial game state for first-time visitors
initialGS :: GameState
initialGS = { currentLevel: firstLevel, levelState: SM.empty }

-- | Load, modify and store the game state. Render the new state
modifyGameStateAndRender :: Boolean
                         -> (GameState -> GameState)
                         -> forall eff. Eff (dom :: DOM, console :: CONSOLE, isomer :: ISOMER, storage :: STORAGE | eff) Unit
modifyGameStateAndRender setupUI modifyGS = do
    -- Load old game state from local storage
    mgs <- loadGameState
    let gs = fromMaybe initialGS mgs

    -- Modify by supplied function
    let gs' = modifyGS gs

    -- Render the new state and save back to local storage
    render setupUI gs'
    saveGameState gs'

-- | Event handler for a level change
levelChangeHandler :: Element -> Event -> App
levelChangeHandler selectLevel _ = do
    levelId <- getSelectedValue selectLevel

    analyticsLevelChanged levelId

    modifyGameStateAndRender true $ \gs ->
        gs { currentLevel = levelId }

main :: App
main = do
    doc <- getDocument
    
    -- set up keyboard event handlers
    win <- windowToEventTarget <$> window
    addEventListener' keydown keyPress win

    -- set up 'change' handler for the level selector
    withElementById "levels" doc $ \selectLevel ->
        addEventListener' change (levelChangeHandler selectLevel) (elementToEventTarget selectLevel)

    withElementById "enterbutton" doc $ \button ->
        addEventListener' click (const enteredText) (elementToEventTarget button)

    withElementById "nextlevel" doc $ \button ->
        addEventListener' click (const nextLevel) (elementToEventTarget button)

    -- load game state (or set initial one)
    gs <- fromMaybe initialGS <$> loadGameState
    saveGameState gs

    -- render initial state
    render true gs
