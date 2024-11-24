import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Barang } from "../types/Barang";
import CurrencyFormat from "react-currency-format";

interface FormBarangProps {
  onSubmit: (values: Barang) => void;
  initialData?: Barang;
  onSuccess: () => void;
  onClose: () => void;
}

const FormBarang: React.FC<FormBarangProps> = ({ onSubmit, initialData, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false); // State untuk indikator loading

  const formik = useFormik<Barang>({
    enableReinitialize: true,
    initialValues: {
      nama: initialData?.nama || "",
      kategori: initialData?.kategori || "Elektronik",
      jumlah: initialData?.jumlah || 1,
      harga: initialData?.harga || 100,
      tanggalMasuk: initialData?.tanggalMasuk || "",
    },
    validationSchema: Yup.object({
      nama: Yup.string().required("Nama barang wajib diisi."),
      kategori: Yup.string()
        .oneOf(["Elektronik", "Pakaian", "Makanan", "Lainnya"])
        .required(),
      jumlah: Yup.number()
        .min(1, "Minimal jumlah adalah 1")
        .required("Jumlah wajib diisi."),
      harga: Yup.number()
        .min(100, "Minimal harga adalah Rp100")
        .required("Harga wajib diisi."),
      tanggalMasuk: Yup.date()
        .max(new Date(), "Tanggal tidak boleh lebih dari hari ini")
        .required("Tanggal wajib diisi."),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setTimeout(() => {
        onSubmit(values);
        setLoading(false);
        onSuccess();
        onClose();
        formik.resetForm();
      }, 2000);
    },
  });

  const handleCurrencyChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    formik.setFieldValue("harga", parseInt(numericValue, 10) || 0);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3 p-2">
      <input
        type="text"
        placeholder="Nama Barang"
        {...formik.getFieldProps("nama")}
        className={`border p-2 rounded-md shadow-sm tracking-wide ${formik.errors.nama ? 'border-2 border-red-500' : ''}`}
      />
      {formik.touched.nama && formik.errors.nama && (
        <p className="text-red-500">{formik.errors.nama}</p>
      )}

      <select
        {...formik.getFieldProps("kategori")}
        className={`border p-2 rounded-md shadow-sm tracking-wide ${formik.errors.kategori ? 'border-2 border-red-500' : ''}`}
      >
        <option value="Elektronik">Elektronik</option>
        <option value="Pakaian">Pakaian</option>
        <option value="Makanan">Makanan</option>
        <option value="Lainnya">Lainnya</option>
      </select>

      <input
        type="number"
        placeholder="Jumlah Barang"
        {...formik.getFieldProps("jumlah")}
        className={`border p-2 rounded-md shadow-sm tracking-wide ${formik.errors.jumlah ? 'border-2 border-red-500' : ''}`}
        min={1}
      />
      {formik.touched.jumlah && formik.errors.jumlah && (
        <p className="text-red-500">{formik.errors.jumlah}</p>
      )}

      <CurrencyFormat
        value={formik.values.harga}
        onValueChange={(values) => handleCurrencyChange(values.value)}
        thousandSeparator={true}
        prefix={"Rp. "}
        className={`border p-2 rounded-md shadow-sm tracking-wide ${formik.errors.harga ? 'border-2 border-red-500' : ''}`}
        displayType="input"
      />
      {formik.touched.harga && formik.errors.harga && (
        <p className="text-red-500">{formik.errors.harga}</p>
      )}

      <input
        type="date"
        {...formik.getFieldProps("tanggalMasuk")}
        className={`border p-2 rounded-md shadow-sm tracking-wide ${formik.errors.tanggalMasuk ? 'border-2 border-red-500' : ''}`}
      />
      {formik.touched.tanggalMasuk && formik.errors.tanggalMasuk && (
        <p className="text-red-500">{formik.errors.tanggalMasuk}</p>
      )}

      <button
        type="submit"
        className={`btn btn-primary p-2 ${loading || !formik.isValid ? 'disabled' : ''}`}
        disabled={loading || !formik.isValid}
      >
        {loading ? <span className="loading loading-spinner loading-sm"></span> : "Simpan"}
      </button>
    </form>
  );
};

export default FormBarang;
