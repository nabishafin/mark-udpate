export type Organ = {
  id: string;
  name: string;
  x: number;
  y: number;
  tagline: string;
  bodySystem: string;
  description: string;
  hydrationImpact: string;
  oxidativeImpact: string;
  recovery: string;
  microCta: string;
  metrics: { label: string; value: string; unit?: string }[];
  color: 'blue' | 'gold' | 'green';
};

export const ORGANS: Organ[] = [
  {
    id: 'brain',
    name: 'Brain & Nervous System',
    bodySystem: 'CNS / Neural Network',
    x: 50,
    y: 10,
    tagline: 'Your Brain Runs on Hydration and Energy',
    description:
      'The brain is nearly 75% water and uses enormous amounts of energy every second. From memory and focus to mood and recovery, healthy hydration plays a critical role in how the brain communicates and performs.',
    hydrationImpact:
      'Modern research explores how hydration may support mental clarity, cellular energy production, healthy circulation, waste removal during sleep, and healthy neurotransmitter function.',
    oxidativeImpact:
      'Healthy hydration and DDW protocols are positioned to support oxidative balance while helping reduce the cellular strain associated with dehydration.',
    recovery:
      'Dehydration may increase brain fog, fatigue, mental stress, reduced concentration, and cognitive strain.',
    microCta: 'Support Cognitive Performance From Within',
    metrics: [
      { label: 'Water content', value: '75', unit: '%' },
      { label: 'Focus support', value: 'Cellular' },
      { label: 'DDW target', value: '5', unit: 'ppm' },
    ],
    color: 'blue',
  },
  {
    id: 'eyes',
    name: 'Eyes & Visual System',
    bodySystem: 'Sensory / Optic',
    x: 50,
    y: 13,
    tagline: 'Hydration Helps Support Visual Performance',
    description:
      'The eyes depend on healthy hydration and circulation to function properly. Cellular stress and dehydration may contribute to fatigue and strain throughout the visual system.',
    hydrationImpact:
      'Healthy hydration may support eye moisture balance, nutrient delivery, circulation to delicate tissues, and visual comfort during screen exposure.',
    oxidativeImpact:
      'Balanced hydration may help support reduced oxidative stress in tissues that work continuously throughout the day.',
    recovery:
      'Visual comfort can be supported by hydrating the broader system behind vision, not only the surface of the eyes.',
    microCta: 'Hydrate the System Behind Vision',
    metrics: [
      { label: 'Moisture', value: 'Balance' },
      { label: 'Screen comfort', value: 'Support' },
    ],
    color: 'gold',
  },
  {
    id: 'mouth',
    name: 'Mouth, Throat & Cellular Absorption',
    bodySystem: 'Absorption / Hydration',
    x: 50,
    y: 17,
    tagline: 'Hydration Begins Here',
    description:
      'Water absorption starts immediately throughout the mouth and digestive tract. Hydration is one of the body\'s most essential biological functions, influencing nearly every system in the body.',
    hydrationImpact:
      'Proper hydration supports nutrient transport, saliva production, digestive preparation, cellular communication, and metabolic balance.',
    oxidativeImpact:
      'A consistent hydration protocol helps the body maintain the fluid environment needed for normal cellular balance.',
    recovery:
      'Daily hydration habits begin with intake, absorption, and the systems that move water into circulation.',
    microCta: 'Hydration Begins Here',
    metrics: [
      { label: 'Absorption', value: 'Immediate' },
      { label: 'Cell signal', value: 'Support' },
    ],
    color: 'green',
  },
  {
    id: 'heart',
    name: 'Heart & Circulation',
    bodySystem: 'Cardiovascular',
    x: 50.5,
    y: 28,
    tagline: 'Every Cell Depends on Circulation',
    description:
      'The cardiovascular system delivers oxygen, nutrients, and hydration throughout the body. Proper hydration supports healthy blood flow and helps transport metabolic waste away from cells.',
    hydrationImpact:
      'Healthy circulation supports oxygen transport, physical endurance, energy production, recovery after activity, and nutrient delivery.',
    oxidativeImpact:
      'Dehydration may place added stress on circulation and energy systems, increasing the importance of consistent cellular hydration.',
    recovery:
      'Hydration helps fuel the flow of life by supporting the systems that move oxygen and nutrients through the body.',
    microCta: 'Fuel the Flow of Life',
    metrics: [
      { label: 'Circulation', value: 'O2' },
      { label: 'Recovery', value: 'Flow' },
    ],
    color: 'blue',
  },
  {
    id: 'lungs',
    name: 'Lungs & Oxygen Delivery',
    bodySystem: 'Respiratory',
    x: 52.5,
    y: 28,
    tagline: 'Energy Begins With Oxygen',
    description:
      'The lungs work closely with circulation and hydration systems to support oxygen delivery throughout the body.',
    hydrationImpact:
      'Healthy hydration may support efficient circulation, cellular oxygen transport, athletic endurance, and recovery from physical stress.',
    oxidativeImpact:
      'Every breath supports the mitochondria, the tiny energy factories inside your cells, where oxidative balance matters for cellular performance.',
    recovery:
      'Oxygen delivery, circulation, and hydration work together to support the body after stress and exertion.',
    microCta: 'Support Oxygen Delivery From Within',
    metrics: [
      { label: 'Oxygen', value: 'Delivery' },
      { label: 'Endurance', value: 'Support' },
    ],
    color: 'blue',
  },
  {
    id: 'liver',
    name: 'Liver & Detox Support',
    bodySystem: 'Hepatic / Metabolic',
    x: 48.5,
    y: 38,
    tagline: 'The Body\'s Natural Filtration System',
    description:
      'The liver helps process metabolic waste products, including ammonia created during protein metabolism.',
    hydrationImpact:
      'Healthy hydration supports natural detox pathways, metabolic balance, waste transport, and recovery systems.',
    oxidativeImpact:
      'Researchers study how dehydration and oxidative stress may place additional strain on detoxification systems.',
    recovery:
      'Supporting hydration and mitochondrial function may help maintain healthy cellular efficiency.',
    microCta: 'Support Natural Detoxification Pathways',
    metrics: [
      { label: 'Detox', value: 'Natural' },
      { label: 'Waste', value: 'Transport' },
    ],
    color: 'gold',
  },
  {
    id: 'gut',
    name: 'Gut & Microbiome',
    bodySystem: 'Enteric / Immune',
    x: 50,
    y: 45,
    tagline: 'Where Immunity and Absorption Begin',
    description:
      'Nearly 70% of the immune system is connected to the gut. Hydration supports digestion, nutrient absorption, and healthy gut barrier function.',
    hydrationImpact:
      'Healthy gut balance may support nutrient absorption, energy production, digestive comfort, immune balance, and reduced metabolic stress.',
    oxidativeImpact:
      'Researchers also study how poor gut balance may contribute to increased ammonia production and inflammatory stress.',
    recovery:
      'Supporting hydration helps maintain the foundation of wellness across digestion, immunity, and energy systems.',
    microCta: 'Support the Foundation of Wellness',
    metrics: [
      { label: 'Immune link', value: '70', unit: '%' },
      { label: 'Absorption', value: 'Gut' },
    ],
    color: 'green',
  },
  {
    id: 'kidneys',
    name: 'Kidneys & Filtration',
    bodySystem: 'Renal',
    x: 52,
    y: 42,
    tagline: 'The Body\'s Fluid Balance System',
    description:
      'The kidneys help regulate fluid balance while filtering waste from the bloodstream.',
    hydrationImpact:
      'Proper hydration supports waste removal, electrolyte balance, circulation, recovery, and metabolic stability.',
    oxidativeImpact:
      'When hydration drops, waste products can become more concentrated inside the body.',
    recovery:
      'Healthy filtration and flow are central to the body\'s daily recovery and fluid balance.',
    microCta: 'Support Healthy Filtration and Flow',
    metrics: [
      { label: 'Fluid', value: 'Balance' },
      { label: 'Electrolytes', value: 'Support' },
    ],
    color: 'blue',
  },
  {
    id: 'muscles',
    name: 'Muscles & Recovery',
    bodySystem: 'Skeletal Muscle',
    x: 42,
    y: 42,
    tagline: 'Performance Depends on Cellular Energy',
    description:
      'During intense activity, muscles generate metabolic waste and oxidative stress. Hydration supports circulation, recovery, and energy production.',
    hydrationImpact:
      'Athletes and active individuals often focus on recovery support, reduced fatigue, endurance, cellular hydration, and mitochondrial performance.',
    oxidativeImpact:
      'Healthy hydration helps the body manage physical stress more efficiently.',
    recovery:
      'Hydration connects circulation, energy production, and the recovery systems active after training or daily exertion.',
    microCta: 'Hydrate Recovery at the Cellular Level',
    metrics: [
      { label: 'Recovery', value: 'Cellular' },
      { label: 'Energy', value: 'ATP' },
    ],
    color: 'blue',
  },
  {
    id: 'joints',
    name: 'Joints & Cartilage',
    bodySystem: 'Musculoskeletal',
    x: 48.5,
    y: 72,
    tagline: 'Movement Depends on Hydration',
    description:
      'Joints rely on hydration for lubrication, mobility, and shock absorption.',
    hydrationImpact:
      'Healthy hydration may support joint comfort, flexibility, cartilage function, mobility, and recovery after movement.',
    oxidativeImpact:
      'Oxidative stress and aging may affect joint performance over time.',
    recovery:
      'Supporting mobility from within starts with the fluid balance that helps joints move comfortably.',
    microCta: 'Support Mobility From Within',
    metrics: [
      { label: 'Mobility', value: 'Support' },
      { label: 'Cartilage', value: 'Hydration' },
    ],
    color: 'gold',
  },
  {
    id: 'skin',
    name: 'Skin & Healthy Aging',
    bodySystem: 'Dermal / Aging',
    x: 62,
    y: 36,
    tagline: 'Hydration You Can See',
    description:
      'The skin reflects internal hydration and cellular balance. Proper hydration supports elasticity, circulation, and healthy skin appearance.',
    hydrationImpact:
      'Healthy hydration may help support skin moisture balance, recovery from oxidative stress, cellular renewal, and healthy aging routines.',
    oxidativeImpact:
      'The appearance of healthy skin often begins at the cellular level, where hydration and oxidative balance shape resilience.',
    recovery:
      'A daily hydration protocol supports the internal conditions behind visible radiance.',
    microCta: 'Radiance Starts Within',
    metrics: [
      { label: 'Moisture', value: 'Skin' },
      { label: 'Renewal', value: 'Support' },
    ],
    color: 'gold',
  },
  {
    id: 'mitochondria',
    name: 'Mitochondria & Cellular Energy',
    bodySystem: 'Cellular Energy',
    x: 48.5,
    y: 58,
    tagline: 'The Power Source of Human Performance',
    description:
      'Mitochondria produce ATP, the energy currency used by every cell in the body.',
    hydrationImpact:
      'Researchers studying DDW are exploring its potential role in supporting cellular energy production, metabolic efficiency, and mitochondrial performance.',
    oxidativeImpact:
      'DDW research also focuses on oxidative balance, one of the cellular conditions tied to performance and recovery systems.',
    recovery:
      'Every heartbeat, thought, movement, and recovery process depends on cellular energy.',
    microCta: 'Support Energy at the Source',
    metrics: [
      { label: 'Energy', value: 'ATP' },
      { label: 'DDW', value: '5', unit: 'ppm' },
    ],
    color: 'green',
  },
];
