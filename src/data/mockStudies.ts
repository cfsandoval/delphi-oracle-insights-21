
import { Study } from "@/types/study";

export const mockStudies: Study[] = [
  {
    id: "1",
    title: {
      es: "Prioridades de Desarrollo Territorial - Región Caribe",
      en: "Territorial Development Priorities - Caribbean Region"
    },
    methodology: "traditional",
    status: "active",
    experts: 15,
    rounds: 3,
    currentRound: 2,
    consensus: 72,
    createdAt: "2024-01-15",
    description: {
      es: "Estudio Delphi para identificar prioridades de desarrollo sostenible en la región Caribe colombiana con expertos locales",
      en: "Delphi study to identify sustainable development priorities in the Colombian Caribbean region with local experts"
    }
  },
  {
    id: "2",
    title: {
      es: "Políticas de Salud Pública Post-COVID en Bogotá",
      en: "Post-COVID Public Health Policies in Bogotá"
    },
    methodology: "realtime",
    status: "active",
    experts: 22,
    rounds: 1,
    currentRound: 1,
    consensus: 68,
    createdAt: "2024-01-10",
    description: {
      es: "Consenso sobre estrategias de salud pública para Bogotá con participación de epidemiólogos y administradores de salud",
      en: "Consensus on public health strategies for Bogotá with participation of epidemiologists and health administrators"
    }
  },
  {
    id: "3",
    title: {
      es: "Estrategias de Paz Territorial en Municipios PDET",
      en: "Territorial Peace Strategies in PDET Municipalities"
    },
    methodology: "traditional",
    status: "completed",
    experts: 18,
    rounds: 4,
    currentRound: 4,
    consensus: 89,
    createdAt: "2023-12-01",
    description: {
      es: "Identificación de mejores prácticas para implementación de programas de desarrollo territorial en municipios PDET",
      en: "Identification of best practices for implementing territorial development programs in PDET municipalities"
    }
  },
  {
    id: "4",
    title: {
      es: "Innovación Educativa Rural - Departamento de Nariño",
      en: "Rural Educational Innovation - Nariño Department"
    },
    methodology: "realtime",
    status: "draft",
    experts: 0,
    rounds: 0,
    currentRound: 0,
    consensus: 0,
    createdAt: "2024-01-20",
    description: {
      es: "Exploración de metodologías innovadoras para educación en zonas rurales del departamento de Nariño",
      en: "Exploration of innovative methodologies for education in rural areas of Nariño department"
    }
  }
];
