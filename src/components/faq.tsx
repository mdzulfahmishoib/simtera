import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQSection = () => {
  const faqs = [
    {
      question: "Apakah materi soal di sini sesuai dengan ujian asli?",
      answer: "Ya, kumpulan soal kami disusun berdasarkan kisi-kisi ebook buku panduan uji teori sim resmi Korlantas Polri terbaru dari website https://e-avis.korlantas.polri.go.id/ebook/"
    },
    {
      question: "Apa perbedaan Modul 1, 2, 3, dan 4?",
      answer: "Setiap modul menyajikan materi ujian yang berbeda dan saling melengkapi untuk memastikan kesiapan Anda secara menyeluruh. Mulai dari pemahaman Persepsi Bahaya, Wawasan Kebangsaan, hingga Pengetahuan Peraturan Lalu Lintas yang semuanya akan diuji dalam satu kesatuan sistem ujian teori SIM."
    },
    {
      question: "Modul mana yang harus saya pelajari?",
      answer: "Anda sangat disarankan untuk mempelajari **semua modul (1 hingga 4)**. Setiap modul menyajikan materi ujian yang berbeda dan saling melengkapi, mulai dari etika, persepsi bahaya, hingga aturan teknis, guna memastikan kesiapan Anda secara menyeluruh sebelum menghadapi ujian asli."
    },
    {
      question: "Bagaimana cara mendapatkan skor kelulusan?",
      answer: "Dalam setiap simulasi, Anda harus menjawab benar minimal 70 dari total soal. Hasil dan evaluasi jawaban akan langsung muncul setelah tes selesai."
    },
    {
      question: "Dapatkah saya melakukan simulasi berkali-kali?",
      answer: "Tentu saja! Anda bisa melakukan simulasi tanpa batas untuk mengasah kesiapan Anda sebelum menghadapi ujian teori yang sesungguhnya di Satpas."
    },
  ];

  return (
    <section className="pb-12 pt-12  px-4 bg-gradient-to-b from-slate-50 to-white dark:from-[#171717] dark:to-[#0a0a0a]">
      <div className="container mx-auto max-w-4xl">

        {/* Header Section */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#21479B]/10 text-[#21479B] dark:text-blue-500 text-xs font-bold tracking-wider uppercase">
            <HelpCircle className="w-3 h-3" />
            Bantuan & FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Pertanyaan yang Sering <span className="text-[#21479B] dark:text-blue-500">Diajukan</span>
          </h2>
          <p className="text-gray-600 dark:text-slate-400">
            Segala hal yang perlu Anda ketahui tentang persiapan ujian SIM Anda.
          </p>
        </div>

        <div className="bg-slate-50/50 dark:bg-white/5 px-8 py-4 md:px-8 md:py-4  rounded-3xl border border-gray-100 dark:border-white/10">
          <Accordion className="w-full space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-gray-200 dark:border-white/10 last:border-0"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-[#21479B] dark:hover:text-blue-500 transition-all py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-slate-400 text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;