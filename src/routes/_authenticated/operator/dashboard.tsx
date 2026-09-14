import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { DOC_TYPES, db, STATUS_LABEL, type RegStatus } from "@/lib/spmb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/operator/dashboard")({
  component: DashboardJurusan,
  head: () => ({
    meta: [
      { title: "Dashboard Jurusan | Panel Operator SPMB" },
      {
        name: "description",
        content:
          "Rekap pendaftar per jurusan: nilai, dokumen yang belum dikirim, dan sisa kuota, siap dicetak PDF.",
      },
      { property: "og:title", content: "Dashboard Jurusan | Panel Operator SPMB" },
      {
        property: "og:description",
        content: "Rekap pendaftar per jurusan lengkap dengan nilai, dokumen, dan sisa kuota.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Reg = {
  id: string;
  registration_number: string | null;
  full_name: string | null;
  nisn: string | null;
  status: RegStatus;
  total_score: number | null;
  rank: number | null;
  first_choice_id: string | null;
  second_choice_id: string | null;
  accepted_major_id: string | null;
};

type Major = { id: string; code: string; name: string; quota: number };

const WAJIB = DOC_TYPES.filter((d) => d.required);

function DashboardJurusan() {
  const [sekarang] = useState(() => new Date());

  const { data: majors = [], isLoading: loadMajor } = useQuery({
    queryKey: ["dash-majors"],
    queryFn: async () => {
      const { data } = await db
        .from("majors")
        .select("id,code,name,quota")
        .eq("active", true)
        .order("code");
      return (data ?? []) as Major[];
    },
  });

  const { data: regs = [], isLoading: loadReg } = useQuery({
    queryKey: ["dash-regs"],
    queryFn: async () => {
      const { data } = await db
        .from("registrations")
        .select(
          "id,registration_number,full_name,nisn,status,total_score,rank,first_choice_id,second_choice_id,accepted_major_id",
        )
        .neq("status", "draft")
        .order("total_score", { ascending: false });
      return (data ?? []) as Reg[];
    },
  });

  const { data: docs = [] } = useQuery({
    queryKey: ["dash-docs"],
    queryFn: async () => {
      const { data } = await db.from("documents").select("registration_id,doc_type");
      return (data ?? []) as { registration_id: string; doc_type: string }[];
    },
  });

  const punyaDok = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const d of docs) {
      const set = map.get(d.registration_id) ?? new Set<string>();
      set.add(d.doc_type);
      map.set(d.registration_id, set);
    }
    return map;
  }, [docs]);

  const kelompok = useMemo(() => {
    const diterima = (r: Reg) => r.status === "accepted" || r.status === "enrolled";
    return majors.map((m) => {
      const anggota = regs.filter((r) =>
        diterima(r) ? r.accepted_major_id === m.id : r.first_choice_id === m.id,
      );
      const jumlahDiterima = regs.filter((r) => diterima(r) && r.accepted_major_id === m.id).length;
      const baris = anggota.map((r) => {
        const ada = punyaDok.get(r.id) ?? new Set<string>();
        const kurang = WAJIB.filter((d) => !ada.has(d.key)).map((d) => d.label);
        return { reg: r, kurang };
      });
      return {
        major: m,
        baris,
        diterima: jumlahDiterima,
        sisa: Math.max(0, m.quota - jumlahDiterima),
        belumLengkap: baris.filter((b) => b.kurang.length > 0).length,
      };
    });
  }, [majors, regs, punyaDok]);

  const tanggal = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "long",
    timeStyle: "short",
  }).format(sekarang);

  if (loadMajor || loadReg) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Memuat data…</p>;
  }

  return (
    <div className="space-y-6 print:space-y-4">
      <style>{`
        @media print {
          body { background: #fff; }
          nav, header, footer, .no-print { display: none !important; }
          .print-area { max-width: none; }
          .print-break { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Rekap Pendaftar per Jurusan</h2>
          <p className="text-sm text-muted-foreground">Dicetak pada {tanggal} WIB</p>
        </div>
        <Button className="no-print" onClick={() => window.print()}>
          <Printer className="mr-2 size-4" /> Cetak PDF
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4">
        {kelompok.map((k) => (
          <Card key={k.major.id} className="print-break">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">{k.major.code}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p className="text-lg font-bold text-foreground">{k.baris.length} pendaftar</p>
              <p>
                Kuota {k.major.quota} · Diterima {k.diterima} · Sisa{" "}
                <span className="font-semibold text-foreground">{k.sisa}</span>
              </p>
              <p>{k.belumLengkap} berkas belum lengkap</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="print-area space-y-6">
        {kelompok.map((k) => (
          <Card key={k.major.id} className="print-break">
            <CardHeader className="pb-2">
              <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                {k.major.name}
                <Badge variant="secondary">{k.major.code}</Badge>
                <span className="text-xs font-normal text-muted-foreground">
                  Kuota {k.major.quota} · Diterima {k.diterima} · Sisa kuota {k.sisa}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {k.baris.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">Belum ada pendaftar.</p>
              ) : (
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                      <th className="py-2 pr-2">No</th>
                      <th className="py-2 pr-2">No. Pendaftaran</th>
                      <th className="py-2 pr-2">Nama</th>
                      <th className="py-2 pr-2">NISN</th>
                      <th className="py-2 pr-2">Nilai</th>
                      <th className="py-2 pr-2">Status</th>
                      <th className="py-2">Dokumen belum dikirim</th>
                    </tr>
                  </thead>
                  <tbody>
                    {k.baris.map((b, i) => (
                      <tr key={b.reg.id} className="border-b last:border-0 align-top">
                        <td className="py-1.5 pr-2">{i + 1}</td>
                        <td className="py-1.5 pr-2">{b.reg.registration_number ?? "-"}</td>
                        <td className="py-1.5 pr-2 font-medium">{b.reg.full_name ?? "-"}</td>
                        <td className="py-1.5 pr-2">{b.reg.nisn ?? "-"}</td>
                        <td className="py-1.5 pr-2 tabular-nums">
                          {b.reg.total_score == null ? "-" : Number(b.reg.total_score).toFixed(2)}
                        </td>
                        <td className="py-1.5 pr-2">{STATUS_LABEL[b.reg.status]}</td>
                        <td className="py-1.5 text-xs">
                          {b.kurang.length === 0 ? (
                            <span className="text-emerald-700">Lengkap</span>
                          ) : (
                            <span className="text-destructive">{b.kurang.join(", ")}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
