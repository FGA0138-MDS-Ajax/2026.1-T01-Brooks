import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/db';
import { restricaoAlimentar, estudantePossuiRestricao } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request:NextRequest) {
    try{
        const { searchParams } = new URL(request.url);
        const usuarioId = searchParams.get('usuarioId');

        if (!usuarioId){
            return NextResponse.json(
            { erro: "Parâmetro usuarioId é obrigatório" }, 
            {status: 400});
        }

        const restricoes = await db
        .select({
            codigo: restricaoAlimentar.codigo,
            nome: restricaoAlimentar.nome
        })

        .from(estudantePossuiRestricao)
        .innerJoin(restricaoAlimentar, eq(estudantePossuiRestricao.fkRestricao, restricaoAlimentar.codigo))
        .where(eq(estudantePossuiRestricao.fkEstudante, usuarioId));

        return NextResponse.json({ restricoes }, {status: 200})
        
    } catch (error) {
        console.error('Erro interno no servidor', error);
        return NextResponse.json(
        { erro: "Erro ao buscar restrições do usuário:"}, 
        {status : 500});
    }
}