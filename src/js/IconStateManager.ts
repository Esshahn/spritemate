import { dom } from "./helper";

/**
 * Utility class for managing icon states (fade and image swap)
 * Reduces repetitive if/else blocks throughout the codebase
 */
export class IconStateManager {
  /**
   * Toggles an icon's opacity based on a condition
   * @param selector - CSS selector for the icon element
   * @param condition - If true, icon is enabled (opacity 1), if false, disabled (opacity 0.33)
   */
  static toggleFade(selector: string, condition: boolean): void {
    if (condition) {
      dom.fade(selector, 0.33, 1); // from 0.33 to 1 (enable)
    } else {
      dom.fade(selector, 1, 0.33); // from 1 to 0.33 (disable)
    }
  }

  /**
   * Swaps an icon's image source based on a condition
   * @param selector - CSS selector for the icon element
   * @param condition - If true, uses highlighted version, if false, uses normal version
   * @param basePath - Base path for the icon (e.g., "ui/icon-preview-overlay")
   * @param highlightSuffix - Suffix for highlighted state (default: "-hi")
   * @param extension - File extension (default: ".png")
   */
  static toggleImage(
    selector: string,
    condition: boolean,
    basePath: string,
    highlightSuffix: string = "-hi",
    extension: string = ".png"
  ): void {
    if (condition) {
      dom.attr(selector, "src", `${basePath}${highlightSuffix}${extension}`);
    } else {
      dom.attr(selector, "src", `${basePath}${extension}`);
    }
  }

  /**
   * Inverted version of toggleFade - condition false means enabled
   * Useful for cases like "is_min_zoom" where true means the button should be disabled
   * @param selector - CSS selector for the icon element
   * @param condition - If true, icon is disabled (opacity 0.33), if false, enabled (opacity 1)
   */
  static toggleFadeInverted(selector: string, condition: boolean): void {
    if (condition) {
      dom.fade(selector, 1, 0.33); // from 1 to 0.33 (disable)
    } else {
      dom.fade(selector, 0.33, 1); // from 0.33 to 1 (enable)
    }
  }
}
