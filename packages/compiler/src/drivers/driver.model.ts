export interface Driver {
  /**
   * Return true if the driver know how to handle this AST node.
   */
  typeMatch(type: string): boolean;
}
