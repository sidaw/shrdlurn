module Isomer
    ( ISOMER(..)
    , IsomerInstance(..)
    , IsomerColor(..)
    , getIsomerInstance
    , renderBlock
    , clearCanvas
    , setIsomerConfig
    , colorFromRGB
    ) where

import Prelude
import Control.Monad.Eff
import Data.Function

foreign import data ISOMER :: !

foreign import data IsomerInstance :: *

foreign import data IsomerColor :: *

-- | (Install and) return the Isomer instance on the canvas with the given id
foreign import getIsomerInstance :: forall eff. String
           -> Eff (isomer :: ISOMER | eff) IsomerInstance

foreign import _renderBlock :: forall eff.
                            Fn8 IsomerInstance
                                Number Number Number
                                Number Number Number
                                IsomerColor
                                (Eff (isomer :: ISOMER | eff) Unit)

-- | Render a colored block of size dx, dy, dz at position x, y, z
renderBlock :: forall eff. IsomerInstance
            -> Number -> Number -> Number
            -> Number -> Number -> Number
            -> IsomerColor
            -> Eff (isomer :: ISOMER | eff) Unit
renderBlock = runFn8 _renderBlock


-- | Clear the whole canvas that belongs to the Isomer instance
foreign import clearCanvas :: forall eff. IsomerInstance
                           -> Eff (isomer :: ISOMER | eff) Unit

foreign import _setIsomerConfig :: forall eff.
                                Fn4 IsomerInstance
                                    Number Number Number
                                    (Eff (isomer :: ISOMER | eff) Unit)

-- | Set Isomer scale factor and origin (X and Y)
setIsomerConfig :: forall eff. IsomerInstance
                -> Number -> Number -> Number
                -> Eff (isomer :: ISOMER | eff) Unit
setIsomerConfig = runFn4 _setIsomerConfig

foreign import _colorFromRGB :: Fn3 Int Int Int IsomerColor

-- | Create Isomer.Color object from its RGB representation
colorFromRGB :: Int -> Int -> Int -> IsomerColor
colorFromRGB = runFn3 _colorFromRGB
