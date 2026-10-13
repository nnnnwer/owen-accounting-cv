/**
 * ============================================================
 *  EXCEL WORK SHOWCASE — your own Excel files shown on the website.
 * ============================================================
 *  1. Copy your .xlsx file into  public/excel/   (e.g. public/excel/my-budget.xlsx)
 *     Tip: use simple file names without spaces or Lao characters.
 *  2. Add an entry below. The first entry opens automatically.
 *  3. Save → the file appears on the "Excel" page for every visitor.
 *
 *  Notes
 *  - Files in public/ are public: anyone can view/download them. Remove any private
 *    or confidential data (names, salaries, bank details) before publishing.
 *  - Save the file in Excel before copying it, so formula results are stored in the file.
 *  - isSample: true shows a "Sample · fictional data" badge. Use false for your own work.
 *  - allowDownload: true shows a "Download" button for the original file.
 */
export const excelShowcase = [
  // {
  //   id: 'sample-financial-report',
  //   file: '/excel/sample-financial-report.xlsx',
  //   title: {
  //     en: 'Income Statement & Budget Report',
  //     lo: 'ໃບລາຍງານຜົນໄດ້ຮັບ ແລະ ລາຍງານງົບປະມານ',
  //   },
  //   description: {
  //     en: 'Quarterly income statement, budget-vs-actual analysis and monthly data, built with SUM and variance formulas. Click a cell to see its formula.',
  //     lo: 'ໃບລາຍງານຜົນໄດ້ຮັບປະຈຳໄຕມາດ, ການວິເຄາະງົບປະມານທຽບກັບຕົວຈິງ ແລະ ຂໍ້ມູນລາຍເດືອນ ສ້າງດ້ວຍສູດ SUM ແລະ ສູດຄິດໄລ່ສ່ວນຕ່າງ. ກົດທີ່ຕາລາງເພື່ອເບິ່ງສູດ.',
  //   },
  //   isSample: true,
  //   allowDownload: true,
  // },
   {
     id: 'monthly-expenses',
     file: '/excel/monthly-expenses.xlsx',
     title: { en: 'Monthly expense tracker', lo: 'ຕາຕະລາງຕິດຕາມລາຍຈ່າຍປະຈຳເດືອນ' },
     description: { en: 'What this file shows…', lo: '…' },
     isSample: false,       // false = ป้าย "My work"
     allowDownload: true,   // true = มีปุ่มดาวน์โหลดไฟล์ต้นฉบับ
   },

]
