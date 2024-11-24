import React, { useEffect, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import FormBarang from "./components/FormBarang";
import { FaTrashAlt } from "react-icons/fa";
import { dummyData } from "./constan/barang";
import { Barang } from "./types/Barang";
import { FaEdit } from "react-icons/fa";
import CurrencyFormat from "react-currency-format";
import { useCSVDownloader } from "react-papaparse";
import { FaDownload } from "react-icons/fa6";

const App: React.FC = () => {
  const [barang, setBarang] = useLocalStorage<Barang[]>("barang", []);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showAddBarang, setShowBarang] = useState(false);
  const [loadingDeleteIndex, setLoadingDeleteIndex] = useState<number | null>(
    null
  );
  const [disabledEditIndex, setDisabledEditIndex] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const loadInitialData = () => {
    const existingData = localStorage.getItem("barang5");
    if (!existingData) {
      localStorage.setItem("barang5", JSON.stringify(dummyData));
    } else {
      setBarang(JSON.parse(existingData));
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleAdd = (values: Barang) => {
    if (editIndex !== null) {
      const updated = [...barang];
      updated[editIndex] = values;
      setBarang(updated);
      setEditIndex(null);
      setDisabledEditIndex(null);
    } else {
      setBarang([...barang, values]);
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setDisabledEditIndex(index);
    setShowBarang(true);
  };

  const handleDelete = (index: number) => {
    setLoadingDeleteIndex(index);
    setTimeout(() => {
      setBarang(barang.filter((_, i) => i !== index));
      setLoadingDeleteIndex(null);
    }, 2000);
  };

  const handleCloseForm = () => {
    setShowBarang(false);
    setEditIndex(null);
    setDisabledEditIndex(null);
  };

  const filteredBarang = barang.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const csvData = filteredBarang.map((item) => ({
    "Nama Barang": item.nama,
    Kategori: item.kategori,
    Jumlah: item.jumlah,
    "Harga Total": item.jumlah * item.harga,
    "Tanggal Masuk": item.tanggalMasuk,
  }));

  const { CSVDownloader, Type } = useCSVDownloader();

  return (
    <div className="w-screen max-w-screen-xl mx-auto">
      <div className="mx-auto flex flex-col">
        <div className="navbar bg-gray-200 sticky top-0 rounded-lg shadow-md">
          <a className="btn btn-ghost text-xl">Lingkar Rasio Store</a>
        </div>

        <div className="w-full md:w-2/3 mx-auto my-1 py-2 px-5">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Cari Nama Barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-2/3 mx-auto my-1 py-2 px-5 shadow-sm rounded-md">
          <span className="flex flex-row gap-2">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                setShowBarang(!showAddBarang);
                if (showAddBarang) {
                  handleCloseForm();
                }
              }}
            >
              {showAddBarang ? "Tutup" : "Tambah Barang"}
            </button>
            <CSVDownloader
              type={Type.Button}
              filename="data_barang.csv"
              bom={true}
              config={{
                delimiter: ",",
              }}
              data={csvData}
              className="btn btn-success"
            >
              <FaDownload />
            </CSVDownloader>
          </span>
          {showAddBarang ? (
            <FormBarang
              onSuccess={() => handleCloseForm()}
              onClose={handleCloseForm}
              onSubmit={handleAdd}
              initialData={editIndex !== null ? barang[editIndex] : undefined}
            />
          ) : (
            ""
          )}
        </div>

        <div className="w-full md:w-2/3 mx-auto my-2 py-2 px-5">
          <table className="min-w-full table border-collapse border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border p-2 font-bold text-center">
                  Nama Barang
                </th>
                <th className="border p-2 font-bold text-center hidden md:table-cell">
                  Kategori
                </th>
                <th className="border p-2 font-bold text-center">Jumlah</th>
                <th className="border p-2 font-bold text-center">
                  Harga Total
                </th>
                <th className="border p-2 font-bold text-center hidden md:table-cell">
                  Tanggal Masuk
                </th>
                <th className="border p-2 font-bold text-center">Aksi</th>
              </tr>
            </thead>

            {filteredBarang.length >= 1 ? (
              <tbody>
                {filteredBarang.map((item, index) => (
                  <tr
                    className={`${index % 2 === 0 ? "bg-slate-100" : ""}`}
                    key={index}
                  >
                    <td className="border p-2 text-xs">{item.nama}</td>
                    <td className="border p-2 text-xs hidden md:table-cell">
                      {item.kategori}
                    </td>
                    <td className="border p-2 text-xs text-center">
                      {item.jumlah}
                    </td>
                    <td className="border p-2 text-xs text-center">
                      <CurrencyFormat
                        value={item.jumlah * item.harga}
                        displayType={"text"}
                        thousandSeparator={true}
                        type="text"
                        prefix={"Rp. "}
                        renderText={(value) => <div>{value}</div>}
                      />
                    </td>
                    <td className="border p-2 text-xs text-center hidden md:table-cell">
                      {item.tanggalMasuk}
                    </td>
                    <td className="border p-2 text-xs text-center flex flex-row items-center">
                      <button
                        onClick={() => handleEdit(index)}
                        className="btn btn-sm btn-circle btn-warning text-white p-1 text-xs"
                        disabled={
                          disabledEditIndex !== null &&
                          disabledEditIndex !== index
                        }
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="btn btn-sm btn-circle btn-error p-1 ml-2 text-white"
                        disabled={
                          loadingDeleteIndex !== null &&
                          loadingDeleteIndex !== index
                        }
                      >
                        {loadingDeleteIndex === index ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          <FaTrashAlt />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tr className="w-full text-center py-5">
                <td colSpan={6}>Tidak Ada Barang Terdaftar</td>
              </tr>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
