import { DOCUMENT } from '@angular/common';
import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class V1HtmlEditorService {
  private _rendererFactory = inject(RendererFactory2);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Static                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Let's insert some content in the html, by manipulating the DOM directly.
   *
   * NOTE: This function works for texts or styles, but not for scripts.
   *
   * NOTE: If `placeholder = 'HEAD'` (default value), then `content` will be
   * added right before closing the head tag.
   *
   * @static
   * @param {string} content
   * @param {string} [placeholder='HEAD']
   */
  static insertContent(content: string, placeholder = 'HEAD') {
    // First things first! Check if we are in a server-side rendering
    // environment. we continue, ONLY IF we are not in SSR env.
    if (typeof document === 'undefined') {
      console.error(
        '@html-editor.service/insertContent: You are running in a server-side rendering environment, and you cannot manipulate html directly.',
      );
      return;
    }

    // Create a temporary div to hold the new content in it.
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const tempDivLength = tempDiv.children.length;

    // Helper function to set the content in the body.
    const setInBody = () => {
      // Find the target element.
      const targetElement = document.querySelector(placeholder);

      // Write an error in the console if the placeholder element was not found
      // and simply return.
      if (!targetElement) {
        console.error(
          '@html-editor.service/insertContent: Placeholder was not found!',
        );
        return;
      }

      // Let's add the content right after the placeholder, and remove the
      // placehold itself after that.
      for (let i = tempDivLength; i > 0; i--) {
        const tempDivChild = tempDiv.children[i - 1];
        targetElement.insertAdjacentElement('afterend', tempDivChild);
      }
      targetElement.remove();
    };

    // Helper function to set the content in the head.
    const setInHead = () => {
      // Let's add the content in the document header.
      for (let i = 0; i < tempDivLength; i++) {
        const tempDivChild = tempDiv.children[0];
        document.head.appendChild(tempDivChild);
      }
    };

    // Let's decide where to add the content.
    if (placeholder === 'HEAD') setInHead();
    else setInBody();
  }

  /**
   * Let's insert a script in the html, by manipulating the DOM directly.
   *
   * NOTE: `content` will be added right before closing the head/body tag.
   * NOTE: `isModule` will be useful only if the content is NOT a URL.
   *
   * @static
   * @param {string} content
   * @param {boolean} [isModule=false]
   */
  static insertScript(content: string, isModule = false, inHead = true) {
    // First things first! Check if we are in a server-side rendering environment.
    if (typeof document === 'undefined') {
      console.error(
        '@html-editor.service/insertScript: You are running in a server-side rendering environment, and you cannot manipulate html directly.',
      );
      return;
    }

    // Create a new script element.
    const script = document.createElement('script');
    if (isModule) script.type = 'module';

    // Add the script attributes. If the content is a URL, we add the src attribute.
    // If it's not, we add the content as an inline script.
    if (content.startsWith('https://')) {
      script.async = true;
      script.src = content;
    } else {
      script.innerHTML = content;
    }

    // Append the script.
    if (inHead) document.head.appendChild(script);
    else document.body.appendChild(script);
  }

  /**
   * Let's edit the title of the page.
   *
   * @static
   * @param {string} title
   */
  static editTitle(title: string) {
    // First things first! Check if we are in a server-side rendering
    // environment. we continue, ONLY IF we are not in SSR env.
    if (typeof document === 'undefined') {
      console.error(
        '@html-editor.service/editTitle: You are running in a server-side rendering environment, and you cannot manipulate html directly.',
      );
      return;
    }

    // Set the title
    document.title = title;
  }
}
