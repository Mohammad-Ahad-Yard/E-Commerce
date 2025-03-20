import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "slfsa",
    photo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFjYm9va3xlbnwwfHwwfHx8MA%3D%3D",
    name: "MacBook",
    price: 3000,
    quantity: 40,
    stock: 10
  }
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 200;
const total = subtotal + tax + shippingCharges;
const discount = 400;

const Cart = () => {

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if(Math.random() > 0.5){
        setIsValidCouponCode(true);
      }
      else {
        setIsValidCouponCode(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    }
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {
          cartItems.length > 0 ? cartItems.map((i,index) => (
            <CartItem key={index} cartItem={i} />
          )) : <h1>No Items Added</h1>
        }
      </main>
      <aside>
        <p>Subtotal: Rs.{subtotal}</p>
        <p>Shipping Charges: Rs.{shippingCharges}</p>
        <p>Tax: Rs.{tax}</p>
        <p>
          Discount <em>- Rs. {discount}</em>
        </p>
        <p>
          <b>Total: Rs.{total}</b>
        </p>
        <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
        {
          couponCode && (
            isValidCouponCode ? <span className="green">Rs.{discount} off using the <code>{couponCode}</code></span> : <span className="red">Invalid Coupon <VscError /></span>
          )
        }
        {
          cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>
        }
      </aside>
    </div>
  )
}

export default Cart;