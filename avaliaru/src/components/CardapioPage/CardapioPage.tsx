import styles from "./CardapioPage.module.css";
import CardapioCard from "./CardapioCard";

export type CardapioDiario = {
  id: number;
  dia: string;
  pratoPrincipal: string;
  vegetariano: string;
  guarnicao: string;
  acompanhamentos: string;
  sobremesa: string;
};

export default function CardapioPage() {
  const dadosDoCardapio: CardapioDiario[] = [
    {
      id: 1,
      dia: "Segunda-feira",
      pratoPrincipal: "Frango Assado",
      vegetariano: "Lasanha de Berinjela",
      guarnicao: "Purê de Batatas",
      acompanhamentos: "Arroz Branco e Feijão Carioca",
      sobremesa: "Fruta da Estação",
    },
    {
      id: 2,
      dia: "Terça-feira",
      pratoPrincipal: "Carne de Panela com Batatas",
      vegetariano: "Estrogonofe de Grão de Bico",
      guarnicao: "Macarrão Alho e Óleo",
      acompanhamentos: "Arroz Branco e Feijão Preto",
      sobremesa: "Gelatina de Morango",
    },
    {
      id: 3,
      dia: "Quarta-feira",
      pratoPrincipal: "Feijoada Tradicional",
      vegetariano: "Feijoada Vegana",
      guarnicao: "Couve Refogada e Farofa",
      acompanhamentos: "Arroz Branco e Laranja",
      sobremesa: "Doce de Leite",
    },
    {
      id: 4,
      dia: "Quinta-feira",
      pratoPrincipal: "Iscas de Suíno Aceboladas",
      vegetariano: "Hambúrguer de Lentilha",
      guarnicao: "Polenta Cremosa",
      acompanhamentos: "Arroz Branco e Feijão Carioca",
      sobremesa: "Pudim de Chocolate",
    },
    {
      id: 5,
      dia: "Sexta-feira",
      pratoPrincipal: "Peixe ao Molho de Coco",
      vegetariano: "Moqueca de Banana da Terra",
      guarnicao: "Pirão de Peixe",
      acompanhamentos: "Arroz Branco e Feijão Preto",
      sobremesa: "Paçoca",
    },
    {
      id: 6,
      dia: "Sábado",
      pratoPrincipal: "Estrogonofe de Frango",
      vegetariano: "Escondidinho de Soja",
      guarnicao: "Batata Palha",
      acompanhamentos: "Arroz Branco e Feijão Carioca",
      sobremesa: "Fruta da Estação",
    },
  ];
  return (
    <main className={styles.paginaCardapio}>
      <h1 className={styles.tituloPrincipal}>Cardápio da Semana - FGA</h1>
      <div className={styles.container}>
        {dadosDoCardapio.map((menu) => (
          <CardapioCard
            key={menu.id}
            id={menu.id}
            dia={menu.dia}
            pratoPrincipal={menu.pratoPrincipal}
            vegetariano={menu.vegetariano}
            guarnicao={menu.guarnicao}
            acompanhamentos={menu.acompanhamentos}
            sobremesa={menu.sobremesa}
          />
        ))}
      </div>
    </main>
  );
}
