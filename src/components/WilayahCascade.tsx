import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { db } from "@/lib/spmb";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type Wilayah = { kode: string; nama: string };

const SATU_JAM = 60 * 60 * 1000;

async function ambilWilayah(level: number, parent: string | null): Promise<Wilayah[]> {
  let q = db.from("wilayah").select("kode,nama").eq("level", level).order("nama");
  q = level === 1 ? q.is("parent", null) : q.eq("parent", parent);
  const { data, error } = await q.limit(1000);
  if (error) throw error;
  return (data ?? []) as Wilayah[];
}

function useWilayah(level: number, parent: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["wilayah", level, parent],
    queryFn: () => ambilWilayah(level, parent),
    enabled,
    staleTime: SATU_JAM,
    gcTime: SATU_JAM,
  });
}

function PilihWilayah({
  value,
  options,
  loading,
  disabled,
  placeholder,
  onSelect,
}: {
  value: string;
  options: Wilayah[];
  loading: boolean;
  disabled: boolean;
  placeholder: string;
  onSelect: (w: Wilayah) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-9 w-full justify-between font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Cari…" />
          <CommandList>
            <CommandEmpty>{loading ? "Memuat…" : "Tidak ditemukan."}</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.kode}
                  value={o.nama}
                  onSelect={() => {
                    onSelect(o);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === o.nama ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {o.nama}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export type NilaiWilayah = {
  province: string;
  city: string;
  district: string;
  village: string;
};

export function WilayahCascade({
  nilai,
  onChange,
  render,
}: {
  nilai: NilaiWilayah;
  onChange: (patch: Partial<NilaiWilayah>) => void;
  render: (fields: {
    provinsi: React.ReactNode;
    kabupaten: React.ReactNode;
    kecamatan: React.ReactNode;
    desa: React.ReactNode;
  }) => React.ReactNode;
}) {
  const [kodeProv, setKodeProv] = useState<string | null>(null);
  const [kodeKab, setKodeKab] = useState<string | null>(null);
  const [kodeKec, setKodeKec] = useState<string | null>(null);

  const prov = useWilayah(1, null, true);
  const kab = useWilayah(2, kodeProv, Boolean(kodeProv));
  const kec = useWilayah(3, kodeKab, Boolean(kodeKab));
  const desa = useWilayah(4, kodeKec, Boolean(kodeKec));

  // Pulihkan kode dari nama yang sudah tersimpan (draft lama).
  useEffect(() => {
    if (kodeProv || !nilai.province || !prov.data) return;
    const cocok = prov.data.find((w) => w.nama === nilai.province);
    if (cocok) setKodeProv(cocok.kode);
  }, [prov.data, nilai.province, kodeProv]);

  useEffect(() => {
    if (kodeKab || !nilai.city || !kab.data) return;
    const cocok = kab.data.find((w) => w.nama === nilai.city);
    if (cocok) setKodeKab(cocok.kode);
  }, [kab.data, nilai.city, kodeKab]);

  useEffect(() => {
    if (kodeKec || !nilai.district || !kec.data) return;
    const cocok = kec.data.find((w) => w.nama === nilai.district);
    if (cocok) setKodeKec(cocok.kode);
  }, [kec.data, nilai.district, kodeKec]);

  return (
    <>
      {render({
        provinsi: (
          <PilihWilayah
            value={nilai.province}
            options={prov.data ?? []}
            loading={prov.isLoading}
            disabled={false}
            placeholder="Pilih provinsi…"
            onSelect={(w) => {
              setKodeProv(w.kode);
              setKodeKab(null);
              setKodeKec(null);
              onChange({ province: w.nama, city: "", district: "", village: "" });
            }}
          />
        ),
        kabupaten: (
          <PilihWilayah
            value={nilai.city}
            options={kab.data ?? []}
            loading={kab.isLoading}
            disabled={!kodeProv}
            placeholder={kodeProv ? "Pilih kabupaten/kota…" : "Pilih provinsi dulu"}
            onSelect={(w) => {
              setKodeKab(w.kode);
              setKodeKec(null);
              onChange({ city: w.nama, district: "", village: "" });
            }}
          />
        ),
        kecamatan: (
          <PilihWilayah
            value={nilai.district}
            options={kec.data ?? []}
            loading={kec.isLoading}
            disabled={!kodeKab}
            placeholder={kodeKab ? "Pilih kecamatan…" : "Pilih kabupaten/kota dulu"}
            onSelect={(w) => {
              setKodeKec(w.kode);
              onChange({ district: w.nama, village: "" });
            }}
          />
        ),
        desa: (
          <PilihWilayah
            value={nilai.village}
            options={desa.data ?? []}
            loading={desa.isLoading}
            disabled={!kodeKec}
            placeholder={kodeKec ? "Pilih kelurahan/desa…" : "Pilih kecamatan dulu"}
            onSelect={(w) => onChange({ village: w.nama })}
          />
        ),
      })}
    </>
  );
}
