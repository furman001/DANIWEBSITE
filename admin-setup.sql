-- ============================================================
-- STEP 1: Run this first to see all registered users
-- ============================================================
SELECT id, email, name, role FROM public.users;

-- ============================================================
-- STEP 2: Copy your admin email from the result above,
--         replace the placeholder below, then run it.
-- ============================================================
UPDATE public.users
SET role = 'admin'
WHERE email = 'YOUR_ADMIN_EMAIL_HERE';
