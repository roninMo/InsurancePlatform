import styles from './Tech.module.scss';


export type FrontendFrameworks = 'Angular' | 'React' | 'Vue' | '' ;
export type BackendFrameworks = '.Net' | 'Express' | 'Node' | 'Ruby';
export type FrontendTechs = '';
export type BackendTechs = '';
export type CloudServiceProviders = 'AWS' | 'Azure' | 'GCP';
export type AutomationTools = 'AWS CDK' |'Kubernetes' | 'Bamboo' | 'Docker';
export type AutomationKeywords = 'CI/CD Pipelines' | 'Azure Devops' | 'Atlassian Stack';

export type TechTypes = FrontendFrameworks | BackendFrameworks | FrontendTechs | BackendTechs | CloudServiceProviders | AutomationTools | AutomationKeywords; 
export interface TechProps {
  type: TechTypes;
  description: string;
  additionalStyles?: string;
}

export const Tech = ({ type, description, additionalStyles }: TechProps) => {

  return (
    <div className={`rowStart inline-flex ${additionalStyles}`}>
      
      <div>

      </div>
    </div>
  );
}
