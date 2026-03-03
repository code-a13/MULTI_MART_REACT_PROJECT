import { createContext, useReducer, useEffect } from "react";

export const CartContext = createContext();

// Enterprise Safety: Safely load from LocalStorage using try-catch
const getInitialState = () => {
  try {
    const localData = localStorage.getItem("cart");
    // If localData exists, parse it. Otherwise, return empty array.
    return localData ? { cart: JSON.parse(localData) } : { cart: [] };
  } catch (error) {
    console.error("Error parsing cart from LocalStorage:", error);
    return { cart: [] }; // Fallback to empty cart if data is corrupted
  }
};

const initialState = getInitialState();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existing = state.cart.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, qty: 1 }] };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.id),
      };

    // Essential for Checkout: Empties the cart after payment
    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Sync to LocalStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider value={{ cart: state.cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};