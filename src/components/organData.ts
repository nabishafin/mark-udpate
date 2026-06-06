export type Organ = {
  id: string;
  name: string;
  // hotspot position in % of SVG viewBox (400x900)
  x: number;
  y: number;
  tagline: string;
  bodySystem: string;
  description: string;
  hydrationImpact: string;
  oxidativeImpact: string;
  recovery: string;
  metrics: {label: string;value: string;unit?: string;}[];
  color: 'blue' | 'gold' | 'green';
};

export const ORGANS: Organ[] = [
{
  id: 'brain',
  name: 'Brain & Nervous System',
  bodySystem: 'CNS / Neural Network',
  x: 50,
  y: 7.5,
  tagline: 'Neural conductivity & cognitive performance',
  description:
  'Your brain is 73% water. Optimal hydration sharpens cellular communication, accelerates neurotransmitter release, and stabilizes synaptic firing. DDW reduces deuterium load on neural mitochondria, improving ATP yield in the regions of the cortex most active during deep work.',
  hydrationImpact:
  'Restores intracellular fluid balance, supports myelin integrity, and enhances neural conductivity by up to 14% in independent EEG studies.',
  oxidativeImpact:
  'Lowers ROS accumulation in neurons, protecting mitochondrial DNA and slowing age-related cognitive decline.',
  recovery:
  'Deepens slow-wave sleep cycles. Supports glymphatic clearance, the brain’s overnight detoxification system.',
  metrics: [
  { label: 'Water composition', value: '73', unit: '%' },
  { label: 'ATP demand', value: '20', unit: '% body energy' },
  { label: 'Synaptic uplift', value: '+14', unit: '%' }],

  color: 'blue'
},
{
  id: 'eyes',
  name: 'Eyes & Optic System',
  bodySystem: 'Sensory / Optic',
  x: 50,
  y: 9.5,
  tagline: 'Tear film integrity & retinal energy',
  description:
  'The retina is the most metabolically demanding tissue in the body per gram. Cellular hydration maintains tear film osmolarity, lens transparency, and photoreceptor turnover.',
  hydrationImpact:
  'Stabilizes the tear film, reduces dry-eye episodes, and supports lens flexibility for sharper accommodation.',
  oxidativeImpact:
  'Reduces oxidative stress in the retinal pigment epithelium — a leading marker for macular degeneration.',
  recovery:
  'Faster recovery from screen fatigue and night-vision adaptation.',
  metrics: [
  { label: 'Tear osmolarity', value: '−9', unit: '%' },
  { label: 'Photoreceptor ATP', value: '+11', unit: '%' }],

  color: 'gold'
},
{
  id: 'heart',
  name: 'Heart & Circulation',
  bodySystem: 'Cardiovascular',
  x: 44,
  y: 27,
  tagline: 'Cellular flow & cardiac output',
  description:
  'Each heartbeat moves 5L of plasma. Hydration thickness directly governs cardiac efficiency. DDW reduces metabolic strain on cardiomyocytes by lowering deuterium-induced mitochondrial inefficiency.',
  hydrationImpact:
  'Optimizes stroke volume and lowers resting heart rate by improving plasma viscosity.',
  oxidativeImpact:
  'Reduces LDL oxidation and protects endothelial cells from free radical damage.',
  recovery: 'Faster heart-rate variability rebound after intense exertion.',
  metrics: [
  { label: 'Plasma volume', value: '5.0', unit: 'L/min' },
  { label: 'HRV recovery', value: '+22', unit: '%' }],

  color: 'blue'
},
{
  id: 'lungs',
  name: 'Lungs & Oxygen Exchange',
  bodySystem: 'Respiratory',
  x: 56,
  y: 26,
  tagline: 'Alveolar surface & O₂ saturation',
  description:
  'Your lungs hold 300 million alveoli — a surface area the size of a tennis court. Mucosal hydration governs gas exchange efficiency and respiratory recovery.',
  hydrationImpact:
  'Thins bronchial mucus, expands alveolar exchange, and improves VO₂ max in trained athletes.',
  oxidativeImpact:
  'Reduces inhaled-particulate oxidative damage to lung epithelium.',
  recovery:
  'Improves overnight oxygen saturation and reduces inflammatory cough markers.',
  metrics: [
  { label: 'Alveoli', value: '300M' },
  { label: 'VO₂ max', value: '+8', unit: '%' }],

  color: 'blue'
},
{
  id: 'liver',
  name: 'Liver & Detoxification',
  bodySystem: 'Hepatic / Metabolic',
  x: 45,
  y: 36,
  tagline: 'Phase I & II clearance pathways',
  description:
  'The liver runs over 500 metabolic functions. Hydration is the solvent that powers every detox pathway. DDW reduces deuterium retention in hepatic mitochondria for cleaner ATP cycles.',
  hydrationImpact:
  'Enhances bile flow and accelerates conjugation of metabolic byproducts.',
  oxidativeImpact:
  'Boosts glutathione production — the body’s master antioxidant.',
  recovery:
  'Faster clearance of exercise-induced lactate and metabolic waste.',
  metrics: [
  { label: 'Functions', value: '500+' },
  { label: 'Glutathione', value: '+18', unit: '%' }],

  color: 'gold'
},
{
  id: 'gut',
  name: 'Gut & Microbiome',
  bodySystem: 'Enteric',
  x: 50,
  y: 44,
  tagline: 'Microbial diversity & barrier function',
  description:
  'The gut hosts 100 trillion microbes — your second brain. Cellular hydration supports villi function, nutrient absorption, and the integrity of the intestinal barrier.',
  hydrationImpact:
  'Maintains mucin layer thickness and prevents tight-junction breakdown.',
  oxidativeImpact:
  'Modulates inflammation in gut-associated lymphoid tissue (GALT).',
  recovery:
  'Reduces post-meal bloating and stabilizes gut-brain axis signaling.',
  metrics: [
  { label: 'Microbes', value: '100T' },
  { label: 'Barrier integrity', value: '+16', unit: '%' }],

  color: 'green'
},
{
  id: 'kidneys',
  name: 'Kidneys & Filtration',
  bodySystem: 'Renal',
  x: 56,
  y: 41,
  tagline: 'Glomerular flow & electrolyte balance',
  description:
  'Your kidneys filter 180L of fluid daily. Hydration quality directly determines filtration efficiency and electrolyte stability.',
  hydrationImpact:
  'Reduces solute concentration and supports glomerular flow rate (GFR).',
  oxidativeImpact: 'Protects renal tubules from oxidative tubular necrosis.',
  recovery:
  'Improved overnight filtration and reduced morning urine concentration.',
  metrics: [
  { label: 'Daily filtration', value: '180', unit: 'L' },
  { label: 'GFR support', value: '+12', unit: '%' }],

  color: 'blue'
},
{
  id: 'spine',
  name: 'Spine & Disc Hydration',
  bodySystem: 'Skeletal / Neural',
  x: 50,
  y: 33,
  tagline: 'Intervertebral disc rebound',
  description:
  'Intervertebral discs lose up to 2cm of height through the day. Cellular hydration restores nucleus pulposus pressure and spinal alignment overnight.',
  hydrationImpact:
  'Rehydrates the nucleus pulposus, restoring disc height and cushioning.',
  oxidativeImpact: 'Reduces inflammatory cytokines around the spinal column.',
  recovery: 'Improved overnight spinal decompression and posture quality.',
  metrics: [{ label: 'Disc height', value: '+1.6', unit: 'cm overnight' }],
  color: 'blue'
},
{
  id: 'joints',
  name: 'Joints & Cartilage',
  bodySystem: 'Musculoskeletal',
  x: 38,
  y: 62,
  tagline: 'Synovial flow & cartilage cushion',
  description:
  'Cartilage is 75% water. Without hydration, joint surfaces grind. With it, they glide. DDW reduces oxidative load on chondrocytes — the cells that maintain your joint surfaces.',
  hydrationImpact:
  'Restores synovial fluid viscosity and cartilage cushioning.',
  oxidativeImpact:
  'Slows chondrocyte aging and reduces inflammatory markers in joint capsules.',
  recovery:
  'Reduces post-training joint stiffness and improves range of motion.',
  metrics: [
  { label: 'Cartilage water', value: '75', unit: '%' },
  { label: 'Stiffness', value: '−21', unit: '%' }],

  color: 'gold'
},
{
  id: 'muscles',
  name: 'Muscles & Performance',
  bodySystem: 'Skeletal Muscle',
  x: 62,
  y: 56,
  tagline: 'ATP yield & contractile recovery',
  description:
  'Skeletal muscle is 76% water. A 2% drop in hydration cuts strength output by 10%. DDW improves mitochondrial efficiency and accelerates ATP regeneration.',
  hydrationImpact:
  'Maintains electrolyte gradients, enabling sustained force generation.',
  oxidativeImpact: 'Reduces post-exercise ROS spikes and DOMS severity.',
  recovery: 'Faster glycogen replenishment and lower next-day fatigue.',
  metrics: [
  { label: 'Strength loss / 2% dehydration', value: '−10', unit: '%' },
  { label: 'ATP regen', value: '+15', unit: '%' }],

  color: 'blue'
},
{
  id: 'nervous',
  name: 'Peripheral Nerves',
  bodySystem: 'Peripheral Nervous System',
  x: 35,
  y: 75,
  tagline: 'Signal velocity & proprioception',
  description:
  'Peripheral nerves carry signals at 120 m/s. Hydration determines axoplasm viscosity, ion-channel function, and signal propagation speed.',
  hydrationImpact:
  'Stabilizes nerve fiber conduction and reduces tingling episodes.',
  oxidativeImpact: 'Protects the myelin sheath from peroxidative damage.',
  recovery:
  'Faster reflex rebound and improved proprioception under fatigue.',
  metrics: [{ label: 'Signal velocity', value: '120', unit: 'm/s' }],
  color: 'green'
}];