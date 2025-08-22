/**
 * It's one of the probable `value` types of a 'Communication Event' interface
 * (`V1Communication_Event`).
 *
 * @export
 * @interface V2BasePage_Error
 * @typedef {V2BasePage_Error}
 */
export interface V2BasePage_Error {
  /**
   * Page type which emits the event. A page which has children (child routes)
   * is a 'parent', and a page which is already child of a parent is 'child'.
   *
   * NOTE: If a child page is related to a CRUD operation (entity), then instead
   * of just mantining that it's a child, you can specifically define the page
   * type by its responsibility (i.e., what the page is going to present in its
   * UI). e.g., a page is 'all', if it's going to show a list of an entity.
   *
   * @type {('parent' | 'child' | 'all' | 'edit' | 'new' | 'one')}
   */
  page: 'parent' | 'child' | 'all' | 'edit' | 'new' | 'one';

  /**
   * Page template.
   *
   * NOTE: This property is optional, because some pages don't have a template.
   *
   * @type {?('classic' | 'aligator')}
   */
  pageTemplate?: 'classic' | 'aligator';

  /**
   * The 'feature' lib name that got initialized in the page which caused the
   * error.
   *
   * @type {string}
   */
  lib: string;

  /**
   * The 'feature' lib template.
   *
   * NOTE: This property is optional, because some libs don't have a template.
   *
   * @type {?('classic' | 'aligator')}
   */
  libTemplate?: 'classic' | 'aligator';

  /**
   * The 'feature' lib's error key/value. It's the error that the lib emits
   * (which in most of the times, it is caused by the 'data-access' lib that is
   * in the 'feature' lib).
   *
   * @type {{key: string; value: string;}}
   */
  error: { key: string; value: string };
}
