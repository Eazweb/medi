import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Admin Dashboard",
};
const DashbaordPage = () => {
  return (
    <AdminLayout activeItem="">
      <div className="w-full h-full flex justify-center items-center">
        Welcome Admin
      </div>
    </AdminLayout>
  );
};

export default DashbaordPage;
