"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ProductCostData {
    sku: string;
    name?: string;
    cost: number;
}

export async function syncProductCosts(data: ProductCostData[]) {
    try {
        // Toplu işlem (transaction) ile veritabanına kayıt
        const results = await Promise.all(
            data.map(async (item) => {
                return prisma.productCost.upsert({
                    where: { sku: item.sku },
                    update: {
                        name: item.name,
                        cost: item.cost,
                    },
                    create: {
                        sku: item.sku,
                        name: item.name,
                        cost: item.cost,
                    },
                });
            })
        );

        // SyncLog oluştur (Opsiyonel ama iyi bir pratik)
        await prisma.syncLog.create({
            data: {
                module: "COST_UPLOAD",
                status: "SUCCESS",
                message: `${results.length} ürün maliyeti güncellendi/eklendi.`,
            },
        });

        revalidatePath("/costs");
        revalidatePath("/"); // Dashboard'daki stok/maliyet bilgilerini güncellemek için

        return { success: true, count: results.length };
    } catch (error: any) {
        console.error("Database sync error:", error);

        // Hata logu oluştur
        try {
            await prisma.syncLog.create({
                data: {
                    module: "COST_UPLOAD",
                    status: "FAILED",
                    message: error.message || "Bilinmeyen bir hata oluştu.",
                },
            });
        } catch (logErr) {
            console.error("Failed to create error log:", logErr);
        }

        return { success: false, error: "Veritabanı senkronizasyonu sırasında bir hata oluştu." };
    }
}
