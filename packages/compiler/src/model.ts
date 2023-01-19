export interface KitaeComponentTemplateLeaf {
  type: "text";
  content: string;
}

export interface KitaeComponentTemplate {
  type: string;
  className?: string;
  children?: KitaeComponentNode[];
  [k: string]: any;
}

export type KitaeComponentNode =
  | KitaeComponentTemplate
  | KitaeComponentTemplateLeaf;

export interface KitaeComponent {
  label: string;
  driver: string;
  template: KitaeComponentNode[];
}

export interface KitaeAST {
  pages: { id: string }[];
  refs: {
    [k: string]: KitaeComponent;
  };
}
