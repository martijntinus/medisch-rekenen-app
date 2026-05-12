import { makeId, randomInt, roundTo, sample } from '@/lib/math';
import type { CategoryId, GeneratedQuestion, QuestionTemplate } from '@/lib/types';

const names = ['mevrouw De Vries', 'meneer Jansen', 'mevrouw Bakker', 'meneer Smit', 'mevrouw Visser', 'meneer De Boer'];
const wards = ['interne geneeskunde', 'chirurgie', 'longgeneeskunde', 'cardiologie', 'geriatrie', 'neurologie'];

function q(categoryId: CategoryId, templateId: string, title: string, payload: Omit<GeneratedQuestion, 'id' | 'categoryId' | 'title'>): GeneratedQuestion {
  return { id: makeId(templateId), categoryId, title, ...payload };
}

function personCase(extra: string) {
  return `Tijdens je dienst op de afdeling ${sample(wards)} zorg je voor ${sample(names)}. ${extra}`;
}

export const questionTemplates: QuestionTemplate[] = [
  {
    id: 'eenheden-mg-g', categoryId: 'eenheden', title: 'Milligram naar gram', generate: () => {
      const mg = sample([250, 500, 750, 1000, 1250, 1500, 2000, 2500]);
      const answer = mg / 1000;
      return q('eenheden', 'eenheden-mg-g', 'Milligram naar gram', {
        caseText: personCase(`Een voorschrift vermeldt ${mg} mg werkzame stof.`),
        question: 'Hoeveel gram is dit?', answer, unit: 'g',
        explanation: [`1000 mg = 1 g.`, `${mg} mg ÷ 1000 = ${answer} g.`],
        safetyNote: 'Controleer bij medicatie altijd of mg, g en microgram niet worden verwisseld.',
        rounding: { label: 'Rond af op 2 decimalen.', decimals: 2, unit: 'g' }
      });
    }
  },
  {
    id: 'eenheden-micro-mg', categoryId: 'eenheden', title: 'Microgram naar milligram', generate: () => {
      const mcg = sample([125, 250, 500, 750, 1000, 1500, 2000]);
      const answer = mcg / 1000;
      return q('eenheden', 'eenheden-micro-mg', 'Microgram naar milligram', {
        caseText: personCase(`Het voorschrift vermeldt ${mcg} microgram.`),
        question: 'Hoeveel milligram is dit?', answer, unit: 'mg',
        explanation: ['1000 microgram = 1 mg.', `${mcg} microgram ÷ 1000 = ${answer} mg.`],
        safetyNote: 'Microgramverwisseling is een bekende medicatieveiligheidsrisico. Laat bij twijfel controleren.',
        rounding: { label: 'Rond af op 3 decimalen.', decimals: 3, unit: 'mg' }
      });
    }
  },
  {
    id: 'eenheden-l-ml', categoryId: 'eenheden', title: 'Liter naar milliliter', generate: () => {
      const l = sample([0.25, 0.5, 0.75, 1, 1.5, 2]);
      return q('eenheden', 'eenheden-l-ml', 'Liter naar milliliter', {
        caseText: personCase(`De vochtinname bevat ${l} liter drinkvoeding.`),
        question: 'Hoeveel milliliter is dit?', answer: l * 1000, unit: 'ml',
        explanation: ['1 liter = 1000 ml.', `${l} × 1000 = ${l * 1000} ml.`],
        safetyNote: 'Leg eenheden eenduidig vast in de rapportage.',
        rounding: { label: 'Rond af op hele ml.', decimals: 0, unit: 'ml' }
      });
    }
  },
  {
    id: 'medicatie-ml', categoryId: 'medicatie', title: 'Hoeveel ml optrekken', generate: () => {
      const dose = sample([25, 50, 75, 100, 125, 150, 200]);
      const conc = sample([25, 50, 100]);
      const answer = dose / conc;
      return q('medicatie', 'medicatie-ml', 'Hoeveel ml optrekken', {
        caseText: personCase(`Er is ${dose} mg voorgeschreven. De ampul bevat ${conc} mg/ml.`),
        question: 'Hoeveel ml trek je op?', answer, unit: 'ml',
        explanation: ['Benodigde ml = voorgeschreven dosis ÷ concentratie.', `${dose} ÷ ${conc} = ${roundTo(answer, 2)} ml.`],
        safetyNote: 'Controleer medicijn, dosering, patiënt, tijdstip, toedieningsweg en lokale protocollen.',
        rounding: { label: 'Rond af op 2 decimalen.', decimals: 2, unit: 'ml' }
      });
    }
  },
  {
    id: 'medicatie-dagdosering', categoryId: 'medicatie', title: 'Dagdosering verdelen', generate: () => {
      const daily = sample([900, 1200, 1500, 1800, 2400]);
      const gifts = sample([3, 4]);
      return q('medicatie', 'medicatie-dagdosering', 'Dagdosering verdelen', {
        caseText: personCase(`Een antibioticum is voorgeschreven als ${daily} mg per 24 uur, verdeeld over ${gifts} giften.`),
        question: 'Hoeveel mg geef je per gift?', answer: daily / gifts, unit: 'mg',
        explanation: ['Dosis per gift = totale dagdosering ÷ aantal giften.', `${daily} ÷ ${gifts} = ${daily / gifts} mg.`],
        safetyNote: 'Beoordeel altijd of doseringsinterval en nierfunctie volgens protocol zijn gecontroleerd.',
        rounding: { label: 'Rond af op hele mg.', decimals: 0, unit: 'mg' }
      });
    }
  },
  {
    id: 'gewicht-mgkg', categoryId: 'gewicht', title: 'Dosering per kg lichaamsgewicht', generate: () => {
      const weight = randomInt(45, 110);
      const dose = sample([5, 7.5, 10, 15, 20]);
      return q('gewicht', 'gewicht-mgkg', 'Dosering per kg lichaamsgewicht', {
        caseText: personCase(`Het voorschrift is ${dose} mg/kg. De patiënt weegt ${weight} kg.`),
        question: 'Hoeveel mg is de totale dosis?', answer: weight * dose, unit: 'mg',
        explanation: ['Totale dosis = gewicht × dosering per kg.', `${weight} × ${dose} = ${weight * dose} mg.`],
        safetyNote: 'Weeggegevens moeten actueel zijn; controleer maximale dagdosering en contra-indicaties.',
        rounding: { label: 'Rond af op hele mg.', decimals: 0, unit: 'mg' }
      });
    }
  },
  {
    id: 'gewicht-mgkgdag', categoryId: 'gewicht', title: 'Mg/kg/dag per gift', generate: () => {
      const weight = randomInt(40, 100);
      const dose = sample([20, 30, 40, 50]);
      const gifts = sample([2, 3, 4]);
      return q('gewicht', 'gewicht-mgkgdag', 'Mg/kg/dag per gift', {
        caseText: personCase(`Medicatie is voorgeschreven als ${dose} mg/kg/dag verdeeld over ${gifts} giften. Gewicht: ${weight} kg.`),
        question: 'Hoeveel mg geef je per gift?', answer: (weight * dose) / gifts, unit: 'mg',
        explanation: [`Dagdosering = ${weight} × ${dose} = ${weight * dose} mg.`, `Per gift = ${weight * dose} ÷ ${gifts} = ${roundTo((weight * dose) / gifts, 1)} mg.`],
        safetyNote: 'Bij kinderdoseringen en kwetsbare patiënten is dubbele controle extra belangrijk.',
        rounding: { label: 'Rond af op 1 decimaal.', decimals: 1, unit: 'mg' }
      });
    }
  },
  {
    id: 'tabletten-aantal', categoryId: 'tabletten', title: 'Aantal tabletten', generate: () => {
      const strength = sample([25, 50, 100, 250, 500]);
      const amount = sample([1, 1.5, 2, 2.5, 3]);
      const dose = strength * amount;
      return q('tabletten', 'tabletten-aantal', 'Aantal tabletten', {
        caseText: personCase(`Er is ${dose} mg voorgeschreven. Eén tablet bevat ${strength} mg.`),
        question: 'Hoeveel tabletten geef je?', answer: amount, unit: 'tablet(ten)',
        explanation: ['Aantal tabletten = voorgeschreven dosis ÷ sterkte per tablet.', `${dose} ÷ ${strength} = ${amount}.`],
        safetyNote: 'Controleer of delen van tabletten toegestaan is volgens bijsluiter/protocol.',
        rounding: { label: 'Rond af op halve tabletten waar passend.', decimals: 1, unit: 'tablet(ten)' }
      });
    }
  },
  {
    id: 'infuus-mluur', categoryId: 'infuus', title: 'Infuussnelheid ml/uur', generate: () => {
      const volume = sample([250, 500, 750, 1000, 1500]);
      const hours = sample([2, 4, 6, 8, 10, 12, 24]);
      return q('infuus', 'infuus-mluur', 'Infuussnelheid ml/uur', {
        caseText: personCase(`Er moet ${volume} ml infuusvloeistof in ${hours} uur inlopen.`),
        question: 'Op hoeveel ml/uur stel je de pomp in?', answer: volume / hours, unit: 'ml/uur',
        explanation: ['Infuussnelheid = volume ÷ tijd.', `${volume} ÷ ${hours} = ${roundTo(volume / hours, 1)} ml/uur.`],
        safetyNote: 'Controleer vochtbeperking, pompinstelling en infuusbeleid.',
        rounding: { label: 'Rond af op hele ml/uur.', decimals: 0, unit: 'ml/uur' }
      });
    }
  },
  {
    id: 'infuus-looptijd', categoryId: 'infuus', title: 'Looptijd berekenen', generate: () => {
      const volume = sample([250, 500, 1000]);
      const rate = sample([50, 75, 100, 125, 150]);
      return q('infuus', 'infuus-looptijd', 'Looptijd berekenen', {
        caseText: personCase(`Een zak van ${volume} ml loopt met ${rate} ml/uur.`),
        question: 'Hoeveel uur duurt het voordat de zak leeg is?', answer: volume / rate, unit: 'uur',
        explanation: ['Looptijd = volume ÷ snelheid.', `${volume} ÷ ${rate} = ${roundTo(volume / rate, 2)} uur.`],
        safetyNote: 'Controleer bij afwijkende looptijd of pomp en voorschrift kloppen.',
        rounding: { label: 'Rond af op 2 decimalen.', decimals: 2, unit: 'uur' }
      });
    }
  },
  {
    id: 'druppels-min', categoryId: 'druppels', title: 'Druppels per minuut', generate: () => {
      const volume = sample([250, 500, 1000]);
      const hours = sample([4, 6, 8, 10, 12]);
      const factor = sample([20, 15, 60]);
      const answer = (volume * factor) / (hours * 60);
      return q('druppels', 'druppels-min', 'Druppels per minuut', {
        caseText: personCase(`${volume} ml moet in ${hours} uur inlopen met een druppelfactor van ${factor} druppels/ml.`),
        question: 'Hoeveel druppels per minuut stel je in?', answer, unit: 'druppels/min',
        explanation: ['Druppels/min = volume × druppelfactor ÷ tijd in minuten.', `${volume} × ${factor} ÷ (${hours} × 60) = ${roundTo(answer, 1)}.`],
        safetyNote: 'Druppelsnelheid is minder nauwkeurig dan een pomp; monitor de patiënt en het infuus.',
        rounding: { label: 'Rond af op hele druppels per minuut.', decimals: 0, unit: 'druppels/min' }
      });
    }
  },
  {
    id: 'verdunnen-concentratie', categoryId: 'verdunnen', title: 'Nieuwe concentratie', generate: () => {
      const mg = sample([250, 500, 750, 1000, 1500]);
      const ml = sample([50, 100, 250]);
      return q('verdunnen', 'verdunnen-concentratie', 'Nieuwe concentratie', {
        caseText: personCase(`${mg} mg medicatie wordt opgelost tot een totaalvolume van ${ml} ml.`),
        question: 'Wat is de concentratie in mg/ml?', answer: mg / ml, unit: 'mg/ml',
        explanation: ['Concentratie = hoeveelheid stof ÷ totaalvolume.', `${mg} ÷ ${ml} = ${roundTo(mg / ml, 2)} mg/ml.`],
        safetyNote: 'Gebruik alleen verdunningen die volgens protocol en productinformatie toegestaan zijn.',
        rounding: { label: 'Rond af op 2 decimalen.', decimals: 2, unit: 'mg/ml' }
      });
    }
  },
  {
    id: 'verdunnen-toevoegen', categoryId: 'verdunnen', title: 'Benodigde ml uit concentraat', generate: () => {
      const targetMg = sample([50, 100, 150, 200, 250]);
      const conc = sample([25, 50, 100]);
      return q('verdunnen', 'verdunnen-toevoegen', 'Benodigde ml uit concentraat', {
        caseText: personCase(`Je moet ${targetMg} mg toevoegen uit een concentraat van ${conc} mg/ml.`),
        question: 'Hoeveel ml concentraat heb je nodig?', answer: targetMg / conc, unit: 'ml',
        explanation: ['Benodigde ml = gewenste hoeveelheid ÷ concentratie.', `${targetMg} ÷ ${conc} = ${roundTo(targetMg / conc, 2)} ml.`],
        safetyNote: 'Werk aseptisch en label bereide medicatie volgens lokaal beleid.',
        rounding: { label: 'Rond af op 2 decimalen.', decimals: 2, unit: 'ml' }
      });
    }
  },
  {
    id: 'vochtbalans', categoryId: 'vochtbalans', title: 'Vochtbalans', generate: () => {
      const intake = randomInt(1200, 2600);
      const urine = randomInt(700, 1800);
      const drain = randomInt(0, 450);
      const vomit = sample([0, 100, 150, 250]);
      const output = urine + drain + vomit;
      return q('vochtbalans', 'vochtbalans', 'Vochtbalans', {
        caseText: personCase(`Intake: ${intake} ml. Output: urine ${urine} ml, drain ${drain} ml, braken ${vomit} ml.`),
        question: 'Wat is de vochtbalans in ml?', answer: intake - output, unit: 'ml',
        explanation: [`Totale output = ${urine} + ${drain} + ${vomit} = ${output} ml.`, `Balans = intake - output = ${intake} - ${output} = ${intake - output} ml.`],
        safetyNote: 'Rapporteer afwijkende vochtbalans en beoordeel klinische context zoals oedeem, diurese en vitale functies.',
        rounding: { label: 'Rond af op hele ml.', decimals: 0, unit: 'ml' }
      });
    }
  },
  {
    id: 'zuurstof-cilinderduur', categoryId: 'zuurstof', title: 'Cilinderduur', generate: () => {
      const pressure = randomInt(90, 180);
      const size = sample([2, 5, 10]);
      const flow = sample([2, 3, 4, 5, 6, 8, 10]);
      const reserve = 10;
      const usable = Math.max(pressure - reserve, 0) * size;
      const answer = usable / flow;
      return q('zuurstof', 'zuurstof-cilinderduur', 'Cilinderduur met veiligheidsreserve', {
        caseText: personCase(`Een zuurstofcilinder van ${size} liter heeft ${pressure} bar. Je houdt ${reserve} bar reserve aan. De flow is ${flow} l/min.`),
        question: 'Hoeveel minuten zuurstof is beschikbaar?', answer, unit: 'minuten',
        explanation: [`Bruikbare inhoud = (${pressure} - ${reserve}) × ${size} = ${usable} liter.`, `Duur = ${usable} ÷ ${flow} = ${roundTo(answer, 1)} minuten.`],
        safetyNote: 'Bij zuurstoftransport altijd reserve, toedieningssysteem en klinische toestand controleren.',
        rounding: { label: 'Rond af op hele minuten.', decimals: 0, unit: 'minuten' }
      });
    }
  },
  {
    id: 'zuurstof-flowtijd', categoryId: 'zuurstof', title: 'Benodigde zuurstofvoorraad', generate: () => {
      const flow = sample([2, 3, 4, 5, 6, 8]);
      const time = sample([20, 30, 45, 60, 90]);
      return q('zuurstof', 'zuurstof-flowtijd', 'Flow en tijd', {
        caseText: personCase(`Voor een onderzoek is zuurstof nodig met een flow van ${flow} l/min gedurende ${time} minuten.`),
        question: 'Hoeveel liter zuurstof is minimaal nodig?', answer: flow * time, unit: 'liter',
        explanation: ['Benodigde zuurstof = flow × tijd.', `${flow} × ${time} = ${flow * time} liter.`],
        safetyNote: 'Neem in de praktijk extra reserve mee en volg het transportprotocol.',
        rounding: { label: 'Rond af op hele liters.', decimals: 0, unit: 'liter' }
      });
    }
  },
  {
    id: 'zuurstof-venturi', categoryId: 'zuurstof', title: 'Venturi totaalflow', generate: () => {
      const oxygenFlow = sample([4, 6, 8, 10, 12]);
      const ratio = sample([3, 4, 5, 6]);
      return q('zuurstof', 'zuurstof-venturi', 'Venturi-berekening', {
        caseText: personCase(`Een Venturi-systeem mengt 1 deel zuurstof met ${ratio} delen lucht. De zuurstofflow is ${oxygenFlow} l/min.`),
        question: 'Wat is de totale flow in l/min?', answer: oxygenFlow * (ratio + 1), unit: 'l/min',
        explanation: [`Totaal aantal delen = 1 + ${ratio} = ${ratio + 1}.`, `Totale flow = ${oxygenFlow} × ${ratio + 1} = ${oxygenFlow * (ratio + 1)} l/min.`],
        safetyNote: 'Gebruik Venturi-instellingen volgens fabrikant en lokaal protocol; deze som is oefenmateriaal.',
        rounding: { label: 'Rond af op hele l/min.', decimals: 0, unit: 'l/min' }
      });
    }
  }
];

export function generateQuestion(categoryId: CategoryId): GeneratedQuestion {
  const options = questionTemplates.filter((template) => template.categoryId === categoryId);
  return sample(options).generate();
}

export function generateSet(categoryId: CategoryId, count = 8): GeneratedQuestion[] {
  return Array.from({ length: count }, () => generateQuestion(categoryId));
}
