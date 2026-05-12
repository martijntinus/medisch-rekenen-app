import type { Category } from '@/lib/types';

export const categories: Category[] = [
  { id: 'eenheden', name: 'Eenheden omrekenen', description: 'mg, g, microgram, ml en liter veilig omzetten.', icon: '↔️' },
  { id: 'medicatie', name: 'Medicatieberekeningen', description: 'Doseringen, concentraties en toedieningshoeveelheden.', icon: '💊' },
  { id: 'gewicht', name: 'Dosering per kg', description: 'Rekenen met lichaamsgewicht, dagdosering en giften.', icon: '⚖️' },
  { id: 'tabletten', name: 'Tabletten/capsules', description: 'Aantal tabletten, halve tabletten en voorraadcontrole.', icon: '◐' },
  { id: 'infuus', name: 'Infuussnelheden', description: 'ml/uur, looptijd en pompinstellingen.', icon: '🩺' },
  { id: 'druppels', name: 'Druppelsnelheid', description: 'Druppels per minuut met verschillende druppelfactoren.', icon: '💧' },
  { id: 'verdunnen', name: 'Concentraties en verdunnen', description: 'Verdunnen, oplossen en concentraties controleren.', icon: '🧪' },
  { id: 'vochtbalans', name: 'Vochtbalans', description: 'Intake, output en balans interpreteren.', icon: '📋' },
  { id: 'zuurstof', name: 'Zuurstof rekenen', description: 'Cilinderduur, flow, reserve en Venturi-casussen.', icon: '🫁' }
];
