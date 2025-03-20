import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Home = () => {

  const addToCartHandler = () => {};

  return (
    <div className="home">
      <section></section>
      <h1>Latest Products <Link to={"/search"} className="findmore">More</Link></h1>
      <main>
        <ProductCard
          productId="jfsdsf"
          name="Macbook"
          price={45023}
          stock={235}
          handler={addToCartHandler}
          photo="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFjYm9va3xlbnwwfHwwfHx8MA%3D%3D"
        />
      </main>
    </div>
  )
}

export default Home;