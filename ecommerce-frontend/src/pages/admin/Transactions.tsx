import { ReactElement, useCallback, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Column } from "react-table";
import TableHOC from "../../components/admin/TableHOC";
import { Link } from "react-router-dom";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement
};

const columns: Column<DataType>[] = [
  {
    Header: "User",
    accessor: "user"
  },
  {
    Header: "Amount",
    accessor: "amount"
  },
  {
    Header: "Discount",
    accessor: "discount"
  },
  {
    Header: "Quantity",
    accessor: "quantity"
  },
  {
    Header: "Status",
    accessor: "status"
  },
  {
    Header: "Action",
    accessor: "action"
  }
];

const arr:DataType[] = [
  {
    user: "Salman",
    amount: 4500,
    discount: 400,
    quantity: 3,
    status: <span className="red">Processing</span>,
    action: <Link to="/admin/transactions/hoggsoww">Manage</Link>
  },
  {
    user: "Salman",
    amount: 4500,
    discount: 400,
    quantity: 3,
    status: <span className="red">Processing</span>,
    action: <Link to="/admin/transactions/hoggsoww">Manage</Link>
  },
  {
    user: "Salman",
    amount: 4500,
    discount: 400,
    quantity: 3,
    status: <span className="red">Processing</span>,
    action: <Link to="/admin/transactions/hoggsoww">Manage</Link>
  }
];

const Transactions = () => {

  const [data] = useState<DataType[]>(arr);

  const Table = useCallback(TableHOC<DataType>(columns, data, "dashboard-product-box", "Transactions", true),[]);
  
  return (
    <div className="adminContainer">
      <AdminSidebar />
      <main>{Table()}</main>
    </div>
  )
}

export default Transactions;