import { cardapioDiario, cardapioDiarioItem, prato, restricaoAlimentar, restricaoContemPrato, users } from './schema'; // Importe seu schema

import { db } from './db';

type NovoCardapioDiario = typeof cardapioDiario.$inferInsert

async function main() {
    console.log('Adicionando registros das restrições alimentares...');

    // Insira seus registros iniciais aqui
    await db.insert(restricaoAlimentar).values([
        { codigo: 'cogumelo', emoji: '🍄', nome: 'Cogumelo', descricao: 'Pratos com cogumelos.' },
        { codigo: 'leite', emoji: '🥛', nome: 'Leite e derivados', descricao: 'Leite, queijo, manteiga e creme.' },
        { codigo: 'mel', emoji: '🍯', nome: 'Mel', descricao: 'Preparações com mel.' },
        { codigo: 'pimenta', emoji: '🌶️', nome: 'Pimenta', descricao: 'Molhos e temperos apimentados.' },
        { codigo: 'soja', emoji: '🌱', nome: 'Soja', descricao: 'Proteína, bebida ou molho de soja.' },
        { codigo: 'gluten', emoji: '🌾', nome: 'Trigo/Glúten', descricao: 'Pães, massas, torradas e trigo.' },
        { codigo: 'amendoim', emoji: '🥜', nome: 'Amendoim', descricao: 'Pasta de amendoim e derivados.' },
        { codigo: 'oleaginosa', emoji: '🌰', nome: 'Oleaginosa', descricao: 'Castanhas, nozes e semelhantes.' },
        { codigo: 'ovo', emoji: '🥚', nome: 'Ovo', descricao: 'Omelete, ovos mexidos e preparações.' },
        { codigo: 'suino', emoji: '🐷', nome: 'Suíno', descricao: 'Carne suína, feijoada e derivados.' }
    ]).onConflictDoNothing();

    await db.insert(prato).values([
        { "idPrato": "pao_frances", "nome": "Pão francês" },
        { "idPrato": "pao_careca", "nome": "Pão careca" },
        { "idPrato": "pao_integral", "nome": "Pão integral" },
        { "idPrato": "pao_de_queijo", "nome": "Pão de queijo" },
        { "idPrato": "bolo", "nome": "Bolo" },
        { "idPrato": "bolo_vegetariano", "nome": "Bolo vegetariano" },
        { "idPrato": "carne_desfiada", "nome": "Carne desfiada" },
        { "idPrato": "frango_desfiada", "nome": "Frango desfiado" },
        { "idPrato": "ovos_mexidos", "nome": "Ovos mexidos" },
        { "idPrato": "pate_de_frango", "nome": "Patê de frango" },
        { "idPrato": "queijo_mucarela", "nome": "Queijo muçarela" },
        { "idPrato": "carne_moida", "nome": "Carne moída" },
        { "idPrato": "manteiga_ou_creme_vegetal", "nome": "Manteiga ou creme vegetal" },
        { "idPrato": "iogurte_natural", "nome": "Iogurte natural" },
        { "idPrato": "queijo_minas", "nome": "Queijo minas" },
        { "idPrato": "pasta_de_ricota", "nome": "Pasta de ricota" },
        { "idPrato": "bebida_lactea", "nome": "Bebida láctea" },
        { "idPrato": "pasta_de_amendoim", "nome": "Pasta de amendoim" },
        { "idPrato": "caponata_de_berinjela", "nome": "Caponata de berinjela" },
        { "idPrato": "homus_de_grao_de_bico", "nome": "Homus de grão de bico" },
        { "idPrato": "homus_de_abobora", "nome": "Homus de abóbora" },
        { "idPrato": "geleia_rustica_de_abacaxi_e_chia", "nome": "Geleia rústica de abacaxi e chia" },
        { "idPrato": "pasta_de_batata_doce_com_amendoim", "nome": "Pasta de batata doce com amendoim" },
        { "idPrato": "maionese_de_abacate", "nome": "Maionese de abacate" },
        { "idPrato": "banana", "nome": "Banana" },
        { "idPrato": "melancia", "nome": "Melancia" },
        { "idPrato": "abacaxi", "nome": "Abacaxi" },
        { "idPrato": "melao", "nome": "Melão" },
        { "idPrato": "maca", "nome": "Maçã" },
        { "idPrato": "salada_de_frutas", "nome": "Salada de frutas" },
        { "idPrato": "mamao", "nome": "Mamão" },
        { "idPrato": "frango_assado_com_manjericao", "nome": "Frango assado com manjericão" },
        { "idPrato": "suino_ao_molho_de_bacon", "nome": "Suíno ao molho de bacon" },
        { "idPrato": "isca_de_carne_ao_curry", "nome": "Isca de carne ao curry" },
        { "idPrato": "strogonoff_de_frango", "nome": "Strogonoff de frango" },
        { "idPrato": "carne_de_sol", "nome": "Carne de sol" },
        { "idPrato": "feijoada", "nome": "Feijoada" },
        { "idPrato": "frango_assado", "nome": "Frango assado" },
        { "idPrato": "bife_de_carne_bovina_ao_molho", "nome": "Bife de carne bovina ao molho" },
        { "idPrato": "suino_ao_molho_de_barbecue", "nome": "Suíno ao molho de barbecue" },
        { "idPrato": "torta_de_frango", "nome": "Torta de frango" },
        { "idPrato": "quiche_de_legumes_e_lentilha_gratinada", "nome": "Quiche de legumes e lentilha gratinada" },
        { "idPrato": "ovos_assados_ao_sugo", "nome": "Ovos assados ao sugo" },
        { "idPrato": "iscas_de_soja_ao_sugo_gratinadas", "nome": "Iscas de soja ao sugo gratinadas" },
        { "idPrato": "risoto_de_brocolis_com_couve_e_queijo", "nome": "Risoto de brócolis com couve e queijo" },
        { "idPrato": "omelete_de_cebola_ao_forno", "nome": "Omelete de cebola ao forno" },
        { "idPrato": "hamburguer_de_ervilha_gratinado", "nome": "Hambúrguer de ervilha gratinado" },
        { "idPrato": "delicia_de_lentilha", "nome": "Delícia de lentilha" },
        { "idPrato": "refogado_de_lentilha_couve_flor_e_brocolis", "nome": "Refogado de lentilha, couve-flor e brócolis" },
        { "idPrato": "berinjela_recheada_com_homus_de_grao_de_bico", "nome": "Berinjela recheada com homus de grão de bico" },
        { "idPrato": "polpetone_de_quinoa", "nome": "Polpetone de quinoa" },
        { "idPrato": "almondega_de_soja_ao_sugo", "nome": "Almôndega de soja ao sugo" },
        { "idPrato": "feijoada_vegetariana", "nome": "Feijoada vegetariana" },
        { "idPrato": "ervilha_com_couve_flor_ao_curry", "nome": "Ervilha com couve-flor ao curry" },
        { "idPrato": "espaguete_com_abobrinha_e_soja_ao_sugo", "nome": "Espaguete com abobrinha e soja ao sugo" },
        { "idPrato": "jardineira_verde_chuchu_e_abobrinha", "nome": "Jardineira verde (Chuchu e abobrinha)" },
        { "idPrato": "cenoura_refogada_com_salsinha", "nome": "Cenoura refogada com salsinha" },
        { "idPrato": "batata_saute", "nome": "Batata sauté" },
        { "idPrato": "mandioca_cozida", "nome": "Mandioca cozida" },
        { "idPrato": "farofa_crocante", "nome": "Farofa crocante" },
        { "idPrato": "milho_cozido", "nome": "Milho cozido" },
        { "idPrato": "beterraba_com_salsinha", "nome": "Beterraba com salsinha" },
        { "idPrato": "mix_de_doces", "nome": "Mix de doces" },
        { "idPrato": "fruta", "nome": "Fruta" },
        { "idPrato": "mexerica", "nome": "Mexerica" },
        { "idPrato": "laranja", "nome": "Laranja" },
        { "idPrato": "lagarto_ao_molho_escuro", "nome": "Lagarto ao molho escuro" },
        { "idPrato": "file_de_peixe_ao_molho_de_coco", "nome": "Filé de peixe ao molho de coco" },
        { "idPrato": "cubos_de_carne_acebolada", "nome": "Cubos de carne acebolada" },
        { "idPrato": "suino_com_cebola_caramelizada", "nome": "Suíno com cebola caramelizada" },
        { "idPrato": "file_de_frango_ao_sugo", "nome": "Filé de frango ao sugo" },
        { "idPrato": "hamburguer_gratinado", "nome": "Hambúrguer gratinado" },
        { "idPrato": "isca_de_frango_ao_molho_branco", "nome": "Isca de frango ao molho branco" },
        { "idPrato": "cubos_de_carne_ao_molho_de_vinho", "nome": "Cubos de carne ao molho de vinho" },
        { "idPrato": "ovos_mexidos_com_castanhas", "nome": "Ovos mexidos com castanhas" },
        { "idPrato": "escondidinho_de_ervilha_gratinado", "nome": "Escondidinho de ervilha gratinado" },
        { "idPrato": "cuscuz_vegetariano_com_queijo_minas", "nome": "Cuscuz vegetariano com queijo minas" },
        { "idPrato": "quibe_de_legumes_com_quinoa_gratinado", "nome": "Quibe de legumes com quinoa gratinado" },
        { "idPrato": "nhoque_ao_molho_branco_com_soja_e_queijo", "nome": "Nhoque ao molho branco com soja e queijo" },
        { "idPrato": "baiao_de_dois_com_queijo_coalho", "nome": "Baião de dois com queijo coalho" },
        { "idPrato": "omelete_caprese", "nome": "Omelete caprese" },
        { "idPrato": "tomate_recheado_com_soja", "nome": "Tomate recheado com soja" },
        { "idPrato": "bolinho_de_ervilha", "nome": "Bolinho de ervilha" },
        { "idPrato": "bobo_de_legumes_com_soja", "nome": "Bobó de legumes com soja" },
        { "idPrato": "refogado_de_grao_de_bico", "nome": "Refogado de grão de bico" },
        { "idPrato": "moqueca_de_banana_da_terra_com_proteina_de_soja", "nome": "Moqueca de banana da terra com proteína de soja" },
        { "idPrato": "bolinho_de_grao_de_bico", "nome": "Bolinho de grão de bico" },
        { "idPrato": "batata_recheada_com_quinoa", "nome": "Batata recheada com quinoa" },
        { "idPrato": "creme_de_abobora", "nome": "Creme de abóbora" },
        { "idPrato": "sopa_de_fuba", "nome": "Sopa de fubá" },
        { "idPrato": "creme_de_legumes", "nome": "Creme de legumes" },
        { "idPrato": "sopa_de_macarrao_com_legumes", "nome": "Sopa de macarrão com legumes" },
        { "idPrato": "creme_de_cebola_e_alho_poro", "nome": "Creme de cebola e alho poró" },
        { "idPrato": "creme_de_mandioca", "nome": "Creme de mandioca" },
        { "idPrato": "creme_verde_de_ervilha_e_couve", "nome": "Creme verde de ervilha e couve" },
        { "idPrato": "arroz_branco", "nome": "Arroz branco" },
        { "idPrato": "arroz_integral", "nome": "Arroz integral" },
        { "idPrato": "feijao_carioca", "nome": "Feijão carioca" },
        { "idPrato": "farofa_crocante", "nome": "Farofa crocante" },
        { "idPrato": "legumes_no_vapor", "nome": "Legumes no vapor" },
        { "idPrato": "salada_mista", "nome": "Salada mista" },
        { "idPrato": "beterraba_com_salsinha", "nome": "Beterraba com salsinha" },
        { "idPrato": "mandioca_cozida", "nome": "Mandioca cozida" },
        { "idPrato": "milho_cozido", "nome": "Milho cozido" },
        { "idPrato": "cenoura_refogada_com_salsinha", "nome": "Cenoura refogada com salsinha" },
        { "idPrato": "batata_saute", "nome": "Batata sauté" },
        { "idPrato": "torrada", "nome": "Torrada" },
        { "idPrato": "chipotle_limao", "nome": "Chipotle com limão" },
        { "idPrato": "mostarda_e_mel", "nome": "Mostarda e mel" },
    ]).onConflictDoNothing()

    const dias = [
        { data: "2026-06-15" }, // Segunda
        { data: "2026-06-16" }, // Terça
        { data: "2026-06-17" }, // Quarta
        { data: "2026-06-18" }, // Quinta
        { data: "2026-06-19" }, // Sexta
        { data: "2026-06-20" }, // Sábado
    ];

    await db.insert(cardapioDiario).values(dias).onConflictDoNothing();

    const itensCardapio: Array<{
        data: string;
        campo: string;
        idPrato: string;
    }> = [
            // ==================== SEGUNDA-FEIRA (15/06) ====================
            // Café
            { data: "2026-06-15", campo: "panificacao", idPrato: "pao_frances" },
            { data: "2026-06-15", campo: "panificacao", idPrato: "pao_integral" },
            { data: "2026-06-15", campo: "opcao_extra", idPrato: "pao_de_queijo" },
            { data: "2026-06-15", campo: "complemento_padrao_cafe", idPrato: "ovos_mexidos" },
            { data: "2026-06-15", campo: "complemento_padrao_cafe", idPrato: "queijo_minas" },
            { data: "2026-06-15", campo: "complemento_padrao_cafe", idPrato: "manteiga_ou_creme_vegetal" },
            { data: "2026-06-15", campo: "complemento_ovolactovegetariano_cafe", idPrato: "ovos_mexidos" },
            { data: "2026-06-15", campo: "complemento_ovolactovegetariano_cafe", idPrato: "queijo_minas" },
            { data: "2026-06-15", campo: "complemento_ovolactovegetariano_cafe", idPrato: "manteiga_ou_creme_vegetal" },
            { data: "2026-06-15", campo: "complemento_vegetariano_estrito_cafe", idPrato: "homus_de_grao_de_bico" },
            { data: "2026-06-15", campo: "complemento_vegetariano_estrito_cafe", idPrato: "geleia_rustica_de_abacaxi_e_chia" },
            { data: "2026-06-15", campo: "complemento_vegetariano_estrito_cafe", idPrato: "pasta_de_amendoim" },
            { data: "2026-06-15", campo: "fruta", idPrato: "banana" },

            // Almoço
            { data: "2026-06-15", campo: "prato_principal_padrao_almoco", idPrato: "frango_assado_com_manjericao" },
            { data: "2026-06-15", campo: "prato_principal_ovolactovegetariano_almoco", idPrato: "risoto_de_brocolis_com_couve_e_queijo" },
            { data: "2026-06-15", campo: "prato_principal_vegetariano_estrito_almoco", idPrato: "refogado_de_lentilha_couve_flor_e_brocolis" },
            { data: "2026-06-15", campo: "guarnicao", idPrato: "arroz_branco" },
            { data: "2026-06-15", campo: "guarnicao", idPrato: "feijao_carioca" },
            { data: "2026-06-15", campo: "guarnicao", idPrato: "farofa_crocante" },
            { data: "2026-06-15", campo: "sobremesa_almoco", idPrato: "fruta" },

            // Jantar
            { data: "2026-06-15", campo: "prato_principal_padrao_jantar", idPrato: "bife_de_carne_bovina_ao_molho" },
            { data: "2026-06-15", campo: "prato_principal_ovolactovegetariano_jantar", idPrato: "omelete_caprese" },
            { data: "2026-06-15", campo: "prato_principal_vegetariano_estrito_jantar", idPrato: "berinjela_recheada_com_homus_de_grao_de_bico" },
            { data: "2026-06-15", campo: "sopa", idPrato: "creme_de_abobora" },
            { data: "2026-06-15", campo: "sobremesa_jantar", idPrato: "mexerica" },

            // ==================== TERÇA-FEIRA (16/06) ====================
            { data: "2026-06-16", campo: "panificacao", idPrato: "pao_careca" },
            { data: "2026-06-16", campo: "panificacao", idPrato: "pao_de_queijo" },
            { data: "2026-06-16", campo: "opcao_extra", idPrato: "bolo" },
            { data: "2026-06-16", campo: "complemento_padrao_cafe", idPrato: "pate_de_frango" },
            { data: "2026-06-16", campo: "complemento_padrao_cafe", idPrato: "manteiga_ou_creme_vegetal" },
            { data: "2026-06-16", campo: "complemento_padrao_cafe", idPrato: "queijo_mucarela" },
            { data: "2026-06-16", campo: "complemento_ovolactovegetariano_cafe", idPrato: "pate_de_frango" },
            { data: "2026-06-16", campo: "complemento_ovolactovegetariano_cafe", idPrato: "manteiga_ou_creme_vegetal" },
            { data: "2026-06-16", campo: "complemento_ovolactovegetariano_cafe", idPrato: "queijo_mucarela" },
            { data: "2026-06-16", campo: "complemento_vegetariano_estrito_cafe", idPrato: "caponata_de_berinjela" },
            { data: "2026-06-16", campo: "complemento_vegetariano_estrito_cafe", idPrato: "homus_de_abobora" },
            { data: "2026-06-16", campo: "fruta", idPrato: "maca" },

            { data: "2026-06-16", campo: "prato_principal_padrao_almoco", idPrato: "suino_ao_molho_de_bacon" },
            { data: "2026-06-16", campo: "prato_principal_ovolactovegetariano_almoco", idPrato: "quiche_de_legumes_e_lentilha_gratinada" },
            { data: "2026-06-16", campo: "prato_principal_vegetariano_estrito_almoco", idPrato: "polpetone_de_quinoa" },
            { data: "2026-06-16", campo: "guarnicao", idPrato: "arroz_branco" },
            { data: "2026-06-16", campo: "guarnicao", idPrato: "feijao_carioca" },
            { data: "2026-06-16", campo: "guarnicao", idPrato: "beterraba_com_salsinha" },
            { data: "2026-06-16", campo: "sobremesa_almoco", idPrato: "laranja" },

            { data: "2026-06-16", campo: "prato_principal_padrao_jantar", idPrato: "carne_de_sol" },
            { data: "2026-06-16", campo: "prato_principal_ovolactovegetariano_jantar", idPrato: "cuscuz_vegetariano_com_queijo_minas" },
            { data: "2026-06-16", campo: "prato_principal_vegetariano_estrito_jantar", idPrato: "espaguete_com_abobrinha_e_soja_ao_sugo" },
            { data: "2026-06-16", campo: "sopa", idPrato: "sopa_de_macarrao_com_legumes" },
            { data: "2026-06-16", campo: "sobremesa_jantar", idPrato: "fruta" },

            // ==================== QUARTA-FEIRA (17/06) ====================
            { data: "2026-06-17", campo: "panificacao", idPrato: "pao_frances" },
            { data: "2026-06-17", campo: "panificacao", idPrato: "pao_integral" },
            { data: "2026-06-17", campo: "opcao_extra", idPrato: "pao_de_queijo" },
            { data: "2026-06-17", campo: "complemento_padrao_cafe", idPrato: "ovos_mexidos_com_castanhas" },
            { data: "2026-06-17", campo: "complemento_padrao_cafe", idPrato: "queijo_minas" },
            { data: "2026-06-17", campo: "complemento_padrao_cafe", idPrato: "manteiga_ou_creme_vegetal" },
            { data: "2026-06-17", campo: "complemento_ovolactovegetariano_cafe", idPrato: "ovos_mexidos_com_castanhas" },
            { data: "2026-06-17", campo: "complemento_ovolactovegetariano_cafe", idPrato: "queijo_minas" },
            { data: "2026-06-17", campo: "complemento_ovolactovegetariano_cafe", idPrato: "manteiga_ou_creme_vegetal" },
            { data: "2026-06-17", campo: "complemento_vegetariano_estrito_cafe", idPrato: "homus_de_grao_de_bico" },
            { data: "2026-06-17", campo: "complemento_vegetariano_estrito_cafe", idPrato: "pasta_de_batata_doce_com_amendoim" },
            { data: "2026-06-17", campo: "fruta", idPrato: "mamao" },

            { data: "2026-06-17", campo: "prato_principal_padrao_almoco", idPrato: "strogonoff_de_frango" },
            { data: "2026-06-17", campo: "prato_principal_ovolactovegetariano_almoco", idPrato: "escondidinho_de_ervilha_gratinado" },
            { data: "2026-06-17", campo: "prato_principal_vegetariano_estrito_almoco", idPrato: "almondega_de_soja_ao_sugo" },
            { data: "2026-06-17", campo: "guarnicao", idPrato: "arroz_branco" },
            { data: "2026-06-17", campo: "guarnicao", idPrato: "feijao_carioca" },
            { data: "2026-06-17", campo: "guarnicao", idPrato: "legumes_no_vapor" },
            { data: "2026-06-17", campo: "sobremesa_almoco", idPrato: "salada_de_frutas" },

            { data: "2026-06-17", campo: "prato_principal_padrao_jantar", idPrato: "file_de_peixe_ao_molho_de_coco" },
            { data: "2026-06-17", campo: "prato_principal_ovolactovegetariano_jantar", idPrato: "baiao_de_dois_com_queijo_coalho" },
            { data: "2026-06-17", campo: "prato_principal_vegetariano_estrito_jantar", idPrato: "tomate_recheado_com_soja" },
            { data: "2026-06-17", campo: "sopa", idPrato: "creme_verde_de_ervilha_e_couve" },
            { data: "2026-06-17", campo: "sobremesa_jantar", idPrato: "fruta" },

            // ==================== QUINTA-FEIRA (18/06) ====================
            { data: "2026-06-18", campo: "panificacao", idPrato: "pao_frances" },
            { data: "2026-06-18", campo: "opcao_extra", idPrato: "iogurte_natural" },
            { data: "2026-06-18", campo: "complemento_padrao_cafe", idPrato: "queijo_minas" },
            { data: "2026-06-18", campo: "complemento_padrao_cafe", idPrato: "manteiga_ou_creme_vegetal" },
            { data: "2026-06-18", campo: "complemento_padrao_cafe", idPrato: "pasta_de_ricota" },
            { data: "2026-06-18", campo: "complemento_ovolactovegetariano_cafe", idPrato: "queijo_minas" },
            { data: "2026-06-18", campo: "complemento_ovolactovegetariano_cafe", idPrato: "manteiga_ou_creme_vegetal" },
            { data: "2026-06-18", campo: "complemento_ovolactovegetariano_cafe", idPrato: "pasta_de_ricota" },
            { data: "2026-06-18", campo: "complemento_vegetariano_estrito_cafe", idPrato: "homus_de_abobora" },
            { data: "2026-06-18", campo: "complemento_vegetariano_estrito_cafe", idPrato: "maionese_de_abacate" },
            { data: "2026-06-18", campo: "fruta", idPrato: "melancia" },

            { data: "2026-06-18", campo: "prato_principal_padrao_almoco", idPrato: "lagarto_ao_molho_escuro" },
            { data: "2026-06-18", campo: "prato_principal_ovolactovegetariano_almoco", idPrato: "nhoque_ao_molho_branco_com_soja_e_queijo" },
            { data: "2026-06-18", campo: "prato_principal_vegetariano_estrito_almoco", idPrato: "refogado_de_grao_de_bico" },
            { data: "2026-06-18", campo: "guarnicao", idPrato: "arroz_integral" },
            { data: "2026-06-18", campo: "guarnicao", idPrato: "feijao_carioca" },
            { data: "2026-06-18", campo: "guarnicao", idPrato: "salada_mista" },
            { data: "2026-06-18", campo: "sobremesa_almoco", idPrato: "mexerica" },

            { data: "2026-06-18", campo: "prato_principal_padrao_jantar", idPrato: "cubos_de_carne_acebolada" },
            { data: "2026-06-18", campo: "prato_principal_ovolactovegetariano_jantar", idPrato: "quibe_de_legumes_com_quinoa_gratinado" },
            { data: "2026-06-18", campo: "prato_principal_vegetariano_estrito_jantar", idPrato: "bolinho_de_grao_de_bico" },
            { data: "2026-06-18", campo: "sopa", idPrato: "creme_de_cebola_e_alho_poro" },
            { data: "2026-06-18", campo: "sobremesa_jantar", idPrato: "fruta" },

            // ==================== SEXTA-FEIRA (19/06) ====================
            { data: "2026-06-19", campo: "panificacao", idPrato: "pao_frances" },
            { data: "2026-06-19", campo: "panificacao", idPrato: "pao_careca" },
            { data: "2026-06-19", campo: "opcao_extra", idPrato: "bolo_vegetariano" },
            { data: "2026-06-19", campo: "complemento_padrao_cafe", idPrato: "ovos_mexidos" },
            { data: "2026-06-19", campo: "complemento_padrao_cafe", idPrato: "queijo_mucarela" },
            { data: "2026-06-19", campo: "complemento_padrao_cafe", idPrato: "manteiga_ou_creme_vegetal" },
            { data: "2026-06-19", campo: "complemento_ovolactovegetariano_cafe", idPrato: "ovos_mexidos" },
            { data: "2026-06-19", campo: "complemento_ovolactovegetariano_cafe", idPrato: "queijo_mucarela" },
            { data: "2026-06-19", campo: "complemento_ovolactovegetariano_cafe", idPrato: "manteiga_ou_creme_vegetal" },
            { data: "2026-06-19", campo: "complemento_vegetariano_estrito_cafe", idPrato: "geleia_rustica_de_abacaxi_e_chia" },
            { data: "2026-06-19", campo: "complemento_vegetariano_estrito_cafe", idPrato: "pasta_de_amendoim" },
            { data: "2026-06-19", campo: "fruta", idPrato: "abacaxi" },

            { data: "2026-06-19", campo: "prato_principal_padrao_almoco", idPrato: "feijoada" },
            { data: "2026-06-19", campo: "prato_principal_ovolactovegetariano_almoco", idPrato: "feijoada_vegetariana" },
            { data: "2026-06-19", campo: "prato_principal_vegetariano_estrito_almoco", idPrato: "feijoada_vegetariana" },
            { data: "2026-06-19", campo: "guarnicao", idPrato: "arroz_branco" },
            { data: "2026-06-19", campo: "guarnicao", idPrato: "feijao_carioca" },
            { data: "2026-06-19", campo: "guarnicao", idPrato: "farofa_crocante" },
            { data: "2026-06-19", campo: "sobremesa_almoco", idPrato: "fruta" },

            { data: "2026-06-19", campo: "prato_principal_padrao_jantar", idPrato: "suino_com_cebola_caramelizada" },
            { data: "2026-06-19", campo: "prato_principal_ovolactovegetariano_jantar", idPrato: "omelete_de_cebola_ao_forno" },
            { data: "2026-06-19", campo: "prato_principal_vegetariano_estrito_jantar", idPrato: "moqueca_de_banana_da_terra_com_proteina_de_soja" },
            { data: "2026-06-19", campo: "sopa", idPrato: "creme_de_mandioca" },
            { data: "2026-06-19", campo: "sobremesa_jantar", idPrato: "mix_de_doces" },

            // ==================== SÁBADO (20/06) ====================
            { data: "2026-06-20", campo: "panificacao", idPrato: "pao_integral" },
            { data: "2026-06-20", campo: "panificacao", idPrato: "pao_de_queijo" },
            { data: "2026-06-20", campo: "opcao_extra", idPrato: "pao_de_queijo" },
            { data: "2026-06-20", campo: "complemento_padrao_cafe", idPrato: "queijo_minas" },
            { data: "2026-06-20", campo: "complemento_padrao_cafe", idPrato: "manteiga_ou_creme_vegetal" },
            { data: "2026-06-20", campo: "complemento_padrao_cafe", idPrato: "bebida_lactea" },
            { data: "2026-06-20", campo: "complemento_ovolactovegetariano_cafe", idPrato: "queijo_minas" },
            { data: "2026-06-20", campo: "complemento_ovolactovegetariano_cafe", idPrato: "manteiga_ou_creme_vegetal" },
            { data: "2026-06-20", campo: "complemento_ovolactovegetariano_cafe", idPrato: "bebida_lactea" },
            { data: "2026-06-20", campo: "complemento_vegetariano_estrito_cafe", idPrato: "homus_de_grao_de_bico" },
            { data: "2026-06-20", campo: "complemento_vegetariano_estrito_cafe", idPrato: "caponata_de_berinjela" },
            { data: "2026-06-20", campo: "fruta", idPrato: "melao" },

            { data: "2026-06-20", campo: "prato_principal_padrao_almoco", idPrato: "file_de_frango_ao_sugo" },
            { data: "2026-06-20", campo: "prato_principal_ovolactovegetariano_almoco", idPrato: "hamburguer_de_ervilha_gratinado" },
            { data: "2026-06-20", campo: "prato_principal_vegetariano_estrito_almoco", idPrato: "bobo_de_legumes_com_soja" },
            { data: "2026-06-20", campo: "guarnicao", idPrato: "arroz_branco" },
            { data: "2026-06-20", campo: "guarnicao", idPrato: "feijao_carioca" },
            { data: "2026-06-20", campo: "guarnicao", idPrato: "mandioca_cozida" },
            { data: "2026-06-20", campo: "sobremesa_almoco", idPrato: "fruta" },

            { data: "2026-06-20", campo: "prato_principal_padrao_jantar", idPrato: "hamburguer_gratinado" },
            { data: "2026-06-20", campo: "prato_principal_ovolactovegetariano_jantar", idPrato: "delicia_de_lentilha" },
            { data: "2026-06-20", campo: "prato_principal_vegetariano_estrito_jantar", idPrato: "batata_recheada_com_quinoa" },
            { data: "2026-06-20", campo: "sopa", idPrato: "sopa_de_fuba" },
            { data: "2026-06-20", campo: "sobremesa_jantar", idPrato: "fruta" },


        ];

    await db
        .insert(cardapioDiarioItem)
        .values(itensCardapio)
        .onConflictDoNothing();


    const restricaoContemPratoSeed = [
        // CAFÉ DA MANHÃ
        { fkRestricao: "leite", fkPrato: "pao_de_queijo" },
        { fkRestricao: "leite", fkPrato: "queijo_mucarela" },
        { fkRestricao: "leite", fkPrato: "queijo_minas" },
        { fkRestricao: "leite", fkPrato: "pasta_de_ricota" },
        { fkRestricao: "leite", fkPrato: "iogurte_natural" },
        { fkRestricao: "leite", fkPrato: "bebida_lactea" },
        { fkRestricao: "leite", fkPrato: "bolo" },
        { fkRestricao: "ovo", fkPrato: "ovos_mexidos" },
        { fkRestricao: "ovo", fkPrato: "pate_de_frango" },
        { fkRestricao: "amendoim", fkPrato: "pasta_de_amendoim" },
        { fkRestricao: "amendoim", fkPrato: "pasta_de_batata_doce_com_amendoim" },
        // { fkRestricao: "soja", fkPrato: "bolonhesa_de_soja" }, ← REMOVIDO: prato não existe
        { fkRestricao: "gluten", fkPrato: "pao_frances" },
        { fkRestricao: "gluten", fkPrato: "pao_careca" },
        { fkRestricao: "gluten", fkPrato: "pao_integral" },
        { fkRestricao: "gluten", fkPrato: "bolo" },
        { fkRestricao: "ovo", fkPrato: "bolo" },
        { fkRestricao: "amendoim", fkPrato: "bolo" },
        { fkRestricao: "leite", fkPrato: "ovos_mexidos" },

        // ALMOÇO
        { fkRestricao: "pimenta", fkPrato: "chipotle_limao" },
        { fkRestricao: "mel", fkPrato: "mostarda_e_mel" },
        { fkRestricao: "suino", fkPrato: "suino_ao_molho_de_bacon" },
        { fkRestricao: "pimenta", fkPrato: "isca_de_carne_ao_curry" },
        { fkRestricao: "leite", fkPrato: "strogonoff_de_frango" },
        { fkRestricao: "ovo", fkPrato: "strogonoff_de_frango" },
        { fkRestricao: "amendoim", fkPrato: "strogonoff_de_frango" },
        { fkRestricao: "leite", fkPrato: "carne_de_sol" },
        { fkRestricao: "suino", fkPrato: "feijoada" },
        { fkRestricao: "suino", fkPrato: "suino_ao_molho_de_barbecue" },
        { fkRestricao: "ovo", fkPrato: "torta_de_frango" },
        { fkRestricao: "leite", fkPrato: "torta_de_frango" },
        { fkRestricao: "leite", fkPrato: "quiche_de_legumes_e_lentilha_gratinada" },
        { fkRestricao: "ovo", fkPrato: "quiche_de_legumes_e_lentilha_gratinada" },
        { fkRestricao: "amendoim", fkPrato: "quiche_de_legumes_e_lentilha_gratinada" },
        { fkRestricao: "ovo", fkPrato: "ovos_assados_ao_sugo" },
        { fkRestricao: "soja", fkPrato: "iscas_de_soja_ao_sugo_gratinadas" },
        { fkRestricao: "leite", fkPrato: "iscas_de_soja_ao_sugo_gratinadas" },
        { fkRestricao: "leite", fkPrato: "risoto_de_brocolis_com_couve_e_queijo" },
        { fkRestricao: "ovo", fkPrato: "risoto_de_brocolis_com_couve_e_queijo" },
        { fkRestricao: "leite", fkPrato: "omelete_de_cebola_ao_forno" },
        { fkRestricao: "ovo", fkPrato: "omelete_de_cebola_ao_forno" },
        { fkRestricao: "leite", fkPrato: "hamburguer_de_ervilha_gratinado" },
        { fkRestricao: "leite", fkPrato: "delicia_de_lentilha" },
        { fkRestricao: "ovo", fkPrato: "delicia_de_lentilha" },
        { fkRestricao: "amendoim", fkPrato: "delicia_de_lentilha" },
        { fkRestricao: "soja", fkPrato: "almondega_de_soja_ao_sugo" },
        { fkRestricao: "soja", fkPrato: "feijoada_vegetariana" },
        { fkRestricao: "pimenta", fkPrato: "ervilha_com_couve_flor_ao_curry" },
        { fkRestricao: "soja", fkPrato: "espaguete_com_abobrinha_e_soja_ao_sugo" },
        { fkRestricao: "ovo", fkPrato: "espaguete_com_abobrinha_e_soja_ao_sugo" },
        { fkRestricao: "soja", fkPrato: "farofa_crocante" },

        // JANTAR
        { fkRestricao: "soja", fkPrato: "lagarto_ao_molho_escuro" },
        { fkRestricao: "leite", fkPrato: "file_de_peixe_ao_molho_de_coco" },
        { fkRestricao: "ovo", fkPrato: "file_de_peixe_ao_molho_de_coco" },
        { fkRestricao: "suino", fkPrato: "suino_com_cebola_caramelizada" },
        { fkRestricao: "soja", fkPrato: "suino_com_cebola_caramelizada" },
        { fkRestricao: "leite", fkPrato: "hamburguer_gratinado" },
        { fkRestricao: "leite", fkPrato: "isca_de_frango_ao_molho_branco" },
        { fkRestricao: "ovo", fkPrato: "isca_de_frango_ao_molho_branco" },
        { fkRestricao: "ovo", fkPrato: "ovos_mexidos_com_castanhas" },
        { fkRestricao: "amendoim", fkPrato: "ovos_mexidos_com_castanhas" },
        { fkRestricao: "oleaginosa", fkPrato: "ovos_mexidos_com_castanhas" },
        { fkRestricao: "leite", fkPrato: "ovos_mexidos_com_castanhas" },
        { fkRestricao: "leite", fkPrato: "escondidinho_de_ervilha_gratinado" },
        { fkRestricao: "leite", fkPrato: "cuscuz_vegetariano_com_queijo_minas" },
        { fkRestricao: "leite", fkPrato: "quibe_de_legumes_com_quinoa_gratinado" },
        { fkRestricao: "ovo", fkPrato: "quibe_de_legumes_com_quinoa_gratinado" },
        { fkRestricao: "amendoim", fkPrato: "quibe_de_legumes_com_quinoa_gratinado" },
        { fkRestricao: "leite", fkPrato: "nhoque_ao_molho_branco_com_soja_e_queijo" },
        { fkRestricao: "ovo", fkPrato: "nhoque_ao_molho_branco_com_soja_e_queijo" },
        { fkRestricao: "soja", fkPrato: "nhoque_ao_molho_branco_com_soja_e_queijo" },
        { fkRestricao: "leite", fkPrato: "baiao_de_dois_com_queijo_coalho" },
        { fkRestricao: "ovo", fkPrato: "baiao_de_dois_com_queijo_coalho" },
        { fkRestricao: "leite", fkPrato: "omelete_caprese" },
        { fkRestricao: "ovo", fkPrato: "omelete_caprese" },
        { fkRestricao: "soja", fkPrato: "tomate_recheado_com_soja" },
        { fkRestricao: "soja", fkPrato: "bolinho_de_ervilha" },
        { fkRestricao: "soja", fkPrato: "bobo_de_legumes_com_soja" },
        { fkRestricao: "soja", fkPrato: "refogado_de_grao_de_bico" },
        { fkRestricao: "soja", fkPrato: "moqueca_de_banana_da_terra_com_proteina_de_soja" },
        { fkRestricao: "soja", fkPrato: "bolinho_de_grao_de_bico" },
        { fkRestricao: "gluten", fkPrato: "sopa_de_macarrao_com_legumes" },
        { fkRestricao: "ovo", fkPrato: "sopa_de_macarrao_com_legumes" },
        { fkRestricao: "gluten", fkPrato: "torrada" },

        // SOBREMESA
        { fkRestricao: "amendoim", fkPrato: "mix_de_doces" },
        { fkRestricao: "oleaginosa", fkPrato: "mix_de_doces" },
        { fkRestricao: "leite", fkPrato: "mix_de_doces" },
    ];

    await db
        .insert(restricaoContemPrato)
        .values(restricaoContemPratoSeed)
        .onConflictDoNothing();

    await db
    .insert(users)
    .values({
        name: "Rafael Laube",
        passwordHash: "$2b$10$G9L/1sbyyTDJakkMAfCAKe.OeJsWFOn1wBBVxUKsYdSIaX2f4Bc1S",
        perfil: "aluno",
        email: "rafaellaube11@gmail.com"
    })

    process.exit(0);
}


main().catch((err) => {
    console.error('Erro ao popular o banco de dados:', err);
    process.exit(1);
});
