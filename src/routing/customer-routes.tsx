import CustomerDetail from "@/modules/customers/customer-detail";
import Customers from "@/modules/customers/customers";
import { Route, Routes } from "react-router";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Customers />} />
      <Route path=":id" element={<CustomerDetail />} />
    </Routes>
  );
};

export default CustomerRoutes;
