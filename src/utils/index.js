import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const numberFormat = (value) =>
  new Intl.NumberFormat("ja-JP", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export default numberFormat;

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export function createPDF(selected, userInput, userOutput) {
  const document = {
    content: [
      { text: `Тип  вклада: ${selected.name}`, style: "header" },
      { text: `Cумма: ${numberFormat(userInput.summ)} руб.`, style: "default" },
      { text: `Срок в днях: ${userInput.term}`, style: "default" },
      {
        text: `Процентная ставка: ${userOutput.perc} % годовых`,
        style: "default",
      },
      {
        text: `Доход за выбранный период составит: ${numberFormat(
          userOutput.income
        )} руб.`,
        style: "default",
      },
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 10],
      },
      default: {
        margin: [0, 5, 0, 5],
      },
    },
  };
  pdfMake.createPdf(document).print();
}
