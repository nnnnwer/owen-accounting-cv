/**
 * ============================================================
 *  PORTFOLIO PROJECTS — edit, remove or add your own work.
 * ============================================================
 *  isSample: true  → shows a "Sample project · fictional data" badge.
 *                    Set it to false ONLY for work you really did with real data.
 *  preview         → optional live mini-report built from the demo data:
 *                    'incomeStatement' | 'budgetVariance' | 'expenseMix' | null
 *  link            → optional page or URL (e.g. '/dashboard' or a Google Drive link)
 */
export const portfolioProjects = [
  {
    id: 'excel-work',
    category: 'spreadsheet',
    isSample: false,
    title: { en: 'Excel Work Viewer', lo: 'ຜົນງານ Excel' },
    summary: {
      en: 'My Excel files shown on this website exactly as they look in Microsoft Excel — sheet tabs, formula bar, merged cells and number formats. Click any cell to see the formula behind it.',
      lo: 'ໄຟລ໌ Excel ຂອງຂ້ອຍ ສະແດງໃນເວັບໄຊນີ້ຄືກັບທີ່ເຫັນໃນ Microsoft Excel — ແຖບແຜ່ນງານ, ແຖບສູດ, ຕາລາງທີ່ລວມກັນ ແລະ ຮູບແບບຕົວເລກ. ກົດທີ່ຕາລາງໃດກໍໄດ້ເພື່ອເບິ່ງສູດ.',
    },
    skills: ['Excel', 'Formulas', 'Financial reporting'],
    preview: null,
    link: '/dashboard',
  },
  {
    id: 'income-statement',
    category: 'report',
    isSample: true,
    title: { en: 'Quarterly Income Statement Summary', lo: 'ສະຫຼຸບໃບລາຍງານຜົນໄດ້ຮັບປະຈຳໄຕມາດ' },
    summary: {
      en: 'Monthly transactions summarised into quarterly revenue, expenses, net profit and margin — the format management uses to review performance.',
      lo: 'ສະຫຼຸບທຸລະກຳລາຍເດືອນເປັນລາຍຮັບ, ລາຍຈ່າຍ, ກຳໄລສຸດທິ ແລະ ອັດຕາກຳໄລ ປະຈຳໄຕມາດ ເຊິ່ງເປັນຮູບແບບທີ່ຜູ້ບໍລິຫານໃຊ້ທົບທວນຜົນການດຳເນີນງານ.',
    },
    skills: ['Financial reporting', 'Excel SUMIFS', 'Accuracy checks'],
    preview: 'incomeStatement',
    link: '',
  },
  {
    id: 'budget-variance',
    category: 'analysis',
    isSample: true,
    title: { en: 'Budget vs Actual Variance Analysis', lo: 'ການວິເຄາະສ່ວນຕ່າງ ງົບປະມານ ທຽບກັບ ຕົວຈິງ' },
    summary: {
      en: 'Compares planned and actual spending by cost category for the year and highlights where spending ran above budget.',
      lo: 'ທຽບລາຍຈ່າຍຕາມແຜນກັບລາຍຈ່າຍຕົວຈິງ ແຍກຕາມໝວດຄ່າໃຊ້ຈ່າຍ ຕະຫຼອດປີ ແລະ ຊີ້ໃຫ້ເຫັນໝວດທີ່ໃຊ້ຈ່າຍເກີນງົບປະມານ.',
    },
    skills: ['Variance analysis', 'Budgeting', 'Excel'],
    preview: 'budgetVariance',
    link: '',
  },
  {
    id: 'expense-mix',
    category: 'spreadsheet',
    isSample: true,
    title: { en: 'Operating Expense Breakdown', lo: 'ການແຍກລາຍລະອຽດຄ່າໃຊ້ຈ່າຍໃນການດຳເນີນງານ' },
    summary: {
      en: 'Shows how total operating expenses are split across categories, as a share of the total, to support cost-control discussions.',
      lo: 'ສະແດງການແບ່ງຄ່າໃຊ້ຈ່າຍໃນການດຳເນີນງານທັງໝົດ ຕາມແຕ່ລະໝວດ ເປັນອັດຕາສ່ວນຂອງຍອດລວມ ເພື່ອຊ່ວຍໃນການຄວບຄຸມຕົ້ນທຶນ.',
    },
    skills: ['Data analysis', 'Charts', 'Reporting'],
    preview: 'expenseMix',
    link: '',
  },
]
