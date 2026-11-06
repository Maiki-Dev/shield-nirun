/**
 * Detail pages for the two flagship systems.
 * Every Mongolian sentence here is taken from Shield Nirun's own brochures (public/files/*.pdf);
 * the English is a translation of it. Every image is a real screenshot / camera frame from those
 * brochures with plates and names masked.
 */
import { tr, type Lang } from "@/lib/i18n";

export interface Shot {
  src: string;
  alt: string;
  w: number;
  h: number;
}

export interface Point {
  title: string;
  text: string;
}

export type Media =
  | { kind: "browser"; shot: Shot; inset?: Shot }
  | { kind: "phones"; shots: Shot[] }
  | { kind: "camera" };

export interface Feature {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  points: Point[];
  media: Media;
  caption: string;
  note?: string;
}

export type SystemSlug = "smart-parking" | "smart-hoa";

export interface SystemPage {
  slug: SystemSlug;
  crumb: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  highlights: string[];
  heroShot: Shot;
  heroCaption: string;
  features: Feature[];
  flow?: { eyebrow: string; title: string; text?: string; steps: Point[]; note?: string; shots?: Shot[] };
  stack?: { eyebrow: string; title: string; text: string; items: Point[] };
  brochure: string;
  meta: { title: string; description: string };
}

const S = (src: string, alt: string, w: number, h: number): Shot => ({ src: `/images/systems/${src}`, alt, w, h });

function parkingPage(lang: Lang): SystemPage {
  const t = tr(lang);
  return {
    slug: "smart-parking",
    crumb: t("Ухаалаг зогсоол", "Smart parking"),
    eyebrow: t("Зогсоолын удирдлагын шийдэл", "Parking management solution"),
    title: t("Зогсоолын хяналт, төлбөр, тайланг", "Parking control, payments and reports,"),
    accent: t("нэг дор.", "all in one place."),
    description: t(
      "Камер машины дугаарыг таньж, орсон цагийг бүртгэнэ. Жолооч QR код уншуулаад QPay-аар төлж, хаалт автоматаар нээгдэнэ. Удирдлага орлого, хөдөлгөөн, дүүргэлтээ нэг дэлгэцээс харна.",
      "Cameras recognise each vehicle's plate and log its entry time. Drivers scan a QR code, pay with QPay and the barrier opens automatically. Management sees revenue, traffic and occupancy on one screen.",
    ),
    highlights: [t("Машины бүртгэл", "Vehicle records"), t("Цахим төлбөр", "Digital payment"), t("Ойлгомжтой тайлан", "Clear reports")],
    heroShot: S("parking-dashboard.webp", t("Зогсоолын удирдлагын хяналтын самбар — бодит дэлгэц", "Parking management dashboard — real screen"), 1254, 649),
    heroCaption: t("Удирдлагын хяналтын бодит дэлгэц", "Real management dashboard"),
    features: [
      {
        id: "lpr",
        eyebrow: t("01 · Дугаар таних", "01 · Plate recognition"),
        title: t("Машины дугаарыг автоматаар таньж бүртгэнэ.", "Plates are recognised and logged automatically."),
        text: t(
          "Камер машины дугаарыг таньж, орсон цагийг нь бүртгэнэ. Ажилтан машины зураг, бүртгэл, төлбөрийг нэг дороос харна.",
          "The camera recognises the plate and records when the vehicle entered. Staff see the vehicle photo, record and payment in one place.",
        ),
        points: [
          { title: t("Дугаар таних", "Plate recognition"), text: t("Камер машины дугаарыг автоматаар уншина.", "The camera reads plates automatically.") },
          { title: t("Орсон цаг бүртгэх", "Entry time"), text: t("Хэзээ орсныг хадгалж, зогссон хугацааг тооцно.", "Stores when each vehicle entered and calculates how long it stayed.") },
          { title: t("Эрхийг ялгах", "Access rights"), text: t("Гэрээт болон төлбөртэй машиныг ялгаж харуулна.", "Shows contract and paying vehicles separately.") },
        ],
        media: { kind: "camera" },
        caption: t("Камерт бүртгэгдсэн бодит зураг. Машины дугаарыг нуусан.", "Real camera capture. Licence plate masked."),
      },
      {
        id: "registry",
        eyebrow: t("02 · Машины бүртгэл", "02 · Vehicle records"),
        title: t("Өдөр тутмын ажилд хэрэгтэй мэдээлэл нэг дор.", "Everything daily operations need, in one place."),
        text: t(
          "Одоо дотор байгаа машин, зогссон хугацаа, төлөх дүн болон гэрээт эрхийг нэг жагсаалтаас харна.",
          "See vehicles currently inside, time parked, amount due and contract rights in a single list.",
        ),
        points: [
          { title: t("Машины бүртгэл", "Vehicle log"), text: t("Орсон, гарсан түүхийг эргэж харна.", "Look back through entry and exit history.") },
          { title: t("Төлбөрийн тооцоо", "Fee calculation"), text: t("Зогссон хугацаанд тохирсон дүнг харна.", "See the amount matching the time parked.") },
          { title: t("Гэрээт машины эрх", "Contract vehicles"), text: t("Гэрээтэй машиныг тусад нь ялгана.", "Contract vehicles are kept separate.") },
          { title: t("Нэгдсэн хяналт", "Unified view"), text: t("Машины төлөв, төлбөрийг хамтад нь харна.", "Vehicle status and payment side by side.") },
        ],
        media: { kind: "browser", shot: S("parking-registry.webp", t("Зогсоол дахь машины бүртгэлийн жагсаалт — бодит дэлгэц", "List of vehicles in the car park — real screen"), 1254, 787) },
        caption: t("Машины бүртгэлийн бодит дэлгэц. Улсын дугаарыг нуусан.", "Real vehicle log screen. Licence plates masked."),
      },
      {
        id: "dashboard",
        eyebrow: t("03 · Хяналтын самбар", "03 · Dashboard"),
        title: t("Зогсоолын байдлыг нэг хараад ойлгоно.", "Understand your car park at a glance."),
        text: t(
          "Өнөөдрийн орлого, машины хөдөлгөөн, сул зогсоол болон төхөөрөмжийн ажиллагааг нэг дэлгэцээс харна.",
          "Today's revenue, vehicle movement, free spaces and device status on one screen.",
        ),
        points: [
          { title: t("Орлого", "Revenue"), text: t("Өдрийн орлогыг харна.", "See the day's revenue.") },
          { title: t("Хөдөлгөөн", "Traffic"), text: t("Орсон, гарсан тоог харна.", "See entry and exit counts.") },
          { title: t("Дүүргэлт", "Occupancy"), text: t("Сул зогсоолыг харна.", "See free spaces.") },
          { title: t("Төлбөрийн тайлан", "Payment report"), text: t("Төлбөрийг ямар аргаар хүлээн авснаа дүн, тоогоор нь харьцуулж харна.", "Compare payment methods by amount and count.") },
        ],
        media: { kind: "browser", shot: S("parking-payment-mix.webp", t("Төлбөрийн бүтэц — QPay ба карт", "Payment mix — QPay and card"), 478, 291) },
        caption: t("Төлбөрийн тайлангийн бодит дэлгэц.", "Real payment report screen."),
        note: t("Зураг дээрх дүн, төлөв нь зураг авсан үеийн мэдээлэл.", "Amounts and statuses shown are as of when the screenshot was taken."),
      },
      {
        id: "transactions",
        eyebrow: t("04 · Гүйлгээ & тайлан", "04 · Transactions & reports"),
        title: t("Төлбөр, гүйлгээг хялбар хянаж шалгана.", "Check payments and transactions with ease."),
        text: t(
          "Төлбөрийн арга, дүн, амжилттай эсэхийг нэг жагсаалтаас харна. Шаардлагатай тайлангаа татаж авна.",
          "See payment method, amount and status in one list, and download the reports you need.",
        ),
        points: [
          { title: t("Сараар харах", "By month"), text: t("Хүссэн сарын гүйлгээг сонгоно.", "Pick any month's transactions.") },
          { title: t("Төлбөрөөр ялгах", "By payment"), text: t("Арга болон төлөвөөр нь шүүнэ.", "Filter by method and status.") },
          { title: t("Тайлан татах", "Export"), text: t("Мэдээллээ файл болгон авна.", "Download your data as a file.") },
        ],
        media: { kind: "browser", shot: S("parking-transactions.webp", t("Амжилттай QPay гүйлгээнүүдийн жагсаалт", "List of successful QPay transactions"), 1254, 771) },
        caption: t("Амжилттай QPay гүйлгээнүүдийн бодит бүртгэл. Дугаар, лавлагааг нуусан.", "Real log of successful QPay transactions. Plates and references masked."),
      },
    ],
    flow: {
      eyebrow: t("Жолоочийн төлбөр", "Driver payment"),
      title: t("QR код уншуулаад төлбөрөө төлнө.", "Scan a QR code and pay."),
      text: t(
        "Жолооч утаснаасаа төлөх дүнгээ харж, QPay-аар төлнө. Баталгаажсан төлбөрийг систем автоматаар бүртгэнэ.",
        "Drivers see the amount due on their phone and pay with QPay. Confirmed payments are recorded automatically.",
      ),
      steps: [
        { title: t("QR код уншуулна", "Scan the QR code"), text: t("Утасныхаа камераар зогсоолын QR кодыг уншуулж, төлбөрийн хуудсыг нээнэ.", "Scan the car park's QR code with your phone camera to open the payment page.") },
        { title: t("Төлөх дүнгээ харна", "See the amount"), text: t("Дугаарын 4 цифрийг оруулаад машинаа сонгоно. Зогссон хугацаа, төлөх дүн гарна.", "Enter the 4 digits of your plate and pick your vehicle. Time parked and amount due appear.") },
        { title: t("QPay-аар төлнө", "Pay with QPay"), text: t("“QPay-аар төлөх” товчийг дарж, банкны аппликэйшнээр төлбөрөө төлнө.", "Tap “Pay with QPay” and complete payment in your banking app.") },
        { title: t("Төлбөр баталгаажна", "Payment confirmed"), text: t("Төлбөр амжилттай болсныг систем шалгаж, төлөгдсөнөөр бүртгэнэ.", "The system verifies the payment and marks it as paid.") },
        { title: t("Хаалт автоматаар нээгдэнэ", "The barrier opens"), text: t("Төлбөр баталгаажсаны дараа гарах хаалт автоматаар нээгдэж, жолооч гарна.", "Once payment is confirmed the exit barrier opens automatically and the driver leaves.") },
      ],
      note: t("Төлбөр, гарах хугацаа нь тухайн зогсоолын нөхцөлөөс хамаарна.", "Fees and exit time limits depend on each car park's terms."),
      shots: [
        S("parking-pay-search.webp", t("Машины дугаараар хайх дэлгэц", "Search by plate number"), 337, 199),
        S("parking-pay-amount.webp", t("Төлөх дүн ба QPay сонголтын дэлгэц", "Amount due and QPay option"), 337, 444),
      ],
    },
    brochure: "/files/shield-nirun-smart-parking.pdf",
    meta: {
      title: t("Ухаалаг зогсоолын систем", "Smart parking system"),
      description: t(
        "Дугаар таних камер, машины бүртгэл, QR + QPay төлбөр, автомат хаалт, орлого ба гүйлгээний тайлан — Shield Nirun.",
        "Plate-recognition cameras, vehicle records, QR + QPay payment, automatic barriers, revenue and transaction reports — Shield Nirun.",
      ),
    },
  };
}

function hoaPage(lang: Lang): SystemPage {
  const t = tr(lang);
  return {
    slug: "smart-hoa",
    crumb: t("SHIELD+ СӨХ систем", "SHIELD+ HOA system"),
    eyebrow: t("СӨХ-ийн дижитал удирдлага", "Digital HOA management"),
    title: t("Оршин суугч ба СӨХ-ийн ажлыг", "Residents and HOA management,"),
    accent: t("нэг системд.", "in one system."),
    description: t(
      "Гар утасны апп, удирдлагын самбар, төлбөр ба хүсэлтийн урсгалыг нэг системд нэгтгэнэ.",
      "Brings the mobile app, management dashboard, payments and requests together in one system.",
    ),
    highlights: [t("Оршин суугчийн апп", "Resident app"), t("Удирдлагын самбар", "Management dashboard"), t("Нэхэмжлэл & хүсэлт", "Invoices & requests")],
    heroShot: S("hoa-admin-dashboard.webp", t("SHIELD+ СӨХ — удирдлагын хяналтын самбар", "SHIELD+ HOA — management dashboard"), 1440, 900),
    heroCaption: t("Ажиллаж буй админ самбарын дэлгэц · хувийн мэдээллийг нууцалсан", "Live admin dashboard screen · personal data masked"),
    features: [
      {
        id: "app",
        eyebrow: t("01 · Оршин суугчийн апп · iOS / Android", "01 · Resident app · iOS / Android"),
        title: t("Өдөр тутмын мэдээлэл гар утсанд ойр.", "Everyday information, right on your phone."),
        text: t(
          "Оршин суугч өөрийн тооттой холбоотой мэдээллээ шалгаж, хүсэлтээ илгээж, СӨХ-өөс ирсэн шинэчлэлтийг нэг апп дотроос харна.",
          "Residents check information about their unit, send requests and see updates from the HOA, all in one app.",
        ),
        points: [
          { title: t("Нэхэмжлэл", "Invoices"), text: t("Тоотын нэхэмжлэл, үлдэгдэл болон төлбөрийн түүхээ нэг дор харна.", "Unit invoices, balance and payment history in one place.") },
          { title: t("Хүсэлт", "Requests"), text: t("Засвар, үйлчилгээний хүсэлт илгээж шийдвэрлэлтийн явцыг хянана.", "Send repair and service requests and track their progress.") },
          { title: t("Зарлал ба санал", "Announcements & polls"), text: t("Зарлал, шуурхай мэдээлэл, санал асуулгыг апп дотроос авна.", "Get announcements, urgent notices and polls in the app.") },
          { title: t("Мэдэгдэл", "Notifications"), text: t("Нэхэмжлэл, зарлал, хүсэлтийн өөрчлөлт мэдэгдлийн түүхэнд үлдэнэ.", "Changes to invoices, announcements and requests stay in your notification history.") },
        ],
        media: { kind: "phones", shots: [S("hoa-app-home.webp", t("Оршин суугчийн аппын нүүр дэлгэц", "Resident app home screen"), 828, 1800)] },
        caption: t("Бодит апп дэлгэц · туршилтын жишээ өгөгдөл", "Real app screen · sample test data"),
      },
      {
        id: "payments",
        eyebrow: t("02 · Төлбөр ба харилцаа", "02 · Payments & communication"),
        title: t("Өдөр тутмын урсгал тасралтгүй харагдана.", "The daily flow, always visible."),
        text: t(
          "Нэхэмжлэлээс эхлээд хүсэлтийн шийдвэрлэлт хүртэл мэдээлэл зөв хүндээ хүрч, хоёр талд нэг төлөвөөр харагдана.",
          "From invoices to resolved requests, information reaches the right person and both sides see the same status.",
        ),
        points: [
          { title: t("Нэхэмжлэл", "Invoices"), text: t("СӨХ баталгаажсан дүнг урьдчилан шалгаж оруулна. Оршин суугч үлдэгдэл, төлөх хугацаагаа харна.", "The HOA checks and enters confirmed amounts in advance. Residents see their balance and due date.") },
          { title: t("Мэдээлэл хүргэлт", "Delivery"), text: t("Зарлал, нэхэмжлэл, хүсэлтийн төлөв мэдэгдлийн түүхэнд хадгалагдаж, push-ээр хүрнэ.", "Announcements, invoices and request status are kept in the notification history and delivered by push.") },
          { title: t("Явц ба тайлан", "Progress & reports"), text: t("Админ хүсэлтийн төлөв, төлбөрийн төвлөрөл, гүйцэтгэлийг нэг самбараас хянана.", "Admins track request status, payment collection and performance from one dashboard.") },
        ],
        media: { kind: "phones", shots: [S("hoa-app-pay.webp", t("Нэхэмжлэл, үлдэгдлийн дэлгэц", "Invoices and balance screen"), 828, 1800)] },
        caption: t("Бодит төлбөрийн дэлгэц · жишээ өгөгдөл", "Real payments screen · sample data"),
        note: t(
          "Айл төлбөр, зарлалаа хайж асуухын оронд өөрийн утаснаас харна. Дарга мэдээллээ дахин давтан шивэхгүй.",
          "Households check payments and announcements on their own phone instead of asking around. The HOA chair never re-types the same data.",
        ),
      },
      {
        id: "admin",
        eyebrow: t("03 · Удирдлагын самбар · веб", "03 · Management dashboard · web"),
        title: t("Удирдлагын шийдвэрийг өгөгдлөөр дэмжинэ.", "Data-backed management decisions."),
        text: t(
          "СӨХ-ийн дарга байр, тоот, нэхэмжлэл, оршин суугчдын хүсэлт, мэдэгдлийг веб самбараас удирдана.",
          "The HOA chair manages buildings, units, invoices, resident requests and notifications from a web dashboard.",
        ),
        points: [
          { title: t("Байр, орц, тоот", "Buildings, entrances, units"), text: t("Байрны бүтэц, тоот, оршин суугчийн холболтыг нэг цэгээс хянана.", "Building structure, units and resident links managed from one place.") },
          { title: t("Excel импорт", "Excel import"), text: t("Олон мөрийн мэдээллийг урьдчилан шалгаж, баталгаажуулан оруулна.", "Bulk data is previewed and validated before import.") },
          { title: t("Хүсэлт ба санхүү", "Requests & finance"), text: t("Төлөв, төлөлт, төвлөрлийг нэг самбарт харна.", "Status, payments and collection on one dashboard.") },
        ],
        media: { kind: "browser", shot: S("hoa-admin-units.webp", t("Байр, орц, тоотын удирдлагын дэлгэц", "Buildings, entrances and units management screen"), 1440, 900) },
        caption: t("Байр · орц · тоотын бодит дэлгэц. СӨХ бүр өөрийн бүтцээр удирдана.", "Real buildings · entrances · units screen. Each HOA manages its own structure."),
      },
    ],
    flow: {
      eyebrow: t("Нэвтрүүлэх дараалал", "Rollout"),
      title: t("Дөрвөн алхмаар ажиллагаанд орно.", "Up and running in four steps."),
      text: t(
        "Бүртгэх → Мэдэгдэх → Хянах → Тайлагнах: нэг өгөгдөл, хоёр талын харах өнцөг.",
        "Record → Notify → Track → Report: one set of data, seen from both sides.",
      ),
      steps: [
        { title: t("СӨХ үүсгэх", "Create the HOA"), text: t("Даргын эрх, байрны бүтцийг тохируулна.", "Set up the chair's access and the building structure.") },
        { title: t("Өгөгдөл оруулах", "Import data"), text: t("Байр, тоот, баталгаажсан нэхэмжлэлийг шалгаж импортлоно.", "Check and import buildings, units and confirmed invoices.") },
        { title: t("Оршин суугч холбох", "Connect residents"), text: t("Утасны дугаарыг зөв тооттой холбож аппын хандалтыг нээнэ.", "Link phone numbers to the right units and open app access.") },
        { title: t("Ажиллагаа эхлүүлэх", "Go live"), text: t("Зарлал, хүсэлт, push мэдэгдэл болон тайланг ашиглана.", "Start using announcements, requests, push notifications and reports.") },
      ],
      note: t(
        "QPay төлбөрийн автомат баталгаажуулалт merchant эрх, webhook тохиргооны дараа идэвхжинэ.",
        "Automatic QPay payment confirmation is enabled once merchant access and the webhook are configured.",
      ),
    },
    stack: {
      eyebrow: t("Нэг системийн архитектур", "Single-system architecture"),
      title: t("Өсөхөд зориулагдсан бүтэц.", "Built to grow."),
      text: t(
        "Оршин суугчийн апп ба СӨХ-ийн удирдлагын самбар нэг бизнес өгөгдөл дээр ажиллана. Үүрэг, байгууллагын хүрээнд хандах эрхийг API түвшинд шалгана.",
        "The resident app and HOA dashboard run on the same business data. Role- and organisation-based access is enforced at the API level.",
      ),
      items: [
        { title: t("Flutter апп", "Flutter app"), text: t("Оршин суугч", "Residents") },
        { title: t("Next.js веб", "Next.js web"), text: t("СӨХ-ийн админ", "HOA admin") },
        { title: "Fastify API", text: t("OTP · эрх · логик", "OTP · access · logic") },
        { title: "PostgreSQL", text: t("Бизнес өгөгдөл", "Business data") },
        { title: "Firebase", text: t("Push · файл хадгалалт", "Push · file storage") },
      ],
    },
    brochure: "/files/shield-nirun-smart-hoa.pdf",
    meta: {
      title: t("SHIELD+ СӨХ систем", "SHIELD+ HOA system"),
      description: t(
        "Оршин суугчийн апп, СӨХ-ийн удирдлагын самбар, нэхэмжлэл, хүсэлт, зарлал, push мэдэгдэл — Shield Nirun SHIELD+.",
        "Resident app, HOA management dashboard, invoices, requests, announcements and push notifications — Shield Nirun SHIELD+.",
      ),
    },
  };
}

export const systemPage = (slug: SystemSlug, lang: Lang): SystemPage => (slug === "smart-parking" ? parkingPage(lang) : hoaPage(lang));
