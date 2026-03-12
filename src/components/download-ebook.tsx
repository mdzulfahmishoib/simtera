import React from 'react';
import { FileText, Download, Car, Bike, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DownloadEbook = () => {
  const materiSim = [
    {
      tipe: "SIM C (Motor)",
      deskripsi: "Materi khusus kendaraan roda dua dan tata tertib jalur motor.",
      icon: <Bike className="w-6 h-6 text-emerald-500" />,
      items: [
        { nama: "Modul 1", link: "https://txdgzmrkpptjzidfvyyj.supabase.co/storage/v1/object/public/ebook-avis/Sim-C-Modul-1.pdf" },
        { nama: "Modul 2", link: "https://txdgzmrkpptjzidfvyyj.supabase.co/storage/v1/object/public/ebook-avis/Sim-C-Modul-2.pdf" },
        { nama: "Modul 3", link: "https://txdgzmrkpptjzidfvyyj.supabase.co/storage/v1/object/public/ebook-avis/Sim-C-Modul-3.pdf" },
        { nama: "Modul 4", link: "https://txdgzmrkpptjzidfvyyj.supabase.co/storage/v1/object/public/ebook-avis/Sim-C-Modul-4.pdf" }
      ]
    },
    {
      tipe: "SIM A (Mobil)",
      deskripsi: "Panduan lengkap pengoperasian mobil dan etika berkendara roda empat.",
      icon: <Car className="w-6 h-6 text-emerald-500" />,
      items: [
        { nama: "Modul 1", link: "https://txdgzmrkpptjzidfvyyj.supabase.co/storage/v1/object/public/ebook-avis/Sim-A-Modul-1.pdf" },
        { nama: "Modul 2", link: "https://txdgzmrkpptjzidfvyyj.supabase.co/storage/v1/object/public/ebook-avis/Sim-A-Modul-2.pdf" },
        { nama: "Modul 3", link: "https://txdgzmrkpptjzidfvyyj.supabase.co/storage/v1/object/public/ebook-avis/Sim-A-Modul-3.pdf" },
        { nama: "Modul 4", link: "https://txdgzmrkpptjzidfvyyj.supabase.co/storage/v1/object/public/ebook-avis/Sim-A-Modul-4.pdf" }
      ]
    }
  ];

  return (
    <section id="download-ebook" className="py-16 px-4 bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Materi Ujian Teori <span className="text-emerald-500">E-Book</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Persiapkan diri Anda dengan modul PDF resmi dan kumpulan soal latihan terbaru.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {materiSim.map((kategori, index) => (
            <Card key={index} className="border hover:border-emerald-500 bg-[#f8fafc] dark:bg-[#070707] shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    {kategori.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{kategori.tipe}</CardTitle>
                </div>
                <CardDescription>{kategori.deskripsi}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="space-y-3">
                  {kategori.items.map((materi, idx) => (
                    <div
                      key={idx}
                      className="mb-2 flex items-center justify-between p-3 rounded-xl border bg-white dark:bg-transparent group hover:border-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                        <span className="text-sm font-medium">{materi.nama}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-emerald-500 text-emerald-600 dark:hover:text-emerald-950 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500"
                      >
                        <a href={materi.link} download={`${materi.nama}.pdf`} target='_blank'>
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Dokumen Ebook Terbaru tahun 2026
          </p>
        </div>
      </div>
    </section>
  );
};

export default DownloadEbook;