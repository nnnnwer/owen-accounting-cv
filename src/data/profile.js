/**
 * ============================================================
 *  PERSONAL PROFILE — edit this file to update the whole site.
 * ============================================================
 *  - Every text has two versions: `lo` (Lao) and `en` (English).
 *  - Leave a field as an empty string '' to hide it on the website.
 *  - Only add facts that are true. Do not add degrees, certificates,
 *    jobs or numbers you do not actually have.
 */

export const profile = {
  name: 'Owen Thilakoun',
  initials: 'OT',

  /** Used to calculate age automatically (YYYY-MM-DD). */
  dateOfBirth: '2004-06-25',

  /**
   * Profile photo: put a square image in /public/images/ (WebP or JPG,
   * about 400×400 px and under 60 KB is ideal) and set the path, e.g.
   * '/images/profile.webp'. Leave '' to show initials instead.
   */
  photo: 'public/images/profile.webp',

  headline: {
    en: 'Accounting & Financial',
    lo: 'ບັນຊີ',
  },

  location: {
    en: 'Ban Chokham, Saysittha, Vientiane, Laos',
    // TODO: please verify the Lao spelling of the village and district names.
    lo: 'ບ້ານໂຊກຄຳ, ເມືອງໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
  },

  summary: {
    en: 'I have a background in Computer Engineering from the National University of Laos and am interested in accounting and finance roles. I work in a systematic and detail-oriented manner: organizing data in Excel, carefully verifying numbers, and summarizing data into easy-to-understand reports.',
    lo: 'ຂ້ອຍມີຄວາມຮູ້ດ້ານວິສະວະກຳຄອມພິວເຕີ ຈາກມະຫາວິທະຍາໄລແຫ່ງຊາດ ແລະ ກຳລັງສົນໃຈວຽກດ້ານບັນຊີ ແລະ ການເງິນ. ຂ້ອຍມີວິທີເຮັດວຽກແບບເປັນລະບົບ ແລະ ລະອຽດ: ຈັດລະບຽບຂໍ້ມູນໃນ Excel, ກວດສອບຕົວເລກຢ່າງລະມັດລະວັງ ແລະ ສະຫຼຸບຕົວເລກອອກມາເປັນລາຍງານທີ່ເຂົ້າໃຈງ່າຍ.',
  },

  careerObjective: {
    en: 'I want to start working in an accounting or finance position to apply my Excel and problem-solving skills to accurate bookkeeping and financial reporting, while simultaneously developing formal accounting knowledge alongside work.',
    lo: 'ຕ້ອງການເລີ່ມຕົ້ນເຮັດວຽກໃນຕຳແໜ່ງບັນຊີ ຫຼື ການເງິນ ເພື່ອນຳໃຊ້ທັກສະ Excel, ການແກ້ໄຂບັນຫາ ເຂົ້າໃນການບັນທຶກບັນຊີ ແລະ ການລາຍງານການເງິນທີ່ຖືກຕ້ອງ ພ້ອມທັງພັດທະນາຄວາມຮູ້ດ້ານບັນຊີຢ່າງເປັນທາງການໄປພ້ອມກັບການເຮັດວຽກ.',
  },

  /**
   * CONTACT DETAILS — copy them from your CV.
   * Empty values are hidden automatically. Examples:
   *   email: 'name@example.com'
   *   phone: '+856 20 xxxx xxxx'
   *   whatsapp: '8562012345678'   (digits only, with country code)
   *   linkedin: 'https://www.linkedin.com/in/your-name'
   *   facebook: 'https://www.facebook.com/your.page'
   */
  contacts: {
    email: 'vivoting1234@gmail.com',
    phone: '+856 20 5514 3004',
    whatsapp: '',
    linkedin: '',
    facebook: '',
  },

  /** TODO: verify degree title, faculty and years before publishing. */
  education: [
    {
      degree: {
        en: 'Bachelor of Engineering in Computer Engineering',
        lo: 'ປະລິນຍາຕີ ວິສະວະກຳສາດ ສາຂາວິສະວະກຳຄອມພິວເຕີ',
      },
      school: {
        en: 'Faculty of Engineering, Computer Engineering Department, National University of Laos',
        lo: 'ຄະນະວິສະວະກຳສາດ, ສາຂາວິສະວະກຳຄອມພິວເຕີ, ມະຫາວິທະຍາໄລແຫ່ງຊາດ',
      },
      period: '2022 – 2026',
      details: {
        en: 'Technical foundation in logic, data handling, systems thinking and structured problem-solving.',
        lo: 'ພື້ນຖານດ້ານເຫດຜົນ, ການຈັດການຂໍ້ມູນ, ການຄິດເປັນລະບົບ ແລະ ການແກ້ໄຂບັນຫາຢ່າງເປັນຂັ້ນຕອນ.',
      },
    },
  ],

  /**
   * WORK EXPERIENCE — add only real positions (internships, part-time,
   * volunteer, family business, student projects...). Example:
   * {
   *   role: { en: 'Accounting Intern', lo: 'ນັກສຶກສາຝຶກງານບັນຊີ' },
   *   organization: { en: 'Company name', lo: 'ຊື່ບໍລິສັດ' },
   *   period: 'Jan 2027 – Mar 2027',
   *   points: [{ en: 'What you did', lo: 'ສິ່ງທີ່ເຮັດ' }],
   * }
   */
  // From the reference CV — please verify the dates and the Lao spelling.
  experience: [
    {
      role: { en: 'Web Front-End Intern', lo: 'ນັກສຶກສາຝຶກງານ Web Front-End' },
      organization: { en: 'Ryobi Lao Co., Ltd.', lo: 'ບໍລິສັດ ລຽວບີ ລາວ ຈຳກັດ (Ryobi Lao Co., Ltd.)' },
      period: 'Aug – Sep 2025',
      points: [],
    },
    {
      role: { en: 'CEIT Research Showcase Platform (university project)', lo: 'CEIT Research Showcase Platform (ໂຄງການຈົບຊັ້ນ)' },
      organization: { en: 'National University of Laos', lo: 'ມະຫາວິທະຍາໄລແຫ່ງຊາດ' },
      period: 'Jan – Mar 2026',
      points: [],
    },
  ],

  /**
   * CERTIFICATES — add only certificates you have actually received. Example:
   * { name: { en: 'Excel Skills for Business', lo: '...' }, issuer: 'Coursera', year: '2027', url: '' }
   */
  certificates: [],

  /** Transferable skills — no levels or percentages, edit freely. */
  skills: [
    {
      name: { en: 'Microsoft Excel', lo: 'Microsoft Excel' },
      note: {
        en: 'Organising data, formulas, sorting and filtering, tables and charts.',
        lo: 'ຈັດລະບຽບຂໍ້ມູນ, ສູດຄຳນວນ, ຈັດຮຽງ ແລະ ກັ່ນຕອງ, ຕາຕະລາງ ແລະ ຮູບແບບ charts.',
      },
    },
    {
      name: { en: 'Data analysis', lo: 'ການວິເຄາະຂໍ້ມູນ' },
      note: {
        en: 'Finding trends, totals and differences in numbers.',
        lo: 'ຊອກຫາແນວໂນ້ມ, ຍອດລວມ ແລະ ສ່ວນຕ່າງຂອງຕົວເລກ.',
      },
    },
    {
      name: { en: 'Accuracy & attention to detail', lo: 'ຄວາມຖືກຕ້ອງ ແລະ ຄວາມລະອຽດ' },
      note: {
        en: 'Checking and reconciling figures before they are reported.',
        lo: 'ກວດສອບ ແລະ ທຽບຍອດຕົວເລກກ່ອນລາຍງານ.',
      },
    },
    {
      name: { en: 'Reporting', lo: 'ການລາຍງານ' },
      note: {
        en: 'Summarising data into clear tables, charts and short explanations.',
        lo: 'ສະຫຼຸບຂໍ້ມູນເປັນຕາຕະລາງ, ຮູບແບບ charts. ແລະ ຄຳອະທິບາຍສັ້ນໆທີ່ເຂົ້າໃຈງ່າຍ.',
      },
    },
    {
      name: { en: 'Logical thinking', lo: 'ການຄິດຢ່າງມີເຫດຜົນ' },
      note: {
        en: 'Breaking complex tasks into clear, repeatable steps.',
        lo: 'ແບ່ງວຽກທີ່ຊັບຊ້ອນອອກເປັນຂັ້ນຕອນທີ່ຊັດເຈນ ແລະ ເຮັດຊ້ຳໄດ້.',
      },
    },
    {
      name: { en: 'Problem-solving', lo: 'ການແກ້ໄຂບັນຫາ' },
      note: {
        en: 'Investigating why numbers do not match and fixing the cause.',
        lo: 'ຄົ້ນຫາສາເຫດທີ່ຕົວເລກບໍ່ກົງກັນ ແລະ ແກ້ໄຂທີ່ຕົ້ນເຫດ.',
      },
    },
  ],

  /**
   * DEVELOPMENT PLAN — learning goals (shown as goals, not as qualifications).
   * Remove or edit freely.
   */
  learningGoals: [
    { en: 'Accounting fundamentals: double-entry bookkeeping and journal entries', lo: 'ພື້ນຖານບັນຊີ: ການບັນທຶກບັນຊີຄູ່ ແລະ ການລົງປຶ້ມບັນຊີປະຈຳວັນ' },
    { en: 'Reading and preparing financial statements', lo: 'ການອ່ານ ແລະ ກະກຽມລາຍງານການເງິນ' },
    { en: 'Advanced Excel for finance: PivotTables, lookups and dashboards', lo: 'Excel ຂັ້ນສູງສຳລັບການເງິນ: PivotTable, ການຄົ້ນຫາຂໍ້ມູນ ແລະ ແດຊບອດ' },
    { en: 'Lao tax and accounting regulations', lo: 'ລະບຽບການບັນຊີ ແລະ ອາກອນຂອງ ສປປ ລາວ' },
  ],

  /** Spoken languages — add your own, e.g. { en: 'Lao (native)', lo: 'ລາວ (ພາສາແມ່)' } */
  languages: [
    { en: 'Lao (native)', lo: 'ລາວ (ພາສາແມ່)' },
    { en: 'English (basic)', lo: 'ອັງກິດ (ພື້ນຖານ)' },
  ],
}
