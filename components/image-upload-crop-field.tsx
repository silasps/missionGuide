"use client";

import { useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import type { CropArea } from "@/lib/crop-image";
import { getCroppedImageBlob } from "@/lib/crop-image";
import { buildStoragePath } from "@/lib/storage-path";
import { createClient } from "@/lib/supabase/client";

type Props = {
  label: string;
  name: string;
  bucket: string;
  folder: string;
  currentUrl?: string | null;
  cropShape?: "rect" | "round";
  aspect?: number;
  outputWidth?: number;
  outputHeight?: number;
  suggestedSize?: string;
};

export default function ImageUploadCropField({
  label,
  name,
  bucket,
  folder,
  currentUrl,
  cropShape = "rect",
  aspect = 1,
  outputWidth,
  outputHeight,
  suggestedSize,
}: Props) {
  const supabase = createClient();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentUrl || "");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const inputId = useMemo(
    () => `${name}-${Math.random().toString(36).slice(2)}`,
    [name]
  );

  useEffect(() => {
    setPreviewUrl(currentUrl || null);
    setUploadedUrl(currentUrl || "");
  }, [currentUrl]);

  function onCropComplete(_: CropArea, croppedPixels: CropArea) {
    setCroppedAreaPixels(croppedPixels);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);
    setOpen(true);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  async function handleConfirm() {
    if (!imageSrc || !croppedAreaPixels) return;

    setUploading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(`Erro ao buscar usuário: ${userError.message}`);
      }

      if (!user) {
        throw new Error("Usuário não autenticado no client.");
      }

      const blob = await getCroppedImageBlob(
        imageSrc,
        croppedAreaPixels,
        outputWidth,
        outputHeight
      );

      const file = new File([blob], `${name}.jpg`, {
        type: "image/jpeg",
      });

      const localPreviewUrl = URL.createObjectURL(file);
      const path = buildStoragePath(folder, user.id, file.name);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);

      setUploadedUrl(data.publicUrl);
      setPreviewUrl(localPreviewUrl);
      setOpen(false);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      alert(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </label>

      <input type="hidden" name={name} value={uploadedUrl} />

      <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={label}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
                className={
                  cropShape === "round"
                    ? "h-24 w-24 rounded-full object-cover ring-2 ring-slate-700"
                    : "h-24 w-40 rounded-2xl object-cover ring-2 ring-slate-700"
                }
              />
            ) : (
              <div
                className={
                  cropShape === "round"
                    ? "flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-300"
                    : "flex h-24 w-40 items-center justify-center rounded-2xl bg-slate-800 text-xs text-slate-300"
                }
              >
                Sem imagem
              </div>
            )}
          </div>

          <div className="flex-1">
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Escolher imagem
            </label>

            <input
              id={inputId}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="mt-2 text-xs text-slate-400">
              Ajuste a imagem antes de salvar.
              {suggestedSize ? ` Tamanho sugerido: ${suggestedSize}.` : ""}
            </p>

            {uploadedUrl ? (
              <p className="mt-2 text-xs text-emerald-400">
                Imagem pronta para salvar.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {open && imageSrc ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-[calc(100vw-2rem)] max-w-2xl rounded-2xl bg-slate-900 p-5 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Ajustar imagem</h3>
              <p className="mt-1 text-sm text-slate-400">
                Arraste e use o zoom para posicionar a imagem.
              </p>
            </div>

            <div className="relative h-[360px] overflow-hidden rounded-2xl bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropShape={cropShape}
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-slate-300">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={uploading}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90 disabled:opacity-60"
              >
                {uploading ? "Enviando..." : "Confirmar imagem"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}