-- 1. Enum des rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Table user_roles (séparée pour éviter privilege escalation)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Fonction security definer pour vérifier les rôles (évite la récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. Policies user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Trigger : assigner le rôle "user" à chaque nouvel inscrit
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_default_role();

-- 6. Permettre aux admins de voir tous les profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- 7. Table services (catalogue)
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all services"
  ON public.services FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Table appointments (rendez-vous)
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_title TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL,
  message TEXT,
  status appointment_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own pending appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all appointments"
  ON public.appointments FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all appointments"
  ON public.appointments FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_requested_at ON public.appointments(requested_at);

-- 9. Pré-remplir la table services avec les 11 services existants
INSERT INTO public.services (slug, title, description, icon, display_order) VALUES
  ('business-plan', 'Rédaction de Business Plan', 'Élaboration de business plans solides et bancables pour concrétiser vos projets entrepreneuriaux.', 'FileText', 1),
  ('coaching', 'Coaching des entrepreneurs', 'Accompagnement personnalisé pour développer votre leadership et atteindre vos objectifs.', 'Rocket', 2),
  ('education-financiere', 'Éducation financière & comptabilité', 'Maîtrisez vos finances personnelles et professionnelles avec nos formations adaptées.', 'Calculator', 3),
  ('developpement-personnel', 'Développement personnel', 'Libérez votre potentiel et transformez votre vie avec nos programmes sur mesure.', 'Sparkles', 4),
  ('creation-entreprise', 'Création d''entreprise', 'De l''idée à la concrétisation, accompagnement complet pour lancer votre activité.', 'Building2', 5),
  ('strategie-marketing', 'Stratégie marketing', 'Développez votre visibilité et conquérez de nouveaux clients avec une stratégie efficace.', 'TrendingUp', 6),
  ('gestion-projet', 'Gestion de projet', 'Pilotez vos projets avec méthode et atteignez vos objectifs dans les délais.', 'Target', 7),
  ('formation-pro', 'Formation professionnelle', 'Montez en compétences avec nos formations certifiantes et adaptées au marché.', 'GraduationCap', 8),
  ('conseil-juridique', 'Conseil juridique', 'Sécurisez vos activités avec des conseils juridiques adaptés à votre secteur.', 'Scale', 9),
  ('digitalisation', 'Digitalisation', 'Modernisez votre entreprise avec des solutions digitales performantes.', 'Smartphone', 10),
  ('mentoring', 'Mentoring entrepreneurial', 'Bénéficiez de l''expérience de mentors aguerris pour accélérer votre croissance.', 'Users', 11);