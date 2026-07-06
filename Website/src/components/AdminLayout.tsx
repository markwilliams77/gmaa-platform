import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      <Outlet />
    </div>
  );
}
