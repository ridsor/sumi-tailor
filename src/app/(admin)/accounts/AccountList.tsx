import AdminItem from "./AccountItem";

export default function AdminList() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full" cellPadding={10}>
        <thead>
          <tr className="border-b">
            <td width={30} className="font-semibold px-2">
              No
            </td>
            <td className="font-semibold px-2">Nama</td>
            <td className="font-semibold px-2">Email</td>
            <td className="font-semibold px-2">Terakhir Aktif</td>
            <td className="font-semibold px-2">Aksi</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <AdminItem />
        </tbody>
      </table>
    </div>
  );
}