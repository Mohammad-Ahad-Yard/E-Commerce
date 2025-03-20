import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { ReactElement, useCallback, useState } from "react";
import TableHOC from "../../components/admin/TableHOC";
import { FaTrash } from "react-icons/fa";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement
};

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar"
  },
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Gender",
    accessor: "gender"
  },
  {
    Header: "Email",
    accessor: "email"
  },
  {
    Header: "Role",
    accessor: "role"
  },
  {
    Header: "Action",
    accessor: "action"
  }
];

const img1 = "https://randomuser.me/api/portraits/women/54.jpg";
const img2 = "https://randomuser.me/api/portraits/women/50.jpg";

const arr:DataType[] = [
  {
    avatar: <img src={img1} style={{borderRadius:'50%'}} alt="Shoes" />,
    name: "Emily Palmer",
    email: 'emily@gmail.com',
    gender: 'Female',
    role: 'user',
    action: <button><FaTrash /></button>
  },
  {
    avatar: <img src={img2} style={{borderRadius:'50%'}} alt="Shoes" />,
    name: "Emily Palmer",
    email: 'emily@gmail.com',
    gender: 'Female',
    role: 'user',
    action: <button><FaTrash /></button>
  }
];

const Customers = () => {

  const [data] = useState<DataType[]>(arr);

  const Table = useCallback(TableHOC<DataType>(columns, data, "dashboard-product-box", "Customers",true),[]);

  return (
    <div className="adminContainer">
      <AdminSidebar />
      <main>{Table()}</main>
    </div>
  )
}

export default Customers;