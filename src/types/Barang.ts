// types.ts
export interface Barang {
    id?: number;
    nama: string;
    kategori: "Elektronik" | "Pakaian" | "Makanan" | "Lainnya";
    jumlah: number;
    harga: number;
    tanggalMasuk: string;
  }
  