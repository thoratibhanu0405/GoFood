import React from 'react'
const CartStateContext = React.createContext();
const CartDispatchContext = React.createContext();

const reducer = (state,action) => {
    switch(action.type){
        case "ADD":
            return [...state, {id: action.id, name: action.name, qty: action.qty, size: action.size, price: action.price, img: action.img}];
        case "REMOVE":
            let newArr = [...state];
            newArr.splice(action.index,1);
            return newArr;
        case "UPDATE":
            let arr = [...state];
            arr.find((food,index)=>{
                if(food.id===action.id){
                    console.log(food.qty,parseInt(action.qty),action.price+food.price);
                    arr[index] = {...food,qty:parseInt(action.qty)+parseInt(food.qty),price:action.price+food.price}
                }
                return arr;
            })
            return arr;
        case "DROP":
            let empArray = [];
            return empArray;
        default:
            console.log("Error in Reducer");
    }
}
const CartProvider = ({children}) => {
    const[state,dispatch] = React.useReducer(reducer,[]);
  return (
    <CartDispatchContext.Provider value={dispatch}>
        <CartStateContext.Provider value={state}>
            {children}
        </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  )
}
export const useCart = () => React.useContext(CartStateContext);
export const useDispatchCart = () => React.useContext(CartDispatchContext);
export {CartProvider};