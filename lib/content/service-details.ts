import { tr, type Lang } from "@/lib/i18n";

export const SERVICE_SLUGS: Readonly<Partial<Record<string, string>>> = {
  cctv: "camera-installation",
  door: "access-control",
  drone: "drone-monitoring",
  shield: "on-site-security",
  network: "network-cabling",
  wrench: "maintenance-support",
  software: "software-web-development",
  mine: "mine-shield",
};

export function serviceDetails(lang: Lang, slug: string) {
  const t = tr(lang);
  switch (slug) {
    case SERVICE_SLUGS.cctv:
      return [
        t("Хянах бүс, харах өнцөг болон шөнийн гэрэлтүүлгийг газар дээр нь үнэлнэ.", "Assess coverage areas, viewing angles and nighttime lighting on site."),
        t("Камер, бичлэг хадгалах төхөөрөмж, сүлжээний холболтыг угсарна.", "Install cameras, recording equipment and network connections."),
        t("Бичлэг хайх, мэдэгдэл авах, хэрэглэгчийн эрх тохируулахыг хариуцсан ажилтанд заана.", "Show staff how to retrieve footage, receive alerts and manage access."),
      ];
    case SERVICE_SLUGS.door:
      return [
        t("Орц, гарцын урсгал болон хэн ямар бүсэд нэвтрэх эрхтэйг тодорхойлно.", "Map entry and exit flows and define who can access each area."),
        t("Уншигч, контроллер, цахилгаан цоож болон турникетийг тохируулна.", "Configure readers, controllers, electronic locks and turnstiles."),
        t("Нэвтрэлтийн бүртгэл, эрхийн хуваарь болон онцгой горимыг шалгана.", "Verify access logs, permission schedules and emergency operating modes."),
      ];
    case SERVICE_SLUGS.drone:
      return [
        t("Хянах талбай, нислэгийн маршрут болон аюулгүй ажиллагааны нөхцөлийг төлөвлөнө.", "Plan coverage, flight routes and safety requirements."),
        t("Хашааны шугам, алслагдсан хэсэг болон газар дээрээс харахад хүндрэлтэй цэгүүдийг ажиглана.", "Observe perimeter lines, remote areas and points that are difficult to see from the ground."),
        t("Илэрсэн нөхцөл байдлыг газрын багт мэдээлнэ.", "Relay observations to the ground team."),
      ];
    case SERVICE_SLUGS.shield:
      return [
        t("Объектын эрсдэл, постын байршил болон эргүүлийн хуваарийг тодорхойлно.", "Assess site risks and define guard posts and patrol schedules."),
        t("Зочин, тээврийн хэрэгслийн нэвтрэлтийг объектын журмын дагуу хянана.", "Monitor visitor and vehicle access in line with site procedures."),
        t("Зөрчил, дуудлагыг бүртгэж, хариуцсан багт мэдээлнэ.", "Log incidents and calls and escalate them to the responsible team."),
      ];
    case SERVICE_SLUGS.network:
      return [
        t("Кабелийн зам, төхөөрөмжийн тоо болон сүлжээний ачааллыг тооцно.", "Plan cable routes, device counts and network capacity."),
        t("Сүлжээний шкаф, свич, patch panel болон кабелийг угсарч шошголно.", "Install and label cabinets, switches, patch panels and cables."),
        t("Холболт бүрийг шалгаж, төхөөрөмжийн байршил болон портын мэдээллийг хүлээлгэн өгнө.", "Test each connection and hand over device locations and port assignments."),
      ];
    case SERVICE_SLUGS.wrench:
      return [
        t("Камер, бичлэгийн төхөөрөмж, хаалт болон сүлжээний ажиллагааг шалгана.", "Check cameras, recording equipment, barriers and network operation."),
        t("Доголдлын шалтгааныг оношилж, тохиргоо, засвар эсвэл солих шаардлагыг тодорхойлно.", "Diagnose faults and identify configuration, repair or replacement needs."),
        t("Үзлэгийн дүн болон дараагийн үйлчилгээний төлөвлөгөөг танилцуулна.", "Report inspection findings and outline the next maintenance steps."),
      ];
    case SERVICE_SLUGS.software:
      return [
        t("Гар утсанд зохицдог байгууллагын вебсайт, бүтээгдэхүүн, үйлчилгээний танилцуулгын хуудас хөгжүүлнэ.", "Build mobile-friendly business websites and product or service pages."),
        t("Бүртгэл, тайлан, хэрэглэгчийн эрх бүхий дотоод систем болон админ самбар хөгжүүлнэ.", "Develop internal systems and admin dashboards with records, reports and user permissions."),
        t("Шаардлагатай тохиолдолд одоо ашиглаж буй системтэй API-аар холбож, туршилт хийж, ашиглалтад оруулна.", "Integrate with existing systems via APIs where needed, then test and deploy the solution."),
      ];
    case SERVICE_SLUGS.mine:
      return [
        t("Уурхайн талбай, орц гарц, агуулах болон тоног төхөөрөмжийн эрсдэлийг газар дээр нь үнэлж, постын байршлыг тогтооно.", "Assess on-site risks at mine areas, entry points, warehouses and equipment, and set guard posts."),
        t("Хээрийн тоноглол, холбоо бүхий автомашинтай эргүүлийн баг талбай, периметрийг тогтмол хянана.", "Patrol teams with field-equipped, radio-linked vehicles regularly monitor the site and its perimeter."),
        t("Хүн, тээврийн хэрэгслийн нэвтрэлтийг журмын дагуу шалгаж, зөрчил, дуудлагыг бүртгэн удирдлагад шуурхай мэдээлнэ.", "Check people and vehicles in line with site rules, log incidents and report them to management promptly."),
      ];
    default:
      return [];
  }
}
