import { ccExpMaskConfig, ccMaskConfig, ccvMaskConfig, emailFilter, InputMask, MaskConfig, MaskOpts, numbersOnlyFilter, phoneMaskConfig, PolicyMaskConfig } from "./InputMask";
import { Filter_CHARS_ONLY, Filter_CHARS_NUMS_SPC } from "./RegExpFilters";
import { TextInputTypes } from '../../../Forms/Input/Input'



// #region CustomInputMask
/**
 * ### CustomInputMask
 * The CustomInputMask is an {@link InputMask} that has predefined data, with optional overrides to fit your inputMask's needs.
 * 
 * Each class has a specific {@link MaskOpts|Mask Config} for an {@link TextInputTypes|Input} type or for general use, with an 
 * optional `customFormat` that allows you to edit the **InputMask** while retaining it's logic and filter for that specific mask.
 * There's also an `overrides` param if you want to edit the {@link MaskOpts} directly for a specific **InputMask**.
 * 
 * * **Remarks:** Use the {@link create|**create()**} function to handle initialization.
 * 
 * ----
 * ### Usage:
 * ```ts
 * const inputMask = UseRef<PhoneMask>(PhoneMask.create("___-___-____"));
 * // Adjusts it's format. i.e. from "(___)-___-____" to "___-___-____".
 * ```
 */
export class CustomInputMask extends InputMask {
  /** The custom mask's configuration, predefined for each subclassed version. */
  protected static defaultConfig: MaskOpts = { filter: /(?!)/ };
  
  
  // #region Overloads (linking to parent doc refs doesn't work in typescript...)
  /**
   * ### CustomInputMask
   * The CustomInputMask is an {@link InputMask} that has predefined data, with option formatting overrides to fit your inputMask's needs.
   * 
   * Each class has a specific {@link MaskOpts|Mask Config} for an {@link TextInputTypes|Input} type, with an 
   * optional `customFormat` that allows you to edit the **InputMask** while retaining it's logic and filter for that specific mask.
   * 
   * * **Remarks:** Use the {@link create} function to handle initialization.
   * 
   * 
   * ----
   * ### Usage:
   * ```ts
   * // Create a ref for the inputMask, and initialize it's listeners in a useEffect, or when you attach the ref itself.
   * const inputMask = UseRef<PhoneMask>(PhoneMask.create());
   * 
   * // A way to change the InputMask's format. i.e from "(___)-___-____" to "___-___-____".
   * // const inputMask = UseRef<PhoneMask>(PhoneMask.create("___-___-____"));
   * 
   * // Or pass in explicit options to edit the filter or other mask configuration values.
   * // const inputMask = UseRef<PhoneMask(PhoneMask.create(customConfig));
   * 
   * // A unified ref function
   * const handleRef = (node: HTMLTextAreaElement | null) => {
   *   // Pass the input element to your inputMask
   *   if (inputMask.current && node) {
   *     inputMask.current.initEventListeners(node); // Initializes the mask logic
   *   }
   * }
   * 
   * 
   * // Finally, add it to the input (or just pass inputMask to the ref)
   *  <input type="text" ref={handleRef} />
   * 
   * // Entering a value of "1112223333"
   * // Outputs: "(111)-222-3333" 
   *  
   * ```
   * 
   * ---
   * ### InputMask - *{@link InputMask|ref()}*
   * This class allows you to add `filters` and `input masks` to your input. One caveat is that it attaches itself
   * to the **event listeners** of your input, so certain native behaviors are handled internally through here (undo/redo), while others are preserved.
   * 
   * Through **keydown**, **copy**, **paste**, and **cut** events, the InputMask captures the edits to the value, stores them in a raw value, and 
   * `filters` and/or `masks` them before directly editing the input value and calling it's respective **onChange**. This way
   * it handles mutating the data while invoking react's **rendering events**, as well as notifying libraries like **react-hook-forms** about updates.
   * 
   * ---
   * **Remarks**
   * * Subclassed versions of this handle initialization and can be used for specific inputs (i.e. PhoneMask "(___)-___-____")
   * * This class **only** invokes the `onChange` event **IF** it's a valid change to the mask, which includes: 
   *    1. If it's **valid text** that add's or removes from the `mask's format`. 
   *    2. If the text inserted wasn't **filtered** out from the `acceptedChars`.
   *    3. If you **pasted text** somewhere, and the masked input was re-evaluated entirely.
   *    4. The `inputType` is synthetic and recreated from each **keyed event**, and isn't passed to the actual event.
   * 
   */
  static create<T extends CustomInputMask>(customFormat: string): T;
    
  /**
   * ### CustomInputMask
   * The CustomInputMask is an {@link InputMask} that has predefined data, with option formatting overrides to fit your inputMask's needs.
   * 
   * Each class has a specific {@link MaskOpts|Mask Config} for an {@link TextInputTypes|Input} type, with an 
   * optional `customFormat` that allows you to edit the **InputMask** while retaining it's logic and filter for that specific mask.
   * 
   * * **Remarks:** Use the {@link create} function to handle initialization.
   * 
   * 
   * ----
   * ### Usage:
   * ```ts
   * // Create a ref for the inputMask, and initialize it's listeners in a useEffect, or when you attach the ref itself.
   * const inputMask = UseRef<PhoneMask>(PhoneMask.create());
   * 
   * // A way to change the InputMask's format. i.e from "(___)-___-____" to "___-___-____".
   * // const inputMask = UseRef<PhoneMask>(PhoneMask.create("___-___-____"));
   * 
   * // Or pass in explicit options to edit the filter or other mask configuration values.
   * // const inputMask = UseRef<PhoneMask(PhoneMask.create(customConfig));
   * 
   * // A unified ref function
   * const handleRef = (node: HTMLTextAreaElement | null) => {
   *   // Pass the input element to your inputMask
   *   if (inputMask.current && node) {
   *     inputMask.current.initEventListeners(node); // Initializes the mask logic
   *   }
   * }
   * 
   * 
   * // Finally, add it to the input (or just pass inputMask to the ref)
   *  <input type="text" ref={handleRef} />
   * 
   * // Entering a value of "1112223333"
   * // Outputs: "(111)-222-3333" 
   *  
   * ```
   * 
   * ---
   * ### InputMask - *{@link InputMask|ref()}*
   * This class allows you to add `filters` and `input masks` to your input. One caveat is that it attaches itself
   * to the **event listeners** of your input, so certain native behaviors are handled internally through here (undo/redo), while others are preserved.
   * 
   * Through **keydown**, **copy**, **paste**, and **cut** events, the InputMask captures the edits to the value, stores them in a raw value, and 
   * `filters` and/or `masks` them before directly editing the input value and calling it's respective **onChange**. This way
   * it handles mutating the data while invoking react's **rendering events**, as well as notifying libraries like **react-hook-forms** about updates.
   * 
   * ---
   * **Remarks**
   * * Subclassed versions of this handle initialization and can be used for specific inputs (i.e. PhoneMask "(___)-___-____")
   * * This class **only** invokes the `onChange` event **IF** it's a valid change to the mask, which includes: 
   *    1. If it's **valid text** that add's or removes from the `mask's format`. 
   *    2. If the text inserted wasn't **filtered** out from the `acceptedChars`.
   *    3. If you **pasted text** somewhere, and the masked input was re-evaluated entirely.
   *    4. The `inputType` is synthetic and recreated from each **keyed event**, and isn't passed to the actual event.
   * 
   */
  static create<T extends CustomInputMask>(overrides?: Partial<MaskOpts>): T;
  // #endregion
  
  
  static create<T extends CustomInputMask>(
    this: (typeof CustomInputMask) & (new (config: MaskOpts) => T),
    arg: Partial<MaskOpts> | string = {}
  ): T {
    let overrides: Partial<MaskOpts> = {};
    let customFormat: string = '';
    
    // * overload parameters
    if (typeof arg == "string") {
      customFormat = arg
    } else {
      overrides = arg;
    }
    
    // ? Initialize the static constructor - we're just using static params instead
    // const staticContext = this as unknown as {
    //   defaultConfig: MaskOpts, // {} defaultConfig in the class could have been set to static
    //   new (config: MaskOpts): T
    // };
    // return new staticContext(config);
    
    // * Add the overrides
    const config = {
      ...this.defaultConfig,
      ...overrides
    }
    
    // * If there was a custom format provided, use it.
    if (customFormat && config && config?.inputMask) {
      config.inputMask.mask = customFormat;
    }2  
    
    const Constructor = this; 
    return new Constructor(config) as T; // Constructor arg gotchas
  }
  
  /** Don't allow invocations on the parent constructor from custom classes. Use {@link create} instead */
  protected constructor(config: RegExp) {
    super(config);
  }
}


/** For handling the static construction of a custom mask. */ 
interface CustomInputMaskStatic<T> {
  defaultConfig: MaskOpts;
  new (config: MaskOpts): T;
}
// #endregion




//----------------------------------------------------------------//
// Custom Masks                                                   //
//----------------------------------------------------------------//
// #region Phone Masks
/**
 * ### PhoneMask
 * The PhoneMask is an {@link CustomInputMask|InputMask} that has predefined data, with option formatting overrides to fit your input mask's needs.
 * 
 * Each class has a specific {@link MaskOpts|Mask Config} for an {@link TextInputTypes|Input} type, with an 
 * `options` arg that allow you to edit the **InputMask** while retaining it's logic and filter for that specific mask.
 * 
 * * **Remarks:** Use the {@link create} function to handle initialization.
 * 
 * ----
 * ### Usage:
 * ```ts
 * const inputMask = UseRef<PhoneMask>(PhoneMask.create("___-___-____"));
 * // Adjusts it's format. i.e. from "(___)-___-____" to "___-___-____".
 * ```
 */
export class PhoneMask extends CustomInputMask {
  /** The phone mask's configuration, predefined for each subclassed version. */
  protected static override defaultConfig: MaskOpts = phoneMaskConfig;
}
// #endregion


// #region Email Filter
/**
 * ### EmailFilter
 * The EmailFilter is an {@link CustomInputMask|Filter} that filters out all unaccepted characters for an email's username.
 * 
 * Each class has a specific {@link MaskOpts|Mask Config} for an {@link TextInputTypes|Input} type, with an 
 * `options` arg that allow you to edit the configuration while retaining it's logic and filter for that specific mask/filter.
 * 
 * * **Remarks:** Use the {@link create} function to handle initialization.
 * 
 * ----
 * ### Usage:
 * ```ts
 * const inputMask = UseRef<EmailFilter>(EmailFilter.create());
 * // You can pass in additional options to change the filter.
 * ```
 */
export class EmailFilter extends CustomInputMask {
  /** The email's filter configuration, predefined for each subclassed version. */
  protected static override defaultConfig: MaskOpts = emailFilter;
}
// #endregion


// #region Credit Card Masks
/**
 * ### CCMask
 * The Credit Card Mask is an {@link CustomInputMask|InputMask} that has predefined data, with option formatting overrides to fit your input mask's needs.
 * 
 * Each class has a specific {@link MaskOpts|Mask Config} for an {@link TextInputTypes|Input} type, with an 
 * `options` arg that allow you to edit the **InputMask** while retaining it's logic and filter for that specific mask.
 * 
 * * **Remarks:** Use the {@link create} function to handle initialization.
 * 
 * ----
 * ### Usage:
 * ```ts
 * const inputMask = UseRef<CCMask>(CCMask.create()); 
 * // maskFormat: '____-____-____'
 * ```
 */
export class CCMask extends CustomInputMask {
  /** The credit card mask's configuration, predefined for each subclassed version. */
  protected static override defaultConfig: MaskOpts = ccMaskConfig;
}


/**
 * ### CCExpMask
 * The Credit Card Exp Date Mask is an {@link CustomInputMask|InputMask} that has predefined data, with option formatting overrides to fit your input mask's needs.
 * 
 * Each class has a specific {@link MaskOpts|Mask Config} for an {@link TextInputTypes|Input} type, with an 
 * `options` arg that allow you to edit the **InputMask** while retaining it's logic and filter for that specific mask.
 * 
 * * **Remarks:** Use the {@link create} function to handle initialization.
 * 
 * ----
 * ### Usage:
 * ```ts
 * const inputMask = UseRef<CCExpMask>(CCExpMask.create()); 
 * // maskFormat: '__/__'
 * ```
 */
export class CCExpMask extends CustomInputMask {
  /** The credit card's exp date mask configuration, predefined for each subclassed version. */
  protected static override defaultConfig: MaskOpts = ccExpMaskConfig;
}

/**
 * ### CCVMask
 * The CCV Mask is an {@link CustomInputMask|InputMask} that has predefined data, with option formatting overrides to fit your input mask's needs.
 * 
 * Each class has a specific {@link MaskOpts|Mask Config} for an {@link TextInputTypes|Input} type, with an 
 * `options` arg that allow you to edit the **InputMask** while retaining it's logic and filter for that specific mask.
 * 
 * * **Remarks:** Use the {@link create} function to handle initialization.
 * 
 * ----
 * ### Usage:
 * ```ts
 * const inputMask = UseRef<CCExpMask>(CCExpMask.create()); 
 * // maskFormat: '__/__'
 * ```
 */
export class CCVMask extends CustomInputMask {
  /** The credit card's exp date mask configuration, predefined for each subclassed version. */
  protected static override defaultConfig: MaskOpts = ccvMaskConfig;
}
// #endregion


// #region Policy Number Masks
/**
 * ### Policy
 * The Policy Number Mask is an {@link CustomInputMask|InputMask} that has predefined data, with option formatting overrides to fit your input mask's needs.
 * 
 * Each class has a specific {@link MaskOpts|Mask Config} for an {@link TextInputTypes|Input} type, with an 
 * `options` arg that allow you to edit the **InputMask** while retaining it's logic and filter for that specific mask.
 * 
 * * **Remarks:** Use the {@link create} function to handle initialization.
 * 
 * ----
 * ### Usage:
 * ```ts
 * const inputMask = UseRef<PolicyMask>(CCMask.create()); 
 * // maskFormat: '____-____-____'
 * ```
 */
export class PolicyMask extends CustomInputMask {
  /** The policy number mask's configuration, predefined for each subclassed version. */
  protected static override defaultConfig: MaskOpts = PolicyMaskConfig;
}


// #region Filter Only Masks
/**
 * ### NumbersOnly
 * The NumbersOnly is an {@link CustomInputMask|Filter} that filters out all unaccepted characters for an email's username.
 * 
 * Each class has a specific {@link MaskOpts|Mask Config} for an {@link TextInputTypes|Input} type, with an 
 * `options` arg that allow you to edit the configuration while retaining it's logic and filter for that specific mask/filter.
 * 
 * * **Remarks:** Use the {@link create} function to handle initialization.
 * 
 * ----
 * ### Usage:
 * ```ts
 * const inputMask = UseRef<NumbersOnly>(NumbersOnly.create());
 * // You can pass in additional options to change the filter.
 * ```
 */
export class NumbersOnly extends CustomInputMask {
  /** The filter's configuration, predefined for each subclassed version. */
  protected static override defaultConfig: MaskOpts = numbersOnlyFilter;
}

/**
 * ### CharsOnly
 * The CharsOnly is an {@link CustomInputMask|Filter} that filters out all unaccepted characters for an email's username.
 * 
 * Each class has a specific {@link MaskOpts|Mask Config} for an {@link TextInputTypes|Input} type, with an 
 * `options` arg that allow you to edit the configuration while retaining it's logic and filter for that specific mask/filter.
 * 
 * * **Remarks:** Use the {@link create} function to handle initialization.
 * 
 * ----
 * ### Usage:
 * ```ts
 * const inputMask = UseRef<CharsOnly>(CharsOnly.create());
 * // You can pass in additional options to change the filter.
 * ```
 */
export class CharsOnly extends CustomInputMask {
  /** The filter's configuration, predefined for each subclassed version. */
  protected static override defaultConfig: MaskOpts = {
    filter: Filter_CHARS_ONLY
  };
}

/**
 * ### CharsNumsSpc
 * The CharsNumsSpc is an {@link CustomInputMask|Filter} that filters out all unaccepted characters for an email's username.
 * 
 * Each class has a specific {@link MaskOpts|Mask Config} for an {@link TextInputTypes|Input} type, with an 
 * `options` arg that allow you to edit the configuration while retaining it's logic and filter for that specific mask/filter.
 * 
 * * **Remarks:** Use the {@link create} function to handle initialization.
 * 
 * ----
 * ### Usage:
 * ```ts
 * const inputMask = UseRef<CharsNumsSpc>(CharsNumsSpc.create());
 * // You can pass in additional options to change the filter.
 * ```
 */
export class CharsNumsSpc extends CustomInputMask {
  /** The filter's configuration, predefined for each subclassed version. */
  protected static override defaultConfig: MaskOpts = {
    filter: Filter_CHARS_NUMS_SPC
  };
}
// #endregion
