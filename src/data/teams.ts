export interface SeedTeam {
  name: string;
  code: string;
  flag_emoji: string;
  group_name: string;
}

/** 48 selecciones — sorteo final FIFA (dic 2025) + playoffs (mar 2026). Fuente: FIFA / Roadtrips */
export const TEAMS: SeedTeam[] = [
  { name: "México", code: "MEX", flag_emoji: "🇲🇽", group_name: "Grupo A" },
  { name: "Sudáfrica", code: "RSA", flag_emoji: "🇿🇦", group_name: "Grupo A" },
  { name: "Corea del Sur", code: "KOR", flag_emoji: "🇰🇷", group_name: "Grupo A" },
  { name: "Chequia", code: "CZE", flag_emoji: "🇨🇿", group_name: "Grupo A" },

  { name: "Canadá", code: "CAN", flag_emoji: "🇨🇦", group_name: "Grupo B" },
  { name: "Suiza", code: "SUI", flag_emoji: "🇨🇭", group_name: "Grupo B" },
  { name: "Qatar", code: "QAT", flag_emoji: "🇶🇦", group_name: "Grupo B" },
  { name: "Bosnia y Herzegovina", code: "BIH", flag_emoji: "🇧🇦", group_name: "Grupo B" },

  { name: "Brasil", code: "BRA", flag_emoji: "🇧🇷", group_name: "Grupo C" },
  { name: "Marruecos", code: "MAR", flag_emoji: "🇲🇦", group_name: "Grupo C" },
  { name: "Haití", code: "HAI", flag_emoji: "🇭🇹", group_name: "Grupo C" },
  { name: "Escocia", code: "SCO", flag_emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group_name: "Grupo C" },

  { name: "Estados Unidos", code: "USA", flag_emoji: "🇺🇸", group_name: "Grupo D" },
  { name: "Paraguay", code: "PAR", flag_emoji: "🇵🇾", group_name: "Grupo D" },
  { name: "Australia", code: "AUS", flag_emoji: "🇦🇺", group_name: "Grupo D" },
  { name: "Turquía", code: "TUR", flag_emoji: "🇹🇷", group_name: "Grupo D" },

  { name: "Alemania", code: "GER", flag_emoji: "🇩🇪", group_name: "Grupo E" },
  { name: "Curazao", code: "CUW", flag_emoji: "🇨🇼", group_name: "Grupo E" },
  { name: "Costa de Marfil", code: "CIV", flag_emoji: "🇨🇮", group_name: "Grupo E" },
  { name: "Ecuador", code: "ECU", flag_emoji: "🇪🇨", group_name: "Grupo E" },

  { name: "Países Bajos", code: "NED", flag_emoji: "🇳🇱", group_name: "Grupo F" },
  { name: "Japón", code: "JPN", flag_emoji: "🇯🇵", group_name: "Grupo F" },
  { name: "Túnez", code: "TUN", flag_emoji: "🇹🇳", group_name: "Grupo F" },
  { name: "Suecia", code: "SWE", flag_emoji: "🇸🇪", group_name: "Grupo F" },

  { name: "Bélgica", code: "BEL", flag_emoji: "🇧🇪", group_name: "Grupo G" },
  { name: "Egipto", code: "EGY", flag_emoji: "🇪🇬", group_name: "Grupo G" },
  { name: "Irán", code: "IRN", flag_emoji: "🇮🇷", group_name: "Grupo G" },
  { name: "Nueva Zelanda", code: "NZL", flag_emoji: "🇳🇿", group_name: "Grupo G" },

  { name: "España", code: "ESP", flag_emoji: "🇪🇸", group_name: "Grupo H" },
  { name: "Cabo Verde", code: "CPV", flag_emoji: "🇨🇻", group_name: "Grupo H" },
  { name: "Arabia Saudita", code: "KSA", flag_emoji: "🇸🇦", group_name: "Grupo H" },
  { name: "Uruguay", code: "URU", flag_emoji: "🇺🇾", group_name: "Grupo H" },

  { name: "Francia", code: "FRA", flag_emoji: "🇫🇷", group_name: "Grupo I" },
  { name: "Senegal", code: "SEN", flag_emoji: "🇸🇳", group_name: "Grupo I" },
  { name: "Noruega", code: "NOR", flag_emoji: "🇳🇴", group_name: "Grupo I" },
  { name: "Irak", code: "IRQ", flag_emoji: "🇮🇶", group_name: "Grupo I" },

  { name: "Argentina", code: "ARG", flag_emoji: "🇦🇷", group_name: "Grupo J" },
  { name: "Argelia", code: "ALG", flag_emoji: "🇩🇿", group_name: "Grupo J" },
  { name: "Austria", code: "AUT", flag_emoji: "🇦🇹", group_name: "Grupo J" },
  { name: "Jordania", code: "JOR", flag_emoji: "🇯🇴", group_name: "Grupo J" },

  { name: "Portugal", code: "POR", flag_emoji: "🇵🇹", group_name: "Grupo K" },
  { name: "Uzbekistán", code: "UZB", flag_emoji: "🇺🇿", group_name: "Grupo K" },
  { name: "Colombia", code: "COL", flag_emoji: "🇨🇴", group_name: "Grupo K" },
  { name: "Congo DR", code: "COD", flag_emoji: "🇨🇩", group_name: "Grupo K" },

  { name: "Inglaterra", code: "ENG", flag_emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group_name: "Grupo L" },
  { name: "Croacia", code: "CRO", flag_emoji: "🇭🇷", group_name: "Grupo L" },
  { name: "Ghana", code: "GHA", flag_emoji: "🇬🇭", group_name: "Grupo L" },
  { name: "Panamá", code: "PAN", flag_emoji: "🇵🇦", group_name: "Grupo L" },

  { name: "Por definir", code: "TBD", flag_emoji: "❓", group_name: "Eliminatoria" },
];
