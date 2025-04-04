import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import img from "../../../assets/shoes.jpg";

// const img = "https://unsplash.com/photos/white-and-red-nike-athletic-shoe-LG88A2XgIXY";

const ProductManagement = () => {

  const [name, setName] = useState<string>("Puma Shoes");
  const [price, setPrice] = useState<number>(2000);
  const [stock, setStock] = useState<number>(0);
  const [photo, setPhoto] = useState<string>(img);

  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [photoUpdate, setPhotoUpdate] = useState<string>(photo);

  const changeImageHandler = (e:ChangeEvent<HTMLInputElement>) => {
      const file:File | undefined = e.target.files?.[0];
      const reader:FileReader = new FileReader();
      if(file){
          reader.readAsDataURL(file);
          reader.onloadend = () => {
              if(typeof reader.result === "string"){
                  setPhotoUpdate(reader.result);
              }
          }
      }
  }

  const submitHandler = (e:FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setName(nameUpdate);
      setPrice(priceUpdate);
      setStock(stockUpdate);
      setPhoto(photoUpdate);
  }

return (
  <div className="adminContainer">
      <AdminSidebar />
      <main className="product-management">

          <section>
            <strong>ID - fjslfjs</strong>
            <img src={photo} alt="Product" />
            <p>{name}</p>
            {
              stock > 0 ? <span className="green">{stock} Available</span> : <span className="red">Not Availabe</span>
            }
            <h3>${price}</h3>
          </section>

          <article>
              <form onSubmit={submitHandler}>
                  <h2>Manage</h2>
                  <div>
                      <label>Name</label>
                      <input
                          type="text"
                          placeholder="Name"
                          value={nameUpdate}
                          required
                          onChange={(e) => setNameUpdate(e.target.value)}
                      />
                  </div>
                  <div>
                      <label>Price</label>
                      <input
                          type="number"
                          placeholder="Price"
                          value={priceUpdate}
                          required
                          onChange={(e) => setPriceUpdate(Number(e.target.value))}
                      />
                  </div>
                  <div>
                      <label>Stock</label>
                      <input
                          type="number"
                          placeholder="Stock"
                          value={stockUpdate}
                          required
                          onChange={(e) => setStockUpdate(Number(e.target.value))}
                      />
                  </div>
                  <div>
                      <label>Photo</label>
                      <input
                          type="file"
                          required
                          onChange={changeImageHandler}
                      />
                  </div>
                  {
                      photo && <img src={photoUpdate} width={150} alt="Image" />
                  }
                  <button type="submit">Update</button>
              </form>
          </article>
      </main>
  </div>
)
}

export default ProductManagement;