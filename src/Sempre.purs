module Sempre where

import Prelude
import Control.Monad.Eff
import Data.List
import Data.Maybe

import qualified Data.StrMap as SM
import Types
import Helper

-- | Retrieve the current game state from local storage (FFI, needs 'Just' and 'Nothing' as input)
foreign import wallFromJSONForeign :: String -> Wall

wallFromJSON :: String -> Wall
wallFromJSON str = do
    convert [[Yellow, Cyan, Red], [Yellow, Brown], [Red], [Red]]