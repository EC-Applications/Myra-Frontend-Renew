import { Asks } from "@/modules/settings/features/asks";
import CustomerRequests from "@/modules/settings/features/customer-request";
import { Documents } from "@/modules/settings/features/documents";
import { DocumentForm } from "@/modules/settings/features/documents-form";
import { Emojis } from "@/modules/settings/features/emojis";
import { Initiatives } from "@/modules/settings/features/initiatives";
import { ProductIntelligence } from "@/modules/settings/features/product-intelligence";
import Pulse from "@/modules/settings/features/pulse";
import { Navigate, Route, Routes } from "react-router";

const FeatureRoutes = () => {
  return (
    <Routes>
      <Route path="initiatives" element={<Initiatives />} />
      <Route path="documents">
        <Route index element={<Documents />} />
        <Route path="new" element={<DocumentForm />} />
        <Route path=":id/edit" element={<DocumentForm />} />
      </Route>
      <Route path="customers-requests" element={<CustomerRequests />} />
      <Route path="pulse" element={<Pulse />} />
      <Route path="product-intelligence" element={<ProductIntelligence />} />
      <Route path="asks" element={<Asks />} />
      <Route path="emojis" element={<Emojis />} />
      <Route path="/*" element={<Navigate to="../initiatives" />} />
    </Routes>
  );
};

export default FeatureRoutes;
