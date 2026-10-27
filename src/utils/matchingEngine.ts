import { Expert, AiDiagnosis } from '../types';

export interface ExpertMatchResult {
  expert: Expert;
  matchScore: number; // 0 - 100
  matchReasons: string[];
  isTopMatch: boolean;
}

export function matchExpertsToProblem(
  crop: string,
  symptoms: string,
  experts: Expert[]
): {
  matchedExperts: ExpertMatchResult[];
  diagnosis: AiDiagnosis;
} {
  const normalizedCrop = crop.trim().toLowerCase();
  const normalizedSymptoms = symptoms.trim().toLowerCase();

  // 1. Generate rule-based domain diagnosis
  const diagnosis = generatePreliminaryDiagnosis(normalizedCrop, normalizedSymptoms);

  // 2. Score each expert
  const scoredExperts = experts.map((expert) => {
    let score = 30; // base score for general qualified agronomist
    const reasons: string[] = [];

    // Crop match (+35)
    const hasExactCrop = expert.crops.some(c => c.toLowerCase() === normalizedCrop);
    const hasPartialCrop = expert.crops.some(c => 
      c.toLowerCase().includes(normalizedCrop) || normalizedCrop.includes(c.toLowerCase())
    );

    if (hasExactCrop) {
      score += 35;
      reasons.push(`Direct specialist in ${crop} cultivation`);
    } else if (hasPartialCrop) {
      score += 20;
      reasons.push(`Experience in related horticultural fruit crops`);
    }

    // Symptom keywords vs Specialties (+10 to +30)
    const symptomKeywords = extractKeywords(normalizedSymptoms);
    
    // Check specialty alignment
    let specialtyMatches = 0;
    expert.specialties.forEach(spec => {
      const specLower = spec.toLowerCase();
      symptomKeywords.forEach(kw => {
        if (specLower.includes(kw) || kw.includes(specLower)) {
          specialtyMatches++;
          if (reasons.length < 3) {
            reasons.push(`Focus on ${spec}`);
          }
        }
      });
    });

    score += Math.min(specialtyMatches * 12, 30);

    // Rating & experience boost (up to +10)
    if (expert.rating >= 4.9) {
      score += 5;
    }
    if (expert.experienceYears >= 12) {
      score += 5;
    }

    // Cap between 40 and 99
    const finalScore = Math.min(Math.max(score, 45), 98);

    if (reasons.length === 0) {
      reasons.push(`Certified crop doctor in ${expert.institution}`);
    }

    return {
      expert,
      matchScore: finalScore,
      matchReasons: reasons.slice(0, 3),
      isTopMatch: false
    };
  });

  // Sort descending by matchScore
  scoredExperts.sort((a, b) => b.matchScore - a.matchScore);
  if (scoredExperts.length > 0) {
    scoredExperts[0].isTopMatch = true;
  }

  return {
    matchedExperts: scoredExperts,
    diagnosis
  };
}

function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  const map: Record<string, string[]> = {
    yellow: ['chlorosis', 'yellowing', 'nutrient', 'potassium', 'deficiency', 'sigatoka', 'wilt'],
    yellowing: ['chlorosis', 'yellowing', 'nutrient', 'potassium', 'deficiency', 'sigatoka', 'wilt'],
    spot: ['leaf spot', 'sigatoka', 'blight', 'fungal', 'pathology'],
    spots: ['leaf spot', 'sigatoka', 'blight', 'fungal', 'pathology'],
    brown: ['sigatoka', 'blight', 'necrosis', 'fungal'],
    wilt: ['wilt', 'fusarium', 'panama', 'bacterial', 'root'],
    wilting: ['wilt', 'fusarium', 'panama', 'bacterial', 'root'],
    rot: ['stem', 'root', 'fungal', 'pathology', 'weevil'],
    leaf: ['foliar', 'foliar pests', 'leaf spot', 'pathology'],
    leaves: ['foliar', 'foliar pests', 'leaf spot', 'pathology'],
    insect: ['pest', 'ipm', 'entomology', 'aphid', 'weevil', 'borer'],
    bug: ['pest', 'ipm', 'entomology', 'aphid', 'weevil'],
    pest: ['pest', 'ipm', 'entomology', 'aphid', 'weevil', 'protection'],
    weevil: ['weevil', 'stem weevil', 'entomology', 'borer'],
    soil: ['soil chemistry', 'fertility', 'nutrition', 'fertilizer'],
    fertilizer: ['soil chemistry', 'fertility', 'nutrition', 'fertilizer'],
    curl: ['viral', 'aphid', 'mosaic', 'curling'],
    curling: ['viral', 'aphid', 'mosaic', 'curling']
  };

  const words = text.toLowerCase().split(/\W+/);
  words.forEach(w => {
    if (map[w]) {
      keywords.push(...map[w]);
    }
  });

  return Array.from(new Set(keywords));
}

function generatePreliminaryDiagnosis(crop: string, symptoms: string): AiDiagnosis {
  if (crop.includes('banana') || crop.includes('plantain')) {
    if (symptoms.includes('yellow') || symptoms.includes('chlorosis')) {
      return {
        likelyCauses: [
          {
            name: 'Potassium (K) Deficiency Chlorosis',
            probability: '78%',
            description: 'Marginal yellowing of older leaves progressing inward towards the midrib, followed by tip necrosis and curling.'
          },
          {
            name: 'Yellow / Black Sigatoka (*Pseudocercospora musae*)',
            probability: '65%',
            description: 'Early small chlorotic specks coalescing into oblong brown streaks with light grey centers along leaf veins.'
          },
          {
            name: 'Fusarium Wilt / Panama Disease Strain',
            probability: '35%',
            description: 'Older lower leaves yellow along margins, buckling at the petiole base and collapsing against the pseudostem.'
          }
        ],
        urgency: symptoms.includes('wilt') || symptoms.includes('rot') ? 'High' : 'Medium',
        recommendedSpecialistField: 'Plant Pathology & Soil Mineral Nutrition',
        immediateFieldAction: 'Take clear photos of the lower leaf undersides and petioles. Avoid excessive nitrogen fertilizer until the specialist examines the soil moisture balance.'
      };
    }
  }

  if (crop.includes('tomato')) {
    return {
      likelyCauses: [
        {
          name: 'Early Blight (*Alternaria solani*)',
          probability: '72%',
          description: 'Concentric ring brown spots with yellow halos appearing primarily on lower mature foliage.'
        },
        {
          name: 'Magnesium Deficiency Chlorosis',
          probability: '55%',
          description: 'Interveinal yellowing where green veins remain visible while leaf margins remain intact.'
        }
      ],
      urgency: 'Medium',
      recommendedSpecialistField: 'Horticultural Pathology & Integrated Pest Management',
      immediateFieldAction: 'Keep foliage dry during irrigation and inspect lower canopy for fungal spores.'
    };
  }

  if (crop.includes('rice')) {
    return {
      likelyCauses: [
        {
          name: 'Bacterial Leaf Blight (*Xanthomonas oryzae*)',
          probability: '70%',
          description: 'Water-soaked wavy lesions starting at leaf tips and margins, drying into pale yellow streaks.'
        },
        {
          name: 'Nitrogen / Potassium Imbalance',
          probability: '50%',
          description: 'General pale yellowing of older tillers and leaf tips without definite lesion margins.'
        }
      ],
      urgency: 'High',
      recommendedSpecialistField: 'Crop Protection & Agronomy',
      immediateFieldAction: 'Drain stagnant field water if bacterial streaming is suspected and note water depth.'
    };
  }

  // General default diagnosis
  return {
    likelyCauses: [
      {
        name: `${crop} Foliar Stress / Pathogen Complex`,
        probability: '68%',
        description: `Visual symptoms in ${crop} indicate possible localized fungal infection or micronutrient deficiency.`
      },
      {
        name: 'Nutrient Translocation Disorder',
        probability: '45%',
        description: 'Imbalance in root uptake caused by soil moisture saturation, compaction, or pH deviation.'
      }
    ],
    urgency: 'Medium',
    recommendedSpecialistField: 'General Agricultural Extension & Plant Pathology',
    immediateFieldAction: 'Isolate affected foliage samples and document when symptoms first manifested across your acreage.'
  };
}
