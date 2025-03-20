import { ReactElement, useCallback, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import shoe from "../../assets/shoes.jpg";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement
};

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo"
  },
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Price",
    accessor: "price"
  },
  {
    Header: "Stock",
    accessor: "stock"
  },
  {
    Header: "Action",
    accessor: "action"
  }
];

// const img1 = "https://unsplash.com/photos/unpaired-red-nike-sneaker-164_6wVEHfI";
const img2 = "https://m.media-amazon.com/images/I/514T0SvwkHL._SL1500_.jpg";

const arr:DataType[] = [
  {
    photo: <img src={shoe} alt="Shoes" />,
    name: "Puma Shoes Air Jordan",
    price: 690,
    stock: 3,
    action: <Link to="/admin/products/sfsfsf">Manage</Link>
  },
  {
    photo: <img src={img2} alt="MacBook" />,
    name: "Macbook",
    price: 23222,
    stock: 213,
    action: <Link to="/admin/products/sfsfsf">Manage</Link>
  },
  {
    photo: <img src={img2} alt="MacBook" />,
    name: "Macbook",
    price: 23222,
    stock: 213,
    action: <Link to="/admin/products/sfsfsf">Manage</Link>
  },
  {
    photo: <img src={img2} alt="MacBook" />,
    name: "Macbook",
    price: 23222,
    stock: 213,
    action: <Link to="/admin/products/sfsfsf">Manage</Link>
  },
  {
    photo: <img src={img2} alt="MacBook" />,
    name: "Macbook",
    price: 23222,
    stock: 213,
    action: <Link to="/admin/products/sfsfsf">Manage</Link>
  },
  {
    photo: <img src={img2} alt="MacBook" />,
    name: "Macbook",
    price: 23222,
    stock: 213,
    action: <Link to="/admin/products/sfsfsf">Manage</Link>
  },
  {
    photo: <img src={img2} alt="MacBook" />,
    name: "Macbook",
    price: 23222,
    stock: 213,
    action: <Link to="/admin/products/sfsfsf">Manage</Link>
  },
  {
    photo: <img src={img2} alt="MacBook" />,
    name: "Macbook",
    price: 23222,
    stock: 213,
    action: <Link to="/admin/products/sfsfsf">Manage</Link>
  },
  {
    photo: <img src={img2} alt="MacBook" />,
    name: "Macbook",
    price: 23222,
    stock: 213,
    action: <Link to="/admin/products/sfsfsf">Manage</Link>
  },
  {
    photo: <img src={img2} alt="MacBook" />,
    name: "Macbook",
    price: 23222,
    stock: 213,
    action: <Link to="/admin/products/sfsfsf">Manage</Link>
  }
];

const Products = () => {

  const [data] = useState<DataType[]>(arr);

  const Table = useCallback(TableHOC<DataType>(columns, data, "dashboard-product-box", "Products",true),[]);

  return (
      <div className="adminContainer">
        <AdminSidebar />
        <main>{Table()}</main>
        <Link to="/admin/products/new" className="create-product-btn"><FaPlus /></Link>
      </div>
  )
}

export default Products;