INSERT INTO public.user_roles (user_id, role)
VALUES ('8516ae17-73b4-4954-95af-2265ec54f553', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;