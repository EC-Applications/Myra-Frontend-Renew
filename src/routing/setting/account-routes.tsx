import { Connections } from "@/modules/settings/account/connections";
import DesktopNotifications from "@/modules/settings/account/notifications/desktop";
import EmailNotifications from "@/modules/settings/account/notifications/email";
import Notifications from "@/modules/settings/account/notifications/index";
import MobileNotifications from "@/modules/settings/account/notifications/mobile";
import SlackNotifications from "@/modules/settings/account/notifications/slack";
import Preferences from "@/modules/settings/account/preferences";
import Profile from "@/modules/settings/account/profile";
import SecurityAccess from "@/modules/settings/account/security-access";
import { Navigate, Route, Routes } from "react-router";

const AccountRoutes = () => {
  return (
    <Routes>
      <Route path="/preferences" element={<Preferences />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications">
        <Route index element={<Notifications />} />
        <Route path="desktop" element={<DesktopNotifications />} />
        <Route path="mobile" element={<MobileNotifications />} />
        <Route path="email" element={<EmailNotifications />} />
        <Route path="slack" element={<SlackNotifications />} />
      </Route>
      <Route path="/security" element={<SecurityAccess />} />
      <Route path="/connections" element={<Connections />} />
      <Route path="/*" element={<Navigate to="../preferences" />} />
    </Routes>
  );
};

export default AccountRoutes;
