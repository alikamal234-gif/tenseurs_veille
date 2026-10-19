export type SlideId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface LearningSection {
  id: string;
  title: string;
  slideIds: SlideId[];
  description: string;
}

export interface CodeLineExplanation {
  lineNumber: number;
  code: string;
  explanation: string;
  affectedVisualComponent?: string;
  isKeyLine?: boolean;
}

export interface SlideCode {
  pythonCode: string;
  language: string;
  colabTitle: string;
  lines: CodeLineExplanation[];
  expectedOutput: string;
  whyUseful: string;
  commonPitfall: string;
}

export interface KnowledgeCheckItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SlideMetadata {
  id: SlideId;
  numberString: string; // e.g. "01"
  sectionId: string;
  title: string;
  shortTitle: string;
  objective: string;
  definitions: Array<{ term: string; explanation: string; mathNotation?: string }>;
  explanationFrench: string[];
  keyTakeaway: string[];
  code: SlideCode;
  miniQuiz?: KnowledgeCheckItem;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  shortDefinition: string;
  fullDefinition: string;
  category: 'Tensor' | 'Image' | 'Pipeline' | 'Keras/Model' | 'Optimization';
  mathNotation?: string;
  pythonExample?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
}
