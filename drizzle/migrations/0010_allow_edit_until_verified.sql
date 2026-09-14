DROP POLICY IF EXISTS "pendaftaran diubah pemilik draft" ON public.registrations;

CREATE POLICY "pendaftaran diubah pemilik sebelum verifikasi"
ON public.registrations
FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND status IN ('draft'::reg_status, 'submitted'::reg_status))
WITH CHECK (user_id = auth.uid() AND status IN ('draft'::reg_status, 'submitted'::reg_status));