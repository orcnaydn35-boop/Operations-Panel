"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, FileText, CheckCircle2, AlertCircle, Save, X } from "lucide-react";
import { clsx } from "clsx";
import { syncProductCosts } from "./actions";

interface ExcelRow {
    SKU: string;
    Name?: string;
    Cost: number;
}

export default function CostUploadPage() {
    const [data, setData] = useState<ExcelRow[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setSuccess(null);
        setIsUploading(true);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws) as any[];

                // Basit validasyon ve dönüşüm
                const formattedData: ExcelRow[] = jsonData
                    .map((row: any) => ({
                        SKU: row.SKU || row["Ürün Kodu"] || row["Stok Kodu"],
                        Name: row.Name || row["Ürün Adı"] || row["Ad"],
                        Cost: parseFloat(row.Cost || row["Maliyet"] || row["Fiyat"] || "0"),
                    }))
                    .filter((row) => row.SKU && !isNaN(row.Cost));

                if (formattedData.length === 0) {
                    throw new Error("Geçerli veri bulunamadı. Lütfen SKU ve Maliyet sütunlarının olduğundan emin olun.");
                }

                setData(formattedData);
                setSuccess(`${formattedData.length} ürün başarıyla yüklendi ve ön izleme hazır.`);
            } catch (err: any) {
                setError(err.message || "Excel dosyası okunurken bir hata oluştu.");
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    const clearData = () => {
        setData([]);
        setError(null);
        setSuccess(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };



    const handleSaveToDatabase = async () => {
        setIsUploading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await syncProductCosts(data.map(item => ({
                sku: item.SKU,
                name: item.Name,
                cost: item.Cost
            })));

            if (result.success) {
                setSuccess(`${result.count} ürün başarıyla veritabanına kaydedildi.`);
                setData([]); // İşlem bitince listeyi temizle
            } else {
                setError(result.error || "Bir hata oluştu.");
            }
        } catch (err) {
            setError("Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="heading-xl">Maliyet Yükle</h1>
                {data.length > 0 && (
                    <button
                        onClick={clearData}
                        className="btn glass flex items-center gap-2"
                        style={{ color: 'var(--error)' }}
                    >
                        <X size={18} />
                        Listeyi Temizle
                    </button>
                )}
            </div>

            {/* Upload Zone */}
            {data.length === 0 && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="glass glass-card flex flex-col items-center justify-center p-12 cursor-pointer hover:border-[#c9a86a] transition-all group"
                    style={{ borderStyle: 'dashed', borderWidth: '2px', textAlign: 'center' }}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".xlsx, .xls"
                        className="hidden"
                    />
                    <div className="bg-[#c9a86a1a] p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <Upload size={40} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '0.5rem' }}>Excel Dosyasını Buraya Bırak</h3>
                    <p style={{ color: '#888', maxWidth: '300px' }}>
                        .xlsx veya .xls formatında, SKU ve Maliyet bilgilerini içeren dosyanızı yükleyin.
                    </p>
                </div>
            )}

            {/* Status Messages */}
            {error && (
                <div className="glass p-4 flex items-center gap-3" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--error)' }}>
                    <AlertCircle color="var(--error)" size={20} />
                    <span style={{ color: 'var(--error)' }}>{error}</span>
                </div>
            )}

            {success && (
                <div className="glass p-4 flex items-center gap-3" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--success)' }}>
                    <CheckCircle2 color="var(--success)" size={20} />
                    <span style={{ color: 'var(--success)' }}>{success}</span>
                </div>
            )}

            {/* Preview Table */}
            {data.length > 0 && (
                <div className="glass glass-card animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-6">
                        <h2 style={{ fontSize: '1.2rem' }}>Ön İzleme ({data.length} Ürün)</h2>
                        <button
                            onClick={handleSaveToDatabase}
                            disabled={isUploading}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Save size={18} />
                            {isUploading ? "Kaydediliyor..." : "Veritabanına Kaydet"}
                        </button>
                    </div>

                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th><div className="flex items-center gap-2"><FileText size={14} /> SKU</div></th>
                                    <th>Ürün Adı</th>
                                    <th>Maliyet (₺)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.SKU}</td>
                                        <td>{row.Name || "-"}</td>
                                        <td style={{ color: 'var(--primary)', fontWeight: '510' }}>
                                            {row.Cost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
