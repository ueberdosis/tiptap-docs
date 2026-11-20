/** Types for the parts of `iframe-resizer` 4 this app uses. The package has no types. */
declare module 'iframe-resizer' {
  export type IFrameResizerOptions = {
    /** `true`: scrollbars when the content is larger. `false`: no scrollbars. */
    scrolling?: boolean | 'omit';
    /** Called when the child page asks to close. Return `false` to keep the iframe. */
    onClose?: (iframeId: string) => boolean;
  };

  export type IFrameResizerElement = HTMLIFrameElement & {
    iFrameResizer?: { removeListeners: () => void };
  };

  /** Resizes `target` to the height of its content. Needs the child script in the iframe page. */
  export function iframeResize(
    options: IFrameResizerOptions,
    target: HTMLIFrameElement,
  ): IFrameResizerElement[];
}
