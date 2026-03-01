export type InclusionType = 'bubble' | 'crack' | 'scratch';

export interface Inclusion {
  id: string;
  parent_id: string;
  name: string;
  radius: number;
  type: InclusionType;
}

export interface ValidationErrors {
  name?: string;
  radius?: string;
  type?: string;
}

export type EditableInclusion = Inclusion & {
  isEditing?: boolean;
  originalData?: Inclusion;
  errors?: ValidationErrors;
};