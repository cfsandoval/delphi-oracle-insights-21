
export interface LibraryItem {
  id: string;
  title: string;
  authors: string[];
  year: number;
  type: 'article' | 'book' | 'guide';
  abstract: string;
  keywords: string[];
  url?: string;
  doi?: string;
  language: 'es' | 'en';
}

export const libraryItems: LibraryItem[] = [
  {
    id: '1',
    title: 'The Delphi Method: An Experimental Study of Group Opinion',
    authors: ['Norman Dalkey', 'Olaf Helmer'],
    year: 1963,
    type: 'article',
    abstract: 'This seminal work introduces the Delphi method as a structured communication technique for achieving consensus among expert groups.',
    keywords: ['delphi method', 'group decision', 'consensus', 'forecasting'],
    doi: '10.7249/RM-5888-PR',
    language: 'en'
  },
  {
    id: '2',
    title: 'Método Delphi: Técnica de Investigación y Predicción Cualitativa',
    authors: ['María José Landeta'],
    year: 2006,
    type: 'book',
    abstract: 'Guía completa sobre la aplicación del método Delphi en investigación cualitativa, con enfoque en estudios territoriales.',
    keywords: ['método delphi', 'investigación cualitativa', 'predicción', 'estudios territoriales'],
    language: 'es'
  },
  {
    id: '3',
    title: 'Real-time Delphi: Efficient e-Government Using Modern Technology',
    authors: ['Theodore J. Gordon', 'Adam Pease'],
    year: 2006,
    type: 'article',
    abstract: 'Explores the adaptation of traditional Delphi to real-time environments using digital platforms.',
    keywords: ['real-time delphi', 'e-government', 'digital platforms', 'consensus building'],
    doi: '10.1016/j.techfore.2005.09.011',
    language: 'en'
  },
  {
    id: '4',
    title: 'Aplicación del Método Delphi en Estudios de Desarrollo Territorial',
    authors: ['Carlos Mataix', 'Ana Moreno'],
    year: 2018,
    type: 'guide',
    abstract: 'Guía práctica para la aplicación del método Delphi en estudios de desarrollo territorial y planificación regional.',
    keywords: ['desarrollo territorial', 'planificación regional', 'colombia', 'consenso expertos'],
    language: 'es'
  },
  {
    id: '5',
    title: 'Consensus Building in Environmental Policy: A Delphi Approach',
    authors: ['Jennifer Smith', 'Robert Johnson'],
    year: 2020,
    type: 'article',
    abstract: 'Application of Delphi methodology in environmental policy consensus building with territorial implications.',
    keywords: ['environmental policy', 'consensus building', 'territorial planning', 'sustainability'],
    doi: '10.1016/j.envpol.2020.115234',
    language: 'en'
  },
  {
    id: '6',
    title: 'El Método Delphi en la Planificación Territorial Colombiana',
    authors: ['Eduardo Ramírez', 'Sofía Gómez'],
    year: 2021,
    type: 'article',
    abstract: 'Análisis de la aplicación del método Delphi en procesos de planificación territorial en diferentes regiones de Colombia.',
    keywords: ['colombia', 'planificación territorial', 'consenso', 'políticas públicas'],
    language: 'es'
  }
];
