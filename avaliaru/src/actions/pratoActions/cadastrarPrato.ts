"use server";

import { db } from "@/lib/db/db";
import { prato } from "@/lib/db/schema";

export async function cadastrarPrato(formData: FormData) {
    const codigo = formData.get("codigo") as string;
    const nome = formData.get("nome") as string;

    const result = db.insert(prato).values({ idPrato: codigo, nome }).run()

    if (!result) {
        throw new Error("Erro ao cadastrar o prato");
    }

    return result;
}