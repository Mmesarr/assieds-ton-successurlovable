import {
  FileText,
  UserSquare2,
  ClipboardCheck,
  Sparkles,
  HeartHandshake,
  Compass,
  MessageCircleHeart,
  Rocket,
  Calculator,
  TrendingUp,
  Languages,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    slug: "business-plan",
    title: "Rédaction de Business Plan",
    description: "Un plan d'affaires structuré et convaincant pour transformer votre idée en projet bancable.",
    icon: FileText,
  },
  {
    slug: "redaction-cv",
    title: "Rédaction de CV",
    description: "Un CV professionnel qui valorise votre parcours et vous démarque auprès des recruteurs.",
    icon: UserSquare2,
  },
  {
    slug: "suivi-projet",
    title: "Suivi et évaluation de projet",
    description: "Un accompagnement rigoureux pour piloter, mesurer et ajuster vos projets dans la durée.",
    icon: ClipboardCheck,
  },
  {
    slug: "coaching-entrepreneurs",
    title: "Coaching des entrepreneurs",
    description: "Un mentorat dédié pour relever les défis du quotidien et accélérer votre croissance.",
    icon: Rocket,
  },
  {
    slug: "developpement-personnel",
    title: "Coaching en développement personnel",
    description: "Identifiez vos forces, alignez vos objectifs et bâtissez la meilleure version de vous-même.",
    icon: Sparkles,
  },
  {
    slug: "coaching-personnalise",
    title: "Coaching personnalisé",
    description: "Un parcours sur mesure adapté à vos enjeux, votre rythme et vos ambitions.",
    icon: HeartHandshake,
  },
  {
    slug: "conseil-de-vie",
    title: "Conseil de vie",
    description: "Un espace d'écoute et de discernement pour des décisions claires aux moments charnières.",
    icon: Compass,
  },
  {
    slug: "formation-entrepreneuriat",
    title: "Formation en entrepreneuriat",
    description: "Les fondamentaux et bonnes pratiques pour lancer et faire prospérer votre entreprise.",
    icon: TrendingUp,
  },
  {
    slug: "education-financiere",
    title: "Éducation financière & comptabilité",
    description: "Maîtrisez vos finances et la comptabilité simplifiée pour décider en toute confiance.",
    icon: Calculator,
  },
  {
    slug: "renforcement-capacite",
    title: "Renforcement de capacité",
    description: "Des modules ciblés pour développer vos compétences clés et celles de vos équipes.",
    icon: MessageCircleHeart,
  },
  {
    slug: "anglais-en-ligne",
    title: "Perfectionnement en anglais",
    description: "Cours en ligne pour gagner en aisance professionnelle à l'oral comme à l'écrit.",
    icon: Languages,
  },
];
