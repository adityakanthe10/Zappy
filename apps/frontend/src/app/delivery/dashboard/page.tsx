import PendingOrders from "../../../components/Order/Delivery/DeliveryOrder";

export const metadata = {
  title: "Pending Orders | Zappy",
  description: "Pending Orders",
};

const Dashboard = () => {
  return (
    <>
      <PendingOrders />
    </>
  );
};

export default Dashboard;
