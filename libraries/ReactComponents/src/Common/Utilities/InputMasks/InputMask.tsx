import { ChangeEvent, FormEvent, RefObject } from "react";
import { Filter_CHARS_NUMS, Filter_CHARS_NUMS_SPC, Filter_CHARS_ONLY, Filter_Email_CHARS, Filter_NUMS_ONLY, Validate_EMAIL, Validate_PASS_HS } from "./RegExpFilters";



/** The configuration to build the mask part of an {@link InputMask} */
export type MaskConfig = {
  /** 
   * An input mask that uses underscores to represent wildcard characters that are filled from the user's input. 
   * 
   * ---- 
   * **Example**  
   * ```ts
   * const phoneMask = " ( ___ ) - ___ - ____ ";
   * ```
  */
  mask: string;
  
  /** The mask's wildcard character. This is used for handling custom masks. If left undefined, the default value is "_". */
  maskWildCardCharacter?: string;
  
  /** Whether we should additionally filter out any non-wildcard characters this mask uses from the user's inputted text. */
  filterNonWildcardsFromInput?: boolean;
  
  /** Whether to use the mask's template as the input's placeholder. */
  useMaskAsPlaceholder?: boolean;
  
  /** Keeps the mask visible even when it's empty. */
  keepMaskVisibleWhenEmpty?: boolean;
}


/** For subClassing the {@link InputMask} and safely passing the props to components. */
export type MaskOpts = {
  /** The configuration for creating an `InputMask`. @note pass this in as a stable reference to prevent rerenders. */
  inputMask?: MaskConfig;
  
  /** 
   * A RegExp expression designed to `filter` the accepted characters for the input. 
   * 
   * ---- 
   * **Usages**  
   * ```ts
   * const numbersOnly = /[^\d]/g; 
   * const charsNumsSpecialChars = /^[A-Za-z0-9\s!@#$%^&*()_+=\-[\]{}|;:'",.<>/?`~]+$/;
   * ```
  */
  filter?: RegExp;
  
  // Additional props added here through subclasses
}

/** For components that want to use a templated ***{@link InputMask|InputMask Class}*** with their props easily. */
export type TMaskClass<TMask extends InputMask, TMO extends MaskOpts> = { 
  MaskClass?: { 
    new (config: TMO): TMask; 
    create(options: TMO): TMask; 
  };
};


//----------------------------------------//
// Prebuilt Mask Configurations           //
//----------------------------------------//
export const phoneMaskConfig: MaskOpts = {
  filter: Filter_NUMS_ONLY,
  inputMask: {
    mask: '(___)-___-____',
    maskWildCardCharacter: '_',
    useMaskAsPlaceholder: true,
    // filterNonWildcardsFromInput: false
  },
  
}
export const ccMaskConfig: MaskOpts = {
  filter: Filter_NUMS_ONLY,
  inputMask: {
    mask: '____-____-____-____',
    maskWildCardCharacter: '_',
    useMaskAsPlaceholder: true,
    // filterNonWildcardsFromInput: false
  },
}
export const ccExpMaskConfig: MaskOpts = {
  filter: Filter_NUMS_ONLY,
  inputMask: {
    mask: '__/__',
    maskWildCardCharacter: '_',
    useMaskAsPlaceholder: true,
    keepMaskVisibleWhenEmpty: true,
    filterNonWildcardsFromInput: true
  },
}
export const ccvMaskConfig: MaskOpts = {
  filter: Filter_NUMS_ONLY,
  inputMask: {
    mask: '___',
    maskWildCardCharacter: '_',
    useMaskAsPlaceholder: true,
    keepMaskVisibleWhenEmpty: true,
    filterNonWildcardsFromInput: true
  },
}
export const PolicyMaskConfig: MaskOpts = {
  filter: Filter_NUMS_ONLY,
  inputMask: {
    mask: '__-________',
    maskWildCardCharacter: '_',
    useMaskAsPlaceholder: true,
  },
}

// Filter masks
export const emailFilter: MaskOpts = {
  filter: Filter_Email_CHARS
}
export const passwordFilter: MaskOpts = {
  filter: Validate_PASS_HS
}
export const numbersOnlyFilter: MaskOpts = {
  filter: Filter_NUMS_ONLY
}
export const charsOnlyFilter: MaskOpts = {
  filter: Filter_CHARS_ONLY
}
export const charsNumsSpcFilter: MaskOpts = {
  filter: Filter_CHARS_NUMS_SPC
}


/** The default wildcard character for this project's {@link InputMask} class. */
export const DEFAULT_INPUTMASK_WILDCARD = "_";

/** The metadata returned from the InputMask notifying you of what we did with the onChange event. */
export type MaskEventHandle = string | false;

/** The Input's Native Event classified inputTypes. */
export type InputActionType = 
| 'insertText' | 'insertCompositionText' | 'insertFromPaste' 
| 'deleteContentBackward' | 'deleteContentForward' | 'deleteByCut'
| 'historyUndo' | 'historyRedo' | 'insertReplacementText' | 'deleteReplacementText' | 'undefined';


/**
 * ### **InputMask**
 * This class allows you to add `filters` and `input masks` to your input. One caveat is that it attaches itself
 * to the **event listeners** of your input, so certain native behaviors are handled internally through here (undo/redo), while others are preserved.
 * 
 * Through **keydown**, **copy**, **paste**, and **cut** events, the InputMask captures the edits to the value, stores them in a raw value, and 
 * `filters` and/or `masks` them before directly editing the input value and calling it's respective **onChange**. This way
 * it handles mutating the data while invoking react's **rendering events**, as well as notifying libraries like **react-hook-forms** about updates.
 * 
 * ----
 * **Remarks**
 * * Subclassed versions of this handle initialization and can be used for specific inputs (i.e. PhoneMask "(___)-___-____")
 * * This class **only** invokes the `onChange` event **IF** it's a valid change to the mask, which includes: 
 *    1. If it's **valid text** that add's or removes from the `mask's format`. 
 *    2. If the text inserted wasn't **filtered** out from the `acceptedChars`.
 *    3. If you **pasted text** somewhere, and the masked input was re-evaluated entirely.
 *    4. The `inputType` is synthetic and recreated from each **keyed event**, and isn't passed to the actual event.
 * 
 * ----
 * #### Initialization: 
 * ```ts
 * // Create a ref for the inputMask, and initialize it in a useEffect, or when you attach the ref itself.
 * const numbersOnly: RegExp = /[^\d]/g; 
 * const maskConfig: MaskConfig = {
 *   mask: "(___)-___-____",
 *   maskWildCardCharacter: "_",
 *   filterNonWildcardsFromInput: true
 * }; 
 * 
 * // unified ref function
 * const inputMask = UseRef<InputMask>(new InputMask(maskConfig, filter)); // or InputMask.create(maskConfig, filter) for compatibility w/subclasses 
 * const handleRef = (node: HTMLTextAreaElement | null) => {
 *   // Pass the input element to your inputMask
 *   if (inputMask.current && node) {
 *     inputMask.current.initEventListeners(node); // Initializes the mask logic
 *   }
 * }
 * 
 * // Finally, add it to the input
 *  <input type="text" ref={handleRef} />
 * 
 * // Entering a value of "1112223333"
 * // Outputs: "(111)-222-3333" 
 *  
 * ```
 * 
 * ----
 * #### InputMask types
 *  * **Filter Only**: `InputMask(filter)`
 *  * **Mask Only**: `InputMask(maskConfig)`
 *  * **Mask + Filter**: `InputMask(maskConfig, filter)`
 * &nbsp;
 */
export class InputMask {
  // * Filter and mask
  /** 
   * A regExp expression designed to filter the accepted characters for the input. There are two function that go alongside the `InputMask's` filter:
   * 1. {@link filterExp()}: Is the get function for the filter's **RegExp**. Will return undefined if you're not using a filter.
   * 2. {@link filter()}: Is the function that handles filtering text from a provided value.
  */
  protected _filter: RegExp | undefined;
  
  /** 
   * An input mask that uses wildcard characters to defined what's filled from the user's input. 
   * 
   * **Note:** Do not access this directly, call **{@link mask()}** to retrieve the mask.
   */
  protected _mask: string | undefined;
  
  /** 
   * The mask's wildcard character. Must be defined to determine where the wildcards are when evaluating the mask. 
   * 
   * **Note:** Do not access this directly, call **{@link wildcard()}** to retrieve this mask's wildcard character.
   */
  protected _maskWildcardCharacter: string | undefined;
  
  /** 
   * Whether we should additionally filter out any non-wildcard characters this mask uses from the user's inputted text. 
   * 
   * **Note:** Do not access this directly, call **{@link shouldFilterMaskChars()}** to check if we're also filtering the mask's non-wildcard characters.
   */
  protected _maskFilterChars: boolean | undefined;
  
  /** 
   * The mask's unique non-wildcard characters. If we're filtering them out from the input, they're done manually. 
   * 
   * **Note:** Do not access this directly, call **{@link cachedNWcChars()}** to retrieve the cached non-wildcard characters for this mask.
   */
  protected _maskCachedNWChars: string[] | undefined;
  
  /** Whether the input should use the mask's template as the placeholder. */
  protected _useMaskAsPlaceholder: boolean | undefined;
  
  /** Keeps the mask visible even when it's empty. */
  protected _keepMaskVisibleWhenEmpty: boolean | undefined;
  
  // * Cached values
  /** The raw input value without the mask. @note this still applies the filter. */
  protected rawInputValue: string;
  
  /** The cached input value after applying the mask. */
  protected maskedInputValue: string;
  
  /** The edit history for this input mask. We edit the input directly, which always resets the history, so we keep track of it in {@link updateState()} */
  protected history: InputMaskHistory;
  
  // * Capturing the type of input actions we're retrieving from the user
  protected listenerInputType: InputActionType | undefined;
  protected inputRef: HTMLInputElement | HTMLTextAreaElement | undefined;
  protected addedEventListeners: boolean = false;
  
  
  
  
  //----------------------------------------------------------------------------//
  // Constructor Overloads                                                      //
  //----------------------------------------------------------------------------//
  // #region Constructors
  /**
   * ### **InputMask** - Filter Only
   * This class allows you to add `filters` and `input masking` to your input using it's **onBeforeInput()** event.
   * 
   * ----
   * #### Initialization
   * ```ts
   * const numbersOnly: RegExp = /[^\d]/g; 
   * const inputFilter = new InputMask(numbersOnly);
   * 
   * ```
   * * **note:** You need to call {@link evaluate()} in the input's onBeforeInput() event.
   * 
   * ----
   * #### Params
   * @param filter        A **RegExp** designed for filtering certain text from a string.
   */
  constructor(filter: RegExp); 
  
  
  /**
   * ### **InputMask** - Mask Only
   * This class allows you to add `filters` and `input masking` to your input using it's **onBeforeInput()** event.
   * 
   * ----
   * #### Initialization
   * ```ts
   * const maskConfig: MaskConfig = {
   *   mask: "(___)-___-____",
   *   maskWildCardCharacter: "_",
   *   filterNonWildcardsFromInput: true
   * }; 
   * const inputMask = new InputMask(maskConfig);
   * 
   * ```
   * * **note:** You need to call {@link evaluate()} in the input's onBeforeInput() event.
   * 
   * ----
   * #### Params
   * @param maskConfig    The configuration for building the inputMask
   */
  constructor(maskConfig: MaskConfig); 
  
  
  /**
   * ### **InputMask** - Mask Only
   * This class allows you to add `filters` and `input masking` to your input using it's **onBeforeInput()** event.
   * 
   * ----
   * #### Initialization
   * ```ts
   * const numbersOnly: RegExp = /[^\d]/g; 
   * const maskConfig: MaskConfig = {
   *   mask: "(___)-___-____",
   *   maskWildCardCharacter: "_",
   *   filterNonWildcardsFromInput: true
   * }; 
   * const inputMask = new InputMask(maskConfig, filter);
   * 
   * ```
   * * **note:** You need to call {@link evaluate()} in the input's onBeforeInput() event.
   * 
   * ----
   * #### Params
   * @param maskConfig    The configuration for building the inputMask
   * @param filter        A **RegExp** designed for filtering certain text from a string.
   */
  constructor(maskConfig: MaskConfig, filter: RegExp); 
  
  
  /**
   * ### **InputMask** - Component Initializer
   * This class allows you to add `filters` and `input masking` to your input using it's **onBeforeInput()** event.
   * 
   * **note** This allows you to initialize subclassed `InputMasks` easily through other components.
   * 
   * ----
   * #### Initialization
   * ```ts
   * const numbersOnly: RegExp = /[^\d]/g; 
   * const maskConfig: MaskConfig = {
   *   mask: "(___)-___-____",
   *   maskWildCardCharacter: "_",
   *   filterNonWildcardsFromInput: true
   * }; 
   * 
   * const options: InputMaskOptions = {
   *   inputMask: {   // <-- InputMaskConfig
   *     mask: "(___)-___-____",
   *     maskWildCardCharacter: "_",
   *     filterNonWildcardsFromInput: true
   *   },
   *   filter: /[^\d]/g     // <-- numbers only regExp
   * };
   * const inputMask = new InputMask(maskConfig, filter);
   * 
   * ```
   * * **note:** You need to call {@link evaluate()} in the input's onBeforeInput() event.
   * 
   * ----
   * #### Params
   * @param maskConfig    The configuration for building the inputMask
   * @param filter        A **RegExp** designed for filtering certain text from a string.
   */
  constructor(options: MaskOpts); 
  
  
  
  //----------------------------------------------------------------------------//
  // Implementation                                                             //
  //----------------------------------------------------------------------------//
  constructor(
    arg1: RegExp | MaskConfig | MaskOpts,
    arg2?: RegExp
  ) {
    let filter: RegExp | undefined;
    let config: Partial<MaskConfig> | undefined = {};
    let options: Partial<MaskOpts> = {};
    
    // -> constructor(filter)
    if (arg1 instanceof RegExp) {
      filter = arg1;
    } 
    
    // ? Mask or filter
    else {
      if (arg2 === undefined) {
        const maskOrOpts = arg1 || {};
        
        // -> constructor(maskConfig)
        if ('mask' in maskOrOpts) config = maskOrOpts;
        
        // -> constructor(options)
        else {
          options = maskOrOpts;
          filter = options?.filter;
          config = options?.inputMask;
        }
      }
      
      // ? constructor(maskConfig, filter)
      if (arg2 instanceof RegExp) {
        filter = arg2;
      }
    }
    
    
    // -> Initialize the base values
    if (filter) this._filter = filter;
    if (config) {
      this.setMask(config as MaskConfig);
    }
    
    this.addedEventListeners = false;
    this.rawInputValue = '';
    this.maskedInputValue = '';
    this.history = new InputMaskHistory();
  }
  
  
  /** 
   * For compatibility purposes, this class was created so we could handle constructing subclasses and the default with the same function.  
   * 
   * ---
   * @see {@link InputMask|constructors}
  */
  static create<T extends InputMask>(
    this: (typeof InputMask) & (new (config: MaskOpts) => T),
    options: MaskOpts = {}
  ): T {
    return new this(options) as T;
  }
  // #endregion
  
  
  
  
  /**
   * ### InputMask::evaluate( `onBeforeInputEvent` )
   * Evaluates an input's new value from the onBeforeInput event using 
   * the native event's state and the previous value for reference.
   * 
   * ----
   * **Remarks**
   * * This uses onBeforeInput to override the default onChangeEvent logic, and pass the masked input as the value.
   * * This **only** invokes the `onChange` event **IF** it's a valid change to the mask, which includes: 
   *    1. If it's valid text that add's or removes from the `mask's format`. 
   *    2. If the text inserted wasn't filtered out from the `acceptedChars`.
   *    3. If you `pasted text` somewhere, and the masked input was re-evaluated entirely.
   *    4. If the input passed in wasn't activated from a native event's `inputType`, we will prevent the event from occurring.
   *   
   * ----
   * #### Example
   * ```ts
   * // During the onBeforeInput event's function logic: 
   * const handleOnBeforeInput = (event: FormEvent<HTMLInputElement>) => {
   *    // other logic here
   * 
   *    const currentValue = getCurrentValue(); 
   *    const handle = inputMask.evaluate(currentValue, event); 
   * 
   *    console.log(handle);
   *    // { invokedOnChange: 'newMaskedValue' }
   *    // !if invokedOnChange is defined, evaluate() manually called onChange with the new value.
   * }
   * 
   * // Then the onChange event is triggered
   * const handleOnChange = (event: FormEvent<HTMLInputElement>) => {
   *    // Pass the event to internal bindings like react-hook-forms, 
   *    rhfBindings.onChange(event); // register(name).onChange;
   *    setValue(event.target.value); // or use state with the updated masked value
   * }
   * 
   * ```
   * 
   * ----
   * @param event           The onBeforeInput or changeEvent that's tied to the input 
   * 
   * @returns An object that returns whether we canceled the onBeforeInput via `preventDefault`, and if we invoked the `onChange` manually.
   */
  public evaluate(e: Event, listenerActionType: InputActionType): MaskEventHandle {
    if (!e) return false; // ! the event was invalid
    if (!this.inputRef) return false; // ! we don't have a reference to the input we're masking
    
    // ? Extract the event's information based on the input type
    const input = this.inputRef;
    const inputName = input.name;
    const { 
      actionType, 
      insertedText, 
      event 
    } = this.handleUserInputEvent(listenerActionType, e as any);
    
    // Retrieve the changed input value from the native 
    const cursorStart = input.selectionStart ?? 0; // cursor location
    const cursorEnd = input.selectionEnd ?? 0; // highlighted?
    let newCursorLocation = cursorStart;
    
    // Cached refs
    const prevRawValue = this.rawInputValue; // Right now these are technically the "current"
    const prevMaskedValue = this.maskedInputValue; // Right now these are technically the "current"
    let newRawValue = prevRawValue;
    let newMaskValue = prevMaskedValue;
    let filteredInsert = insertedText;
    
    // * logging
    console.log(`\n\nMaskEval::Evaluating and updating input from user event(${actionType}), 
      maskData: `, { inputName, inputValue: this?.inputRef?.value, mask: this.mask, filter: this.filterExp, event },
      `\n native event data: `, { actionType, insertedText, windowsOrMacCtrlKeyPressed: (e as any)?.ctrlKey || (e as any)?.metaKey, inputName: input },
      `\n current data: `, { currentRawValue: prevRawValue, currentMaskedValue: prevMaskedValue, insertedText, history: this.history },
      `\n cursor: `, { cursor: this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue, rawVal: prevRawValue }), cursorStart, cursorEnd, },
    );
    
    
    
    
    // #region - User typed or pasted some text
    // {} The user typed or pasted some text
    if ( actionType == 'insertText' 
      || actionType == 'insertCompositionText'
      || actionType == 'insertFromPaste'
    ) {
      let addedText = insertedText;
      
      // ? If we're using a filter
      if (this.isFilterEnabled()) {
        filteredInsert = this.filter(insertedText);
        
        if (filteredInsert) addedText = filteredInsert;
        else { // <- Early out, there's no valid text to add
          // this.updateState(prevRawValue, prevMaskedValue, cursorStart, cursorEnd); // don't update for non edits
          this.handleNativeEventLogic(undefined, prevRawValue); // cancel the events
          console.log(`Cancelled MaskEval::${actionType}: The added text was filtered out, aborting the onChange event. data: `, { insertedText, filteredInsert, filter: this.filterExp, inputName });
          return false; // input left as-is
        }
        
        // ? Filter Only - finish the calc here
        if (!this.isMaskEnabled()) {
          // Calc the new raw value
          newRawValue = this.addToRawValue(addedText, prevRawValue, cursorStart, cursorEnd);
          newCursorLocation = this.getNewRawCursorLocation(cursorStart, cursorEnd, addedText.length);
          
          // -> Successfully filtered the text for single/multi insert and paste inputs        
          this.updateState(newRawValue, newMaskValue, newCursorLocation, newCursorLocation); // update internal state tracking
          this.handleNativeEventLogic(newRawValue, newRawValue); // call the onChange w/filteredInput
          this.updateCursorPosition(newCursorLocation, newCursorLocation, newRawValue, input); // after the added text
          
          console.log(`Completed MaskEval::${actionType}: Filtered the input for single/multi insert, and paste actions. Event data: `, 
            { value: this.logCursorPos(newCursorLocation, newCursorLocation, { rawVal: newRawValue }), 
              newCursorLocation, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
          );
          console.log(`cursor history () data:`, 
            `\nprevRaw:   `, { cursor: this.logRawCursorPos(cursorStart, cursorEnd, prevRawValue) },
            `\nnewRaw:    `, { cursor: this.logRawCursorPos(newCursorLocation, newCursorLocation, newRawValue) },
          );
          return newRawValue;
        }
      }
      
      
      // ? Mask Only - Create the masked input, and update the input
      if (this.isMaskEnabled()) 
        {
        // Calc the new raw value
        const { rawCursorStart, rawCursorEnd } = this.getRawCursorFromMasked(cursorStart, cursorEnd, prevMaskedValue);
        newRawValue = this.addToRawValue(addedText, prevRawValue, rawCursorStart, rawCursorEnd);
        newCursorLocation = this.getNewRawCursorLocation(rawCursorStart, rawCursorEnd, addedText.length);
        const { maskedCursorStart, maskedCursorEnd } = this.findMaskedCursorLocations(newCursorLocation, newCursorLocation);
        
        // -> Successfully recreated the mask for single/multi insert and paste input events
        newMaskValue = this.buildInputMask(newRawValue);
        this.updateState(newRawValue, newMaskValue, maskedCursorStart, maskedCursorEnd); // update internal state tracking
        this.handleNativeEventLogic(newMaskValue, newRawValue); // call the onChange w/maskInput
        this.updateCursorPosition(maskedCursorStart, maskedCursorEnd, newMaskValue, input); // after the added text
        
        console.log(`Completed MaskEval::${actionType}: Recreated the mask for the single/multi insert, and paste actions. Event data: `, 
          { value: this.logCursorPos(maskedCursorStart, maskedCursorEnd, { maskedVal: newMaskValue }), 
            start: maskedCursorStart, end: maskedCursorEnd, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
        );
        console.log(`cursor history () data:`, 
          `\nprevRaw:   `, { cursor: this.logRawCursorPos(rawCursorStart, rawCursorEnd, prevRawValue) },
          `\nnewRaw:    `, { cursor: this.logRawCursorPos(newCursorLocation, newCursorLocation, newRawValue) },
          `\nprevMasked:`, { cursor: this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue, rawVal: prevRawValue }) },
          `\nnewMasked: `, { cursor: this.logCursorPos(maskedCursorStart, maskedCursorEnd, { maskedVal: newMaskValue, rawVal: newRawValue }) },
        );
        return newMaskValue;
      }
    }
    // #endregion
    
    
    // #region - User pressed deleted via backspace, cursor single/multi selected deletion, or ctrl + x (Cut)
    // {} The user pressed deleted via backspace, cursor single/multi selected deletion, or ctrl + x (Cut)
    if (
      actionType == 'deleteContentBackward' || 
      actionType == 'deleteContentForward' || 
      actionType == 'deleteByCut'
    ) {
      const isHighlightedSelection = cursorStart != cursorEnd;
      let windowsOrMacCtrlKeyPressed: boolean = false;
      if (actionType != 'deleteByCut' && event) windowsOrMacCtrlKeyPressed = event.ctrlKey || event.metaKey;
      
      // ? Delete by cut shouldn't evaluate if they didn't make a selection.
      if (actionType == 'deleteByCut' && cursorStart == cursorEnd) {
        this.updateState(prevRawValue, prevMaskedValue, cursorStart, cursorEnd); // update internal state tracking
        this.handleNativeEventLogic(undefined, prevRawValue); // cancel the events
        this.updateCursorPosition(cursorStart, cursorEnd, prevRawValue, input);
        console.log(`Cancelled MaskEval::${actionType}: The user inputted a cut event without a selection: `, { inputName });
        return false;
      }
      
      
      // ? Filter Only - finish the calc here
      if (this.isFilterEnabled() && !this.isMaskEnabled()) {
        // {} Default Logic
        // * Normal backspace/delete - single character  OR  highlighted text deletions  AND  nulled ctrl+backspaces from a highlighted selections
        if (!windowsOrMacCtrlKeyPressed || isHighlightedSelection) { 
          const removedChars = this.getRemovedCharacterCount(cursorStart, cursorEnd);
          newRawValue = this.removeFromRawValue(prevRawValue, cursorStart, cursorEnd, removedChars, actionType);
          newCursorLocation = this.getNewRawCursorLocation(cursorStart, cursorEnd, removedChars, actionType);
        }
        // {} Ctrl + Backspace/Delete logic on an raw value
        // * This is the same logic as the native event's handling
        else { // windowsOrMacCtrlKeyPressed && !isHighlightedSelection
          newRawValue = this.ctrlRemoveFromRawValue(prevRawValue, cursorStart, actionType as any);
          const removedChars = prevRawValue.length - newRawValue.length;
          newCursorLocation = actionType == 'deleteContentBackward' ? cursorStart - removedChars : cursorStart;
          console.log(`Ctrl + (${actionType}): FilterOnly: `, { newValue: this.logRawCursorPos(cursorStart, cursorStart, newRawValue), prevRawValue, removedChars, cursorStart },);
        }
        
        // -> Successfully recreated the input value (filter only) for ctrl + delete events
        this.updateState(newRawValue, newMaskValue, newCursorLocation, newCursorLocation); // update internal state tracking
        this.handleNativeEventLogic(newRawValue, newRawValue); // call the onChange w/maskInput
        this.updateCursorPosition(newCursorLocation, newCursorLocation, newRawValue, input); 
        console.log(`Completed MaskEval::${actionType}: Deleted the content for the filtered input. Data: `, 
          { value: this.logCursorPos(newCursorLocation, newCursorLocation, { rawVal: newRawValue }), 
            newCursorLocation, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
        );
        console.log(`cursor history () data:`, 
          `\nprevRaw:   `, { cursor: this.logRawCursorPos(cursorStart, cursorEnd, prevRawValue) },
          `\nnewRaw:    `, { cursor: this.logRawCursorPos(newCursorLocation, newCursorLocation, newRawValue) },
        );
        return newRawValue;
      }
      
      
      // ? Mask Only - Calc the new raw value
      if (this.isMaskEnabled()) {
        let shouldCallOnChange: boolean = true;
        const { rawCursorStart, rawCursorEnd } = this.getRawCursorFromMasked(cursorStart, cursorEnd, prevMaskedValue);
        
        // {} Default Logic
        // * Normal backspace/delete - single character  OR  highlighted text deletions  AND  nulled ctrl+backspaces from a highlighted selections
        if (!windowsOrMacCtrlKeyPressed || isHighlightedSelection) { 
          const removedChars = this.getRemovedCharacterCount(rawCursorStart, rawCursorEnd);
          newRawValue = this.removeFromRawValue(prevRawValue, rawCursorStart, rawCursorEnd, removedChars, actionType);
          newCursorLocation = this.getNewRawCursorLocation(rawCursorStart, rawCursorEnd, removedChars, actionType);
        }
        
        // #region Ctrl + Backspace/Delete logic on an raw value
        // * We only allow it to delete the mask's individual segments. ie. (012)-345-6789| -> (012)-345-____
        else { // windowsOrMacCtrlKeyPressed && !isHighlightedSelection
          const cursorLocation = cursorStart; 
          
          // TODO - move this further down to account for locations before or after all wildcard segments
          // <- Early out - pressed (Ctrl + Backspace) at the start of the input OR (Ctrl + Del) at the end of the input
          if (actionType == 'deleteContentBackward' && cursorLocation == 0
            || actionType == 'deleteContentForward' && cursorLocation >= this.mask.length) 
          {
            this.updateState(prevRawValue, prevMaskedValue, cursorStart, cursorStart);
            this.handleNativeEventLogic(prevMaskedValue, prevRawValue);
            this.updateCursorPosition(cursorStart, cursorStart, prevRawValue);
            console.log(`Cancelled MaskEval::${actionType}: Trying to delete characters in out of bounds scenarios: `, 
              { value: this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue }), 
              start: cursorStart, end: cursorEnd, key: `Ctrl + ${actionType == 'deleteContentBackward' ? 'Backspace' : 'Delete'}`, 
              wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
            );
            return prevMaskedValue;
          }
          
          
          // {} Divide the mask's typeable areas into segments, and iterate through them to find which section we're editing
          // ? Capture the mask's individual text segments, and store them in a hash
          const refMaskVal = !!this.history.get() ? prevMaskedValue : this.buildInputMask(prevMaskedValue); // In the event the user hasn't typed yet
          const maskSegments = new Map<number, [number, number]>();
          let cachedSegment: [number, number] | null = null;
          for(let i = 0; i < this.mask.length; i++) {
            const maskChar = this.mask[i];
            
            // * start capturing a mask segment, or update the current one
            if (maskChar == this.wildcard) {
              if (!cachedSegment) cachedSegment = [i, i]; // found new portion of the mask
              else                cachedSegment[1] = i; // otherwise update it's endLocation
              // console.log(`maskSegments(${i}) char[${maskChar}] adding to segment, [start: ${cachedSegment?.[0]}, end: ${cachedSegment?.[1]}]`);
            }
            
            // * We finished a segment, add it to the map, and clear it to find the next one
            const finishedWildCardSegment = maskChar != this.wildcard;
            if (cachedSegment && finishedWildCardSegment || cachedSegment && i + 1 == this.mask.length) {
              cachedSegment[1] = i + 1 == this.mask.length ? i + 1 : i; // Moves the cursor/index after the last wildcard value
              maskSegments.set(maskSegments.size, cachedSegment);
              // console.log(`maskSegments(${i}) added a new segment: `, { start: cachedSegment?.[0], end: cachedSegment?.[1], maskChar,  mask: this.mask });
              cachedSegment = null;
            }
          }
          
          // #region Capture Segment Data
          // {} Find the cursor's location within or from the segments
          // Loop through each portion of the mask, and find where the cursor should be
          let cursorSegment: [number, number] | undefined;
          let segmentCursorLocation: number = -1;
          let currentAction: 'handleDeletion' | 'moveCursor' | undefined = undefined;
          let lastNonEmptySegment: [number, number] | undefined;
          for (const [i, [start, end]] of maskSegments.entries()) {
            // console.log(`MaskSegment(${i}): [start: ${start}, end: ${end}]`);
            
            // * First find out if this is an empty segment
            const currentSegment: string = refMaskVal.substring(start, end);
            let isEmptySegment: boolean = currentSegment.replace(new RegExp(`\\${this.wildcard}`, 'g'), "").length == 0; // helps with early out on empty inputs
            if (!isEmptySegment) lastNonEmptySegment = [start, end];
            
            // ? If the cursor is within one of the wildcard segments
            if (cursorLocation >= start && cursorLocation <= end) {
              // * Calculations for when there's a valid segment
              const shouldDelNextSegment = cursorLocation == end && actionType == 'deleteContentForward';
              const shouldDelPrevSegment = cursorLocation == start && actionType == 'deleteContentBackward';
              
              // Delete the previous segment if there is one, otherwise move cursor to the beginning of the input
              if (shouldDelPrevSegment) {
                const prevSegment = maskSegments.get(i - 1);
                cursorSegment = prevSegment;
                segmentCursorLocation = prevSegment?.[1] || 0;
                currentAction = prevSegment ? 'handleDeletion' : 'moveCursor';
                break;
              }
              
              // Delete the next segment if there is one, otherwise move the cursor to the end of the input
              if (shouldDelNextSegment) {
                const nextSegment = maskSegments.get(i + 1);
                cursorSegment = nextSegment
                segmentCursorLocation = nextSegment?.[0] || this.mask.length;
                currentAction = nextSegment ? 'handleDeletion' : 'moveCursor';
              }
              
              // {} Default logic
              // * Valid data, delete based on cursor location
              if (!isEmptySegment) {
                cursorSegment = [start, end];
                segmentCursorLocation = isEmptySegment ? start : cursorLocation;
                currentAction = 'handleDeletion';
                break;
              }
              
              // * Check if there was a non empty segment and move to it
              else if (lastNonEmptySegment) {
                cursorSegment = lastNonEmptySegment;
                if (actionType == 'deleteContentBackward') segmentCursorLocation = cursorSegment[1];
                if (actionType == 'deleteContentForward') segmentCursorLocation = cursorSegment[0];
                currentAction = 'moveCursor';
                break;
              }
              
              // * If not, move the cursor to the beginning of the first segment
              else {
                const firstSegment: [number, number] | undefined = maskSegments.get(0);
                cursorSegment = firstSegment;
                segmentCursorLocation = firstSegment?.[0] || 0;
                currentAction = 'moveCursor';
                break;
              }
            }
            
            
            // ? If the location is less than the current segment ("inbetween" catch all)
            if (cursorLocation < start) {
              // * Move the cursor to the end of the last segment to be deleted, or the beginning of the input
              if (actionType == 'deleteContentBackward') {
                // The end of the previous segment 
                if (lastNonEmptySegment) { 
                  cursorSegment = lastNonEmptySegment;
                  segmentCursorLocation = lastNonEmptySegment[1]; 
                  currentAction = 'handleDeletion';
                  break;
                }
                
                // Move it to the beginning of the input
                else { 
                  cursorSegment = undefined;
                  segmentCursorLocation = 0;
                  currentAction = 'moveCursor';
                  break;
                }
              }
              
              // * Move the cursor to the beginning of this segment to be deleted, or the first segment if everything's empty
              else if (actionType == 'deleteContentForward') {
                // The beginning of the current segment
                if (!isEmptySegment) {
                  cursorSegment = [start, end];
                  segmentCursorLocation = start;
                  currentAction = 'handleDeletion';
                  break;
                }
                
                // Move it to the last non-empty segment, or the first if everything's empty
                else if (lastNonEmptySegment) {
                  cursorSegment = lastNonEmptySegment;
                  segmentCursorLocation = cursorSegment[1];
                  currentAction = 'moveCursor';
                  break;
                }
                
                // Move it to the first segment if everything's empty
                else {
                  const firstSegment: [number, number] | undefined = maskSegments.get(0);
                  cursorSegment = firstSegment;
                  segmentCursorLocation = firstSegment?.[0] || 0;
                  currentAction = 'moveCursor';
                  break;
                }
              }
            }
          }
          
          // ? If we've gone through all the segments, and haven't found the segment
          if (currentAction == undefined) { // They pressed (ctrl + backspace/delete) after all segments in the mask
            
            // * Move it to the last non-empty segment
            if (lastNonEmptySegment) {
              cursorSegment = lastNonEmptySegment;
              segmentCursorLocation = cursorSegment[1];
              currentAction = actionType == 'deleteContentBackward' ? 'handleDeletion' : 'moveCursor';
            }
            
            // * If the input was empty, move it to the beginning
            else {
              const firstSegment: [number, number] | undefined = maskSegments.get(0);
              cursorSegment = firstSegment;
              segmentCursorLocation = cursorSegment?.[0] || 0;
              currentAction = 'moveCursor';
            }
          }
          const displayedSegments = [...maskSegments.entries()].map(v => v[1]).map((i) => ({ i, text: refMaskVal.substring(i[0], i[1])}));
          // #endregion
          console.log(`Finished calculating the mask segments, data: `, 
            { currentAction, cursorSegment, displayedSegments, lastNonEmptySegment,  },
            `\n cursorData: `, { 
              cursorLocation: this.logCursorPos(cursorLocation, cursorLocation, { maskedVal: prevMaskedValue }), 
              segmentCursorLocation: this.logCursorPos(segmentCursorLocation, segmentCursorLocation, { maskedVal: prevMaskedValue }), 
            },
          );
          
          
          // {} Update the newRawValue and newCursorLocation from the captured mask segment calculations
          // ? run (Ctrl + Backspace/Delete) on a segment of the input mask, or move the cursor location
          if (currentAction == 'handleDeletion' && cursorSegment) { 
            console.log('Segment Start/End Locations, and the cursors updated segment location: ');
            const { rawCursorStart: segmentStart, rawCursorEnd: segmentEnd } = this.getRawCursorFromMasked(cursorSegment[0], cursorSegment[1], refMaskVal);
            const { rawCursorStart: segmentCursorPos } = this.getRawCursorFromMasked(segmentCursorLocation, segmentCursorLocation, refMaskVal);
            
            // calculate the new raw value after editing one of the segments
            const beforeSegment = prevRawValue.substring(0, segmentStart);
            const afterSegment = prevRawValue.substring(segmentEnd);
            const segment = prevRawValue.substring(segmentStart, segmentEnd); // If there are empty spaces here, we're at the end of the input value
            const editedSegment = this.ctrlRemoveFromRawValue(segment, segmentCursorPos - segmentStart, actionType);
            console.log(`Ctrl + (${actionType}): ${currentAction} data: `, { beforeSegment, segment, afterSegment, newText: editedSegment },
              `\n segmentCursorData: `, { segmentStart, segmentEnd, segmentCursorPos, origCursor: cursorLocation }
            );
            
            // * Update both the new raw value, and the cursor location
            newRawValue = beforeSegment + editedSegment + afterSegment;
            newCursorLocation = segmentCursorPos;
            if (actionType == 'deleteContentBackward') {
              newCursorLocation = segmentCursorPos - (segment.length - editedSegment.length);
            }
          } 
          
          // ? the cursor was out of bounds, or in another segment with empty text. Move it to the next segment based on the input action
          if (currentAction == 'moveCursor' || !cursorSegment) {
            const { rawCursorStart: segmentCursorPos } = this.getRawCursorFromMasked(segmentCursorLocation, segmentCursorLocation, refMaskVal);
            newCursorLocation = segmentCursorPos;
            shouldCallOnChange = false; // Only update the cursor location
            
            // ! error handling
            if (currentAction == 'handleDeletion' && !cursorSegment) {
              console.error(`evaluating(${actionType}): Ctrl + (Del/Backspace) tried to handle deletion without finding a valid segment, moving the cursor! `, 
                { cursorSegment, segmentCursorLocation, newCursorLocation, maskSegments, displayedSegments}
              );
            }
          }
        } 
        // #endregion - Ctrl + Backspace/Delete logic
        
        
        // * Create the masked input
        const { maskedCursorStart, maskedCursorEnd } = this.findMaskedCursorLocations(newCursorLocation, newCursorLocation);
        const newMaskValue = this.buildInputMask(newRawValue);
        
        // -> Successfully recreated the masked input value for ctrl + delete events
        if (shouldCallOnChange) {
          this.updateState(newRawValue, newMaskValue, maskedCursorStart, maskedCursorEnd); // update internal state tracking
          this.handleNativeEventLogic(shouldCallOnChange ? newMaskValue : undefined, newRawValue); // call the onChange w/maskInput
        }
        this.updateCursorPosition(maskedCursorStart, maskedCursorEnd, newMaskValue, input); 
        console.log(`Completed MaskEval::${actionType}: Recreated the mask for the delete event. Data: `, 
          { value: this.logCursorPos(maskedCursorStart, maskedCursorEnd, { maskedVal: newMaskValue }), 
          start: maskedCursorStart, end: maskedCursorEnd, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
        );
        console.log(`cursor history () data:`, 
          `\nprevRaw:   `, { cursor: this.logRawCursorPos(rawCursorStart, rawCursorEnd, prevRawValue) },
          `\nnewRaw:    `, { cursor: this.logRawCursorPos(newCursorLocation, newCursorLocation, newRawValue) },
          `\nprevMasked:`, { cursor: this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue, rawVal: prevRawValue }) },
          `\nnewMasked: `, { cursor: this.logCursorPos(maskedCursorStart, maskedCursorEnd, { maskedVal: newMaskValue, rawVal: newRawValue }) },
        );
      }
      return newMaskValue; 
    }
    // #endregion
    
    
    // #region - Undo and Redo events
    // {} use the InputMaskHistory to retrieve the previous history's value
    if (actionType == 'historyUndo' || actionType == 'historyRedo') {
      let prevState: InputMaskHistoryState | null = actionType == 'historyUndo' ? this.history.undo() : this.history.redo();
      
      // -> Update the input with the undo/redo, if there is one
      if (prevState) {
        // * The calculated data from the history event
        const { rawValue, maskedValue, curStart, curEnd } = prevState;
        const dispValue = this.isMaskEnabled() ? maskedValue : rawValue;
        
        // -> revert / redo the input state
        this.updateState(rawValue, maskedValue, curStart, curEnd, false);
        this.handleNativeEventLogic(dispValue, rawValue); // Update with the new value
        this.updateCursorPosition(curStart, curEnd, dispValue, input);
        
        // Logging and diagnostics
        console.log(`Completed ${actionType}: event data: `, 
          { value: this.logCursorPos(curStart, curEnd, { maskedVal: maskedValue, rawVal: rawValue }), 
            start: curStart, end: curEnd, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
        );
        const prevCursorLog = this.isMaskEnabled() 
          ? this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue })
          : this.logRawCursorPos(cursorStart, cursorEnd, prevRawValue);
        const histCursorLog = this.isMaskEnabled() 
          ? this.logCursorPos(curStart, curEnd, { maskedVal: maskedValue })
          : this.logRawCursorPos(curStart, curEnd, rawValue);
        console.log(`cursor history () data:`, 
          `\nprevValue:           `, { cursor: prevCursorLog },
          `\n${actionType}Value:  `, { histCursorLog },
        ); 
        return dispValue;
      } 
      
      // {} There wasn't any history data for "undo / redo"
      else {
        // this.updateState(); // ! Do not update the state
        this.handleNativeEventLogic(undefined, prevRawValue); // cancel the event
        console.log(`Failed ${actionType}: there wasn't ${actionType} data. information: `, 
          { value: this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue, rawVal: prevRawValue }), 
            cursorStart, cursorEnd, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
        );
        const { curStart, curEnd, rawValue, maskedValue } = this.history.get() || {}; 
        const prevCursorLog = this.isMaskEnabled() 
          ? this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue })
          : this.logRawCursorPos(cursorStart, cursorEnd, prevRawValue);
        const currCursorLog = this.isMaskEnabled() 
          ? this.logCursorPos(curStart || 0, curEnd || 0, { maskedVal: maskedValue })
          : this.logRawCursorPos(curStart || 0, curEnd|| 0, rawValue || '');
        console.log(`cursor history () data:`, 
          `\nprevValue:           `, { cursor: prevCursorLog },
          `\n${actionType}Value:  `, { currCursorLog },
        ); 
        return false;
      }
    }
    // #endregion
    
    
    // #region - AutoFill events
    // {} Overwrite the value completely, and store the browser's autoFill update to the history state
    if (actionType == 'insertReplacementText') {
      // ? If we're using a filter
      if (this.isFilterEnabled()) {
        filteredInsert = this.filter(insertedText);
        
        // ? Filter Only - finish the calc here
        if (!this.isMaskEnabled()) {
          newRawValue = filteredInsert || '';
          newCursorLocation = newRawValue.length;
          
          this.updateState(newRawValue, prevMaskedValue, newCursorLocation, newCursorLocation); // Update the cached refs and history
          this.handleNativeEventLogic(newRawValue, newRawValue); // Pass the filtered autofill to the input
          this.updateCursorPosition(newCursorLocation, newCursorLocation, newRawValue); // Move the cursor to the end of the autofill
          console.log(`autofill replace data: `, { insertedText, filteredInsert, newRawValue, newCursorLocation, history: this.history });
          console.log(`Completed MaskEval::${actionType}: Filtered the input for an autofill. Event data: `, 
            { value: this.logCursorPos(newCursorLocation, newCursorLocation, { rawVal: newRawValue }), 
              newCursorLocation, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
          );
          console.log(`cursor history () data:`, 
            `\nprevRaw:   `, { cursor: this.logRawCursorPos(cursorStart, cursorEnd, prevRawValue) },
            `\nnewRaw:    `, { cursor: this.logRawCursorPos(newCursorLocation, newCursorLocation, newRawValue) },
          );
          return newRawValue;
        }
      }
      
      
      // ? Mask Only - Create the masked input, and update the input
      if (this.isMaskEnabled()) {
        // Calc the new raw value
        const currentValue = filteredInsert; // defaulted to autofill if filter is disabled
        newRawValue = currentValue;
        newCursorLocation = newRawValue.length;
        
        // -> Successfully recreated the masked value for an autofill event
        const { maskedCursorStart, maskedCursorEnd } = this.findMaskedCursorLocations(newCursorLocation, newCursorLocation);
        newMaskValue = this.buildInputMask(newRawValue);
        this.updateState(newRawValue, newMaskValue, maskedCursorStart, maskedCursorEnd); // update internal state tracking
        this.handleNativeEventLogic(newMaskValue, newRawValue); // call the onChange w/maskInput
        this.updateCursorPosition(maskedCursorStart, maskedCursorEnd, newMaskValue, input); // after the added text
        
        console.log(`Completed MaskEval::${actionType}: Recreated the mask during an autofill event, data: `, 
          { value: this.logCursorPos(maskedCursorStart, maskedCursorEnd, { maskedVal: newMaskValue }), 
            start: maskedCursorStart, end: maskedCursorEnd, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
        );
        const { rawCursorStart, rawCursorEnd } = this.getRawCursorFromMasked(cursorStart, cursorEnd, prevMaskedValue);
        console.log(`cursor history () data:`, 
          `\nprevRaw:   `, { cursor: this.logRawCursorPos(rawCursorStart, rawCursorEnd, prevRawValue) },
          `\nnewRaw:    `, { cursor: this.logRawCursorPos(newCursorLocation, newCursorLocation, newRawValue) },
          `\nprevMasked:`, { cursor: this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue, rawVal: prevRawValue }) },
          `\nnewMasked: `, { cursor: this.logCursorPos(maskedCursorStart, maskedCursorEnd, { maskedVal: newMaskValue, rawVal: newRawValue }) },
        );
        return newMaskValue;
      }
      
      return prevRawValue;
    }
    
    // {} Browser autofill wants to remove the autoFilled value completely, replicate this and store it in our state
    if (actionType == 'deleteReplacementText') {
      newCursorLocation = 0;
      newRawValue = '';
      
      if (this.isMaskEnabled()) {
        newMaskValue = this.buildInputMask('');
      }
      
      // -> Successfully removed the input value for the autofill's clear event
      const newValue = this.isMaskEnabled() ? newMaskValue : newRawValue;
      this.updateState(newRawValue, newMaskValue, newCursorLocation, newCursorLocation);
      this.handleNativeEventLogic(newValue, newRawValue);
      this.updateCursorPosition(newCursorLocation, newCursorLocation, newValue);
      console.log(`autofill clear data: `, { prevRawValue, newRawValue, history: this.history });
      console.log(`Completed MaskEval::${actionType}: An autofill event cleared the input. data: `, 
        { value: this.logCursorPos(newCursorLocation, newCursorLocation, { rawVal: newRawValue }), 
          newCursorLocation, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
      );
      
      if (this.isMaskEnabled()) {
        const { rawCursorStart, rawCursorEnd } = this.getRawCursorFromMasked(cursorStart, cursorEnd, prevMaskedValue);
        console.log(`cursor history () data:`, 
          `\nprevRaw:   `, { cursor: this.logRawCursorPos(rawCursorStart, rawCursorEnd, prevRawValue) },
          `\nnewRaw:    `, { cursor: this.logRawCursorPos(newCursorLocation, newCursorLocation, newRawValue) },
          `\nprevMasked:`, { cursor: this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue, rawVal: prevRawValue }) },
          `\nnewMasked: `, { cursor: this.logCursorPos(newCursorLocation, newCursorLocation, { maskedVal: newMaskValue, rawVal: newRawValue }) },
        );
      } else {
        console.log(`cursor history () data:`, 
          `\nprevRaw:   `, { cursor: this.logRawCursorPos(cursorStart, cursorEnd, prevRawValue) },
          `\nnewRaw:    `, { cursor: this.logRawCursorPos(newCursorLocation, newCursorLocation, newRawValue) },
        );
      }
      return newValue;
    }
    // #endregion
    
    // ! Fallback: we don't want to break the mask input, so just prevent this event from occurring
    console.error(`MaskEval::InputMask(${this.mask}) encountered an error while evaluating the mask on a keypress.`,
      `\n The previous input entry's actionType was ${actionType}, returning the event unaffected: `, { prevRawValue, prevMaskedValue, insertedText, inputName },
      `\n Event data: `, { input, event },
    );
    
    this.handleNativeEventLogic(undefined, undefined); // prevent the event from editing the mask's value
    return false;
  }
  
  
  
  
  //--------------------------------//
  // Primary Functions              //
  //--------------------------------//
  // #region Primary Functions
  /**
   * Uses the **mask's** cursor locations to find the locations for the ***raw input*** by counting it's **non-wildcard** template characters and the **empty wildcards**.
   * 
   * ----
   * @param mStart          The mask's cursor **start** location.
   * @param mEnd            The mask's cursor **end** location.
   * 
   * @returns               A destructurable object that contains the `rawCursorStart` and `rawCursorEnd`.
   */
  protected getRawCursorFromMasked(mStart: number, mEnd: number, maskedValue: string): { rawCursorStart: number, rawCursorEnd: number } {
    const mask = maskedValue || this.mask;
    const wildcard = this.wildcard;
    if (!mask || !wildcard) {
      console.error(`getRawCursorFromMasked() is missing properties to find the rawCursorLocation. Data: `, { maskedValue, wildcard, mStart, mEnd });
      return { rawCursorStart: mStart, rawCursorEnd: mEnd };
    }
    
    // Capture the non-wildcard characters up to each index and subtract them, and remove any empty wildcard spaces
    let rawCursorStart = mask.length;
    let rawCursorEnd = mask.length;
    let emptySpaces = 0;
    let nonWildcards = 0;
    for (let i = 0; i <= mask.length; i++) {
      const maskChar = mask?.[i] || '';
      
      // * If we're at the current masked index, subtract it's template chars, and any empty spaces up to now
      if (mStart == i) rawCursorStart = i - nonWildcards - emptySpaces;
      if (mEnd == i) rawCursorEnd = i - nonWildcards - emptySpaces;
      
      // Remove the mask only characters from the raw input's index
      if (this.cachedNWcChars?.includes(maskChar)) {
        nonWildcards++;
      }
      
      // Remove empty spaces from the raw input's index
      if (maskChar == wildcard && i < mask.length) {
        emptySpaces++;
      }
    }
    
    console.log(`getRawCursorFromMasked() cursorInformation:`, { mStart, mEnd, rawCursorStart, rawCursorEnd, maskedValue },
      `\nmasked: `, { masked: this.logCursorPos(mStart, mEnd, { maskedVal: this.maskedInputValue }) }, 
      `\nraw:    `, { masked: this.logRawCursorPos(rawCursorStart, rawCursorEnd, this.rawInputValue) },
    );
    return { rawCursorStart, rawCursorEnd };
  }
  
  
  /**
   * Inserts the new text into the raw value in a couple different ways
   *  * `Filter only`: It **additively inserts** the text based on the cursor's location or selection. Just like the **native** behavior.
   *  * `Mask`: It will **overwrite** the text in the current selection. 
   * 
   * ----
   * @param inserted              The user's inserted text, whether it was a single key, a selection and a key or a paste.
   * @param cursorStart           The raw **cursor's** start location.
   * @param cursorEnd             The raw **cursor's** end location.
   * @returns                     The new raw input value.
   */
  protected addToRawValue(inserted: string, prevValue: string, cursorStart: number, cursorEnd: number): string {
    const currentValue = prevValue || '';
    if (!inserted) return prevValue;
    
    
    // ? Filter only -> additive
    if (!this.isMaskEnabled()) {
      const newRawValue = currentValue.substring(0, cursorStart) + inserted + currentValue.substring(cursorEnd);
      console.log(`addToRawValue(filterOnly) data:`, { prevValue: currentValue, newRawValue, inserted });
      return newRawValue;
    }
    
    
    // ? Mask logic -> overwrite, add extras, remove overflow
    let newRawValue = '';
    const maxLength = this.mask.split("").filter(char => char == this.wildcard).length;
    const isHighlighted = cursorStart != cursorEnd;
    
    // If it hasn't been set, initialize the value
    if (currentValue.length == 0) {
      newRawValue = inserted;
      
      // -> Return the new raw value
      const clampedRawValue = newRawValue.substring(0, maxLength);
      console.log(`addToRawValue() data:`, { clampedRawValue, unClamped: newRawValue });
      return clampedRawValue;
    }
    
    // * Logic: Edit the current value
    else {
      // ! error scenario
      // (111)-222-3333 1112223333
      // paste 55555 at the beginning
      
      // insert & append the characters to existing raw value
      const beforeCursor = prevValue.substring(0, cursorStart);
      const cursorSel = inserted;
      // const rawAfterCursor = prevValue.substring(cursorEnd); // the actual value
      // const afterCursor = rawAfterCursor.substring(inserted.length); // handles both single and highlighted inputs
      const afterCursor = prevValue.substring(cursorEnd + (isHighlighted ? 0 : inserted.length)); // step / overwrite
      newRawValue = beforeCursor + cursorSel + afterCursor;
      
      // -> Calculate and return the new cursor position from the edit;
      const clampedRawValue = newRawValue.substring(0, maxLength);
      console.log(`addToRawValue() insertLogic:`, { clampedRawValue, beforeCursor, cursorSel, afterCursor }, { newRawValue, inserted, prevValue });
      return clampedRawValue;
    }
  }
  
  
  /**
   * Delete the raw value's characters just like the native input event's behavior.
   * 
   * **Note:** Uses the cursor's `selection` to determine what's deleted, but that was left out of this function because of **DRY**.
   * 
   * ----
   * @param prevValue             The input's current value without the mask applied.
   * @param cursorStart           The raw **cursor's** start location.
   * @param cursorEnd             The raw **cursor's** end location.
   * @param removedChars          How many characters we removed.
   * @param actionType            Whether the user deleted using **backspace**. **delete** or with **cut**.
   * 
   * @returns                     The new raw input value.
   */
  protected removeFromRawValue(prevValue: string, cursorStart: number, cursorEnd: number, removedChars: number, actionType: InputActionType): string {
    if (prevValue === undefined || cursorStart > cursorEnd) {
      console.error(`removeFromRawValue(${prevValue}): An error occurred from one of the inputMask calculations, invalid input data: `, { prevValue, cursorStart, cursorEnd });
      return prevValue || '';
    }
    
    // ? Split the string using the cursor's index, stripping out any removed characters
    const isHighlightedSelection = cursorStart != cursorEnd;
    let start = cursorStart;
    let end = cursorEnd;
    
    // * All delete actions use the same logic for highlighted cursor selections
    if (isHighlightedSelection) start = cursorEnd - removedChars; // ? current calc simulates default behavior, redundant: (separation of concerns)
    else if (actionType == 'deleteContentBackward') start = cursorStart - 1; // * The 'backspace' key.
    else if (actionType == 'deleteContentForward') end = cursorEnd + 1; // * The 'delete' key.
    
    // 12345    -> (beforeCursor, sel, afterCursor)
    // [2, 4]   -> 12__5
    // back[3]  -> 12_45
    // fwd[3]   -> 123_5
    let beforeCursor: string = prevValue.substring(0, start);
    let afterCursor: string = prevValue.substring(end);
    let selDel: string = prevValue.substring(start, end);
    
    const newRawValue = beforeCursor + afterCursor;
    console.log(`removeFromRawValue(${actionType}) data: `, { newRawValue, beforeCursor, deleted: selDel, afterCursor, removedChars });
    return newRawValue;
  }
  
  
  /**
   * Delete segments of the raw value's characters just like the native input event's **Ctrl + Backspace/Delete** behavior.
   * 
   * **Note:** This assume's that there isn't a highlighted selection, and is intended for that use only.
   * 
   * ----
   * @param text                  The input's value or a portion of it without the mask applied. (also for cutting ***mask*** segments)
   * @param cursorPosition        The raw **cursor's** location on either the ***currentValue*** or the provided ***segment***.
   * @param actionType            Whether the user deleted using **backspace**, **delete**
   * 
   * @returns                     The new raw input value.
   */
  protected ctrlRemoveFromRawValue(text: string, cursorPosition: number, backspaceOrDelete: InputActionType): string {
    if (text === undefined || cursorPosition < 0 || cursorPosition > text.length) {
      console.error(`ctrlRemoveFromRawValue(${backspaceOrDelete}): An error occurred from one of the inputMask calculations, invalid input data: `, { text, cursorPosition });
      return text || '';
    }
    
    if (!(backspaceOrDelete == 'deleteContentBackward' || backspaceOrDelete == 'deleteContentForward')) {
      console.error(`ctrlRemoveFromRawValue(${backspaceOrDelete}) Was called for something other than a backspace/delete event! `, { text, cursorPosition });
      return text || '';
    }
    
    // Divide the string into two parts using the cursor's location
    const leftText: string = text.slice(0, cursorPosition);
    const rightText: string = text.slice(cursorPosition);
    let newRawText: string = text;
    
    // {} These match exactly how operating systems group words for deletion
    // ? Simulate a Ctrl + Backspace event
    if (backspaceOrDelete == 'deleteContentBackward') {
      const ctrlBackspaceFilter = leftText.match(/(\s*\w+|\s+|[^\w\s]+)?$/);  // Matches trailing spaces w/word sequences OR a block of punctuation symbols before the cursor
      
      const charactersToDelete = ctrlBackspaceFilter ? ctrlBackspaceFilter[0].length : 0;
      const newPrecedingText = leftText.slice(0, leftText.length - charactersToDelete);
      newRawText = newPrecedingText + rightText;
    }
    
    // ? Simulate a Ctrl + Delete event
    if (backspaceOrDelete == 'deleteContentForward') {
      const ctrlDeleteFilter = rightText.match(/^(\w+\s*|\s+|[^\w\s]+)?/);  // Match leading spaces w/word characters OR a block of punctuation symbols after the cursor
      
      const charactersToDelete = ctrlDeleteFilter ? ctrlDeleteFilter[0].length : 0;
      const newSubsequentText = rightText.slice(charactersToDelete);
      newRawText = leftText + newSubsequentText;
    }
    
    // console.log(`ctrlRemoveFromRawValue(${backspaceOrDelete}) data: `, { leftText, rightText, newRawText, prevText: text, cursorPosition });
    return newRawText;
  }
  
  
  /**
   * Calculates the new **raw cursor** location from the current and the edit.
   * * **note** if there was highlighted text, we start from the cursor's start location, and add the difference from the removed/pasted characters.
   * 
   * ----
   * @param rawCursorStart          The raw cursor's **start** location.
   * @param rawCursorEnd            The raw cursor's **end** location.
   * @param diff                    The added/subtracted characters. For inserts/deletes, it's the **count**. For a paste, it's the difference from the **highlighted text**
   * @param actionType              The Calculation defaults to additions. If this is a delete, we use this to determine whether we should move backwards/forwards.
   * 
   * @returns               the calculated `newRawCursorLocation`.
   */
  protected getNewRawCursorLocation(rawCursorStart: number, rawCursorEnd: number, diff: number, actionType?: InputActionType): number {
    // ? For inserts and pastes
    if (!actionType || actionType == 'insertText' || actionType == 'insertFromPaste' || actionType == 'insertCompositionText') {
      return rawCursorStart + diff;
    }
    
    // ? for autofill scenarios
    if (actionType == 'insertReplacementText') {
      return diff; // The autofill's length
    }
    
    // ? Delete scenarios
    const isHighlightedSelection = rawCursorStart != rawCursorEnd;
    let newCursorLocation = 0;
    
    // * (All) The user deletes a highlighted selection
    if (isHighlightedSelection || actionType == 'deleteByCut') {
      newCursorLocation = rawCursorEnd - diff;
    }
    
    // * (Default) User presses the 'backspace' key
    else if (actionType == 'deleteContentBackward') {
      newCursorLocation = rawCursorStart - diff; // 1
    }
    
    // * (Delete) User presses the 'delete' key
    else if (actionType == 'deleteContentForward') {
      newCursorLocation = rawCursorStart; // (1 ahead) remain in place
    }
    
    console.log(`getNewRawCursorLocation() data: `, { newCursorLocation, prevStart: rawCursorStart, prevEnd: rawCursorEnd, diff, actionType });
    return newCursorLocation;
  }
  
  
  /**
   * Uses the cursor location to determine how much was deleted, or if it was just a delete event.
   * 
   * ----
   * @param rawCursorStart          The raw cursor's **start** location.
   * @param rawCursorEnd            The raw cursor's **end** location.
   * 
   * @returns               how many characters we removed.
   */
  protected getRemovedCharacterCount(rawCursorStart: number, rawCursorEnd: number): number {
    let removedCharacters: number = 0;
    if (rawCursorStart == rawCursorEnd) removedCharacters = 1; // default behavior
    else removedCharacters = Math.max(1, rawCursorEnd - rawCursorStart); // highlighted clamp(min=1)
    
    console.log(`getRemovedCharacterCount() should remove ${removedCharacters} character${removedCharacters > 1 ? 's' : ''}`);
    return removedCharacters;
  }
  
  
  /**
   * Builds the `masked` input value from the raw input value provided to the function.
   * Every time this is ran, it creates the full masked value, with `wildcards` in place of empty characters.
   * 
   * **Note:** Will always build from the beginning to the end for the masked values; 
   * however the raw value will capture wildcards if the user adds spaces or edits different parts of the mask. 
   * 
   * ----
   * @param rawValue            The input value without the mask applied.
   * @returns                   The masked input value.
   */
  public buildInputMask(rawValue: string): string {
    let newMaskValue = '';
    let rawValueIndex = 0;
    
    for (let i = 0; i < this.mask.length; i++) {
      const maskChar = this.mask[i];
      const inputChar = rawValue.substring(rawValueIndex, rawValueIndex + 1);
      // console.log(`current input character: ${inputChar}`, { rawValue });
      
      let addedChar: string;
      if (maskChar != this.wildcard) addedChar = maskChar;
      else if (!inputChar) addedChar = this.wildcard;
      else {
        addedChar = inputChar;
        rawValueIndex++
      } 
      
      newMaskValue += addedChar;
    }
    
    console.log(`buildInputMask finished: `, { newMaskValue, rawValue });
    return newMaskValue;
  }
  
  
  
  /**
   * Updates the raw cursor locations with the mask's template values so it's in sync with the masked input value.
   * 
   * **Remarks:** This is just a hash table using the mask's wildcards to map the indexes.  
   * 
   * ----
   * @param rawCursorStart          The mask's cursor **start** location.
   * @param rawCursorEnd            The mask's cursor **end** location.
   * @param mask                    If you're using a custom **mask**, pass it here.
   * @param wildcard                The **wildcard** for the the custom **mask**.
   *  
   * @returns                       A destructurable object containing `maskedCursorStart` and `maskedCursorEnd`.
   */
  protected findMaskedCursorLocations(rawCursorStart: number, rawCursorEnd: number, mask?: string, wildcard?: string): { maskedCursorStart: number, maskedCursorEnd: number } {
    if (!mask) mask = this.mask;
    if (!wildcard) wildcard = this.wildcard;
    if ((!this.mask /* !mask */ || !wildcard) && this.isMaskEnabled()) {
      console.error(`Calling findMaskedCursorLocation without a valid mask! Pass in params or initialize the mask!`, { mask, wildcard });
      return { } as any;
    }
    
    // Just make a hashmap
    const wildcardMap = new Map<number, number>();
    const start = Math.max(0, rawCursorStart);
    const end = Math.max(0, rawCursorEnd);
    let rawCursorIndex: number = 0;
    for (let i = 0; i < mask.length; i++) {
      const maskChar = mask[i];
      if (maskChar == wildcard) {
        wildcardMap.set(rawCursorIndex, i);
        rawCursorIndex++;
      }
    }
    
    // -> Return the masked cursor locations
    let maskedCursorStart = wildcardMap.get(start) || mask.length;
    let maskedCursorEnd = wildcardMap.get(end) || mask.length;
    console.log(`findMaskedCursorLocations() cursorInformation:`, { rawCursorStart, rawCursorEnd, maskedCursorStart, maskedCursorEnd });
    return { maskedCursorStart, maskedCursorEnd };
  }
  
  
  /**
   * Updates the internal references of the input's current value for the `InputMask`.
   * 
   * We keep an internal reference of the `unmasked` version of the value, and edit that before returning the value with the applied mask.
   * 
   * ----
   * @param rawInputValue           The input value without the mask applied.
   * @param maskedInputValue        The masked input value.
   * @param selectionStart          The **cursor's** start location.
   * @param selectionEnd            The **cursor's** end location.
   */
  protected updateState(rawInputValue: string, maskedInputValue: string, selectionStart: number, selectionEnd: number, updateHistory: boolean = true): void {
    // ? Update the cached current values for the input
    this.rawInputValue = rawInputValue;
    this.maskedInputValue = maskedInputValue;
    
    // ? Add the the internal history state for the inputMask
    if (updateHistory) {
      this.history.push({ 
        rawValue: rawInputValue, 
        maskedValue: maskedInputValue, 
        curStart: selectionStart, 
        curEnd: selectionEnd, 
        inputActionType: this.listenerInputType || 'undefined'
      });
    }
    console.log(`UpdateState() InputMaskState: `, { rawInputValue, maskedInputValue, start: selectionStart, end: selectionEnd, action: this.listenerInputType, _history: this.history });
  }
  // #endregion
  
  
  
  
  //--------------------------------//
  // Filter                         //
  //--------------------------------//
  // #region Filter Functions
  /**
   * Uses a RegExp expression to `filter` out any unwanted characters to a string.
   * 
   * ----
   * @Example
   * ```ts
   * const currentValue = 'abc123';
   * const numbersOnly = /[^\d]/g; 
   * 
   * const filtered = this.filter(currentValue, numbersOnly); 
   * console.log(filtered); // Returns: 123
   * 
   * // Example filter styled RegExp
   * const charsNumsSpecialChars = /^[A-Za-z0-9\s!@#$%^&*()_+=\-[\]{}|;:'",.<>/?`~]+$/;
   * 
   * ```
   * ----
   * @param chars           The characters we want to filter.
   * @param filterRegex     The RegExp we're using to filter characters.
   * @param chars           The characters we want to filter.
   * @param filterRegex     The RegExp we're using to filter characters.
   * 
   * @returns       The filtered version of the value.
   */
  public filter(chars: string | null, filterRegex?: RegExp): string {
    const charsToFilter = chars || '';
    const filterExp = filterRegex || this.filterExp;
    
    // <- Early out if we're missing information
    if (!charsToFilter || (!filterExp && !this._maskFilterChars)) {
      console.error(`${this.inputRef?.name || this.mask}::filter() was ran without the proper information!`, { filterExp, charsToFilter, maskCachedNWcChars: this.cachedNWcChars });
      return charsToFilter;
    }
    
    // ? Handle the InputMask's base filter
    let filteredChars = charsToFilter.replace(filterExp, "");
    
    // ? If there's an input mask, and we're filtering it's non-wildcard characters
    if (this.isMaskEnabled() && this.shouldFilterMaskChars()) {
      // {} To avoid brute forcing with multiple loops, we're creating a hash map from each character we're going to filter
      const maskCharsMap: Record<string, boolean> = {}; // * Capture the non-wildcards for calculations
      (this.cachedNWcChars || []).forEach(char => char && (maskCharsMap[char] = true));
      
      // * Loop through the currently filtered characters and remove the mask's template chars from it
      let maskNWCFilterOutput = filteredChars.split('').filter(char => !maskCharsMap[char]).join('');
      // console.log(`filter() finished, data: `, { initialFilter: filteredChars, filteredNWcText: maskNWCFilterOutput, chars, filterExp, cachedNWcChars });
      return maskNWCFilterOutput;
    }
    
    // console.log(`filter() finished, data: `, { filteredVal: filteredChars, chars, filterExp });
    return filteredChars;
  }
  
  
  /**
   * Whether we have the `filter` enabled or valid.
   * 
   * ----
   * @returns       Whether the filter is defined
   */
  protected isFilterEnabled(): boolean {
    return !!this.filterExp;
  }
  
  
  /**
   * Retrieves the accepted characters expression. Any character is accepted if left undefined.
   *   
   * ----
   * @Example
   * ```ts
   * const phoneMask = '(___) - ___ - ____';
   * const numbersOnly = /^\d+$/;
   * 
   * const inputMask = new MaskBase(phoneMask, numbersOnly);
   * console.log(inputMask.getAcceptedChars()); // Returns: /^\d+$/
   * 
   * 
   * ```
   * 
   * ----
   * @returns       The mask that we're currently using for this mask, or undefined if we're only using the class to filter characters.
   */
  public get filterExp(): RegExp {
    return this._filter || /(?!)/;
  }
  // #endregion
  
  
  
  
  //--------------------------------//
  // Mask                           //
  //--------------------------------//
  // #region Mask Functions
  /**
   * Whether we have the `mask` enabled or valid. 
   * If undefined, we're only using a `filter`.
   * 
   * ----
   * @returns       Whether the mask is enabled / valid
   */
  protected isMaskEnabled(): boolean {
    return !!this.mask;
  }
  
  /**
   * Retrieves the `input mask`. 
   * 
   * **Note:** This can be undefined, and you should use {@link isMaskEnabled()} before using.
   *   
   * ----
   * @Example
   * ```ts
   * const phoneMask = '(___) - ___ - ____';
   * const numbersOnly = /^\d+$/;
   * 
   * const inputMask = new MaskBase(phoneMask, numbersOnly);
   * console.log(inputMask.getMask()); // Returns: '(___) - ___ - ____'
   * 
   * 
   * ```
   * 
   * ----
   * @returns       The mask that we're currently using for this mask, or undefined if we're only using the class to filter characters.
   */
  public get mask(): string {
    return this._mask || "";
  }
  
  
  /**
   * Retrieves the mask's wildcard character. Will return an empty string if the class is not using a mask.
   * @note This can be undefined, and you should use `isMaskEnabled()` before using.
   * 
   * ----
   * @returns       Whether the mask is enabled / valid
   */
  public get wildcard(): string {
    return this._maskWildcardCharacter || "";
  }
  
  
  /**
   * Retrieves the mask's **non-wildcard** characters in an array. Will return undefined if {@link _maskFilterChars} is set to false.
   * @note In the event this is undefined, calling {@link shouldFilterMaskChars} to both check and define the `_maskCachedNWChars`.
   * 
   * ----
   * @returns       Whether the mask is enabled / valid
   */
  public get cachedNWcChars(): string[] {
    if (!this._maskCachedNWChars?.length) {
      this._maskCachedNWChars = this.findNonWildcardChars(this.mask, this._maskWildcardCharacter || DEFAULT_INPUTMASK_WILDCARD);
    }
    
    return this._maskCachedNWChars;
  }
  
  
  /**
   * Whether the input should use the {@link mask} as the placeholder.
   * 
   * ----
   * @returns       true if the placeholder should use the **mask** template.
   */
  public get useMaskAsPlaceholder(): boolean {
    return !!this._useMaskAsPlaceholder;
  }
  
  
  /**
   * Sets the `input mask`, and initializes it's dependent properties for the input mask's {@link evaluate()} function to work properly. 
   * It is essential to call this function every time you're updating the **{@link InputMask}**.
   * 
   * **Note:** This function sets the values of the {@link _mask|mask}, 
   *  {@link _maskWildcardCharacter|maskWildcardCharacter}, and {@link _maskCachedNWChars|maskCachedNWChars}. Which are all used in various functions of this class
   *   
   * ----
   * @Example
   * ```ts
   * const maskWildcard = '_';
   * const phoneMaskConfig = {
   *   mask: '(___) - ___ - ____', maskWildcardCharacter: '_',
   *   filterNonWildcardsFromInput: true, useMaskAsPlaceholder: true
   * };
   * 
   * inputMask.setMask(phoneMask, maskWildcard);
   * console.log(inputMask.getMask()); // Returns: '(___) - ___ - ____';
   * // It also calculates the filter logic, as well as setting the wildcard which is used throughout the class.
   * 
   * 
   * ```
   * 
   * ----
   * @param newMask     The new **mask** for this class.
   * @param wildcard    If you're using a custom **wildcard** (not "**_**"), then define it here.
   * 
   * @returns       The mask that we're currently using for this mask, or undefined if we're only using the class to filter characters.
   */
  public setMask(config: MaskConfig): void {
    const newMask = config.mask;
    const wildcard = config.maskWildCardCharacter;
    const filterMaskChars = config.filterNonWildcardsFromInput; 
    const useMaskAsPlaceholder = config.useMaskAsPlaceholder;
    const keepMaskVisibleWhenEmpty = config.keepMaskVisibleWhenEmpty;
    
    // {} Clear out all the old mask data before initializing the new data
    this._mask = '';
    this._maskWildcardCharacter = DEFAULT_INPUTMASK_WILDCARD;
    this._maskFilterChars = undefined;
    this._maskCachedNWChars = undefined;
    this._useMaskAsPlaceholder = undefined;
    this._keepMaskVisibleWhenEmpty = undefined;
    
    // -> Update the mask's state
    this._mask = newMask;
    this._maskWildcardCharacter = wildcard || DEFAULT_INPUTMASK_WILDCARD;
    this._useMaskAsPlaceholder = useMaskAsPlaceholder;
    this._keepMaskVisibleWhenEmpty = keepMaskVisibleWhenEmpty;
    
    // -> Update the mask's dependent information
    if (this.mask && this.wildcard) {
      this._maskCachedNWChars = this.findNonWildcardChars(this.mask, this._maskWildcardCharacter);
      this._maskFilterChars = filterMaskChars;
    }
  }
  
  
  /**
   * Captures all non-wildcard characters from a mask, and stores them in an array.
   * 
   * ----
   * @param mask            The input mask template string
   * @param wildcard        The input mask's wildcard character.
   * 
   * @returns              An array of all the mask's unique characters.
   */
  protected findNonWildcardChars(mask: string, wildcard?: string): string[] {
    if (!mask || !wildcard) {
      console.error(`findNonWildcardChars was called with invalid data!`, { mask, wildcard }); 
      return [];
    }
    
    const nonWCChars: string[] = [];
    const maskChars = mask.split("");
    
    for (let i = 0; i < mask.length; i++) {
      const char = maskChars[i];
      if (char == wildcard) continue;
      
      // Capture unique mask template characters.
      if (!nonWCChars.includes(char)) nonWCChars.push(char);
    }
    
    return nonWCChars;
  }
  
  
  protected shouldFilterMaskChars(): boolean {
    // Validity checks
    if (!this.isMaskEnabled() || !this._maskFilterChars) {
      return false;
    }
    
    // If the data hasn't been calculated, rebuild it here
    return this.cachedNWcChars?.length != 0; // ? this is an eval and a get()
  }
  
  
  // #endregion
  
  
  
  
  //--------------------------------//
  // Utility                        //
  //--------------------------------//
  // #region Utility Functions
  /** 
   * Returns what the current input value would be, based on our cached references and whether it's a `filtered` or `masked` value. 
   * 
   * **Remarks:** This is for when the {@link inputRef} was updated externally, either from a browser event like an *autofill*, or something else.
   * 
   * ----
   * @returns The `inputRef's` intended current value. 
  */
  protected getCachedInputValue(): string {
    if (this.isMaskEnabled()) return this.maskedInputValue;
    else return this.rawInputValue;
  }
  
  
  /** 
   * @deprecated - we're using history state in favor of trying to calculate probable scenarios. This was left unfinished for a while
   * Checks if the last action was handled by us by asserting that it was a valid captured action, and returns **true** if it deleted the content properly.
   * 
   * **Note** This is only to check that an `Autofill` **Cancel** event occurred. Asserting against our logic using our functions is redundant.
   * 
   * ----
   * @param newValue        Assumed to be the **actual** input value, or raw value. We don't account for masked cursor mutations. 
   * @param prevValue       Assumed to be the **actual** prev input value, or raw value. We don't account for masked cursor mutations.
   * @param cursorStart     The **cursor's** starting location when the deletion occurred.
   * @param cursorEnd       The **cursor's** end location when the deletion occurred.
   * @param inputType       The current input action type for the deletion. If this was an `autofill`, we check against the current to see if *WAS* an browser's `autofill` event.
   * @returns               Whether the user deleted the text. If **false**, then something else edited the input outside of the mask's functionality.
  */
  protected wasAUserDeletion(newValue: string, prevValue: string, cursorStart: number, cursorEnd: number, actionType?: InputActionType): boolean {
    const wasCompletelyDeleted = !newValue && prevValue;
    
    // -> History events are safe
    if (actionType == 'historyUndo' || actionType == 'historyRedo') {
      return true;
    }
    
    // {} Autofill events are unpredictable, and can come from any input type
    if (wasCompletelyDeleted) {
      // * autofill doesn't highlight text when it deletes, and we need to assert against this
      const wasDeleteEvent = actionType == 'deleteContentBackward' || actionType == 'deleteContentForward' || actionType == 'deleteByCut';
      const isHighlight = cursorStart != cursorEnd;
      const highlightedWholeSelection = isHighlight && cursorStart == 0 && cursorEnd == prevValue.length;
      
      // ? if the actionType was delete, did they highlight the whole selection
      if (wasDeleteEvent && highlightedWholeSelection) {
        return true;
      }
      
      // ? if the actionType was ctrl + delete, would this actually delete all text?
      // TODO - account for this logic when it's implemented
      
      // ? Was the previous text only one character, and it was a delete back/forward with the cursor in the right place?
      if (prevValue.length == 1 && wasDeleteEvent) {
        return true;
      }
      
      // <- The user didn't clear the input, an autofill cancel did. 
      return false;
    }
    
    // -> The autofill event didn't clear the input, it was something else
    return true;
  }
  
  
  /**
   * Returns a string displaying the location of the cursor on a maskedInput value.
   * @note This doesn't call **console.log**, it returns the string to be passed to it.
   * 
   * ----
   * @param start   The mask's cursor **start** location.
   * @param end     The mask's cursor **end** location. 
   * @param opts    Optional values to **autofill** the mask with the current value, and for custom masks.
   * 
  * @returns       Whether the mask is enabled / valid
   */
  protected logCursorPos(start: number, end: number, opts?: { mask?: string, wildcard?: string, maskedVal?: string, rawVal?: string } ): string {
    const mask = opts?.mask || this.mask;
    const wildcard = opts?.wildcard || this.wildcard;
    let value = '';
    if ((!mask || !wildcard) && !this.isFilterEnabled()) {
      console.error(`logCursorPosition() is missing properties to display the cursor location. Data: `, { mask, wildcard, start, end });
      return 'CursorLogError';
    }
    
    // ? Filter only
    if (!this.isMaskEnabled()) {
      value = opts?.rawVal || '';
    }
    
    
    // ? mask - Option to display the current value
    else {
      let maskRef = mask; 
      if (opts?.maskedVal) maskRef = opts?.maskedVal;
      else if (opts?.rawVal) {
        let newRef = '';
        const rawChars = opts?.rawVal.split("");
        for(const [index, char] of [...mask].entries()) {
          if (char == wildcard && rawChars.length) newRef += rawChars.shift();
          else newRef += char;
        }
        maskRef = newRef;
      }
      
      value = maskRef;
    }
    
    // ? mask logic
    const isHighlighted = start != end;
    const beforeCursorStart = value.substring(0, start);
    const selection = value.substring(start, end); // either the cursor location '', or the highlighted selection.
    const afterCursorEnd = value.substring(end);
    
    if (isHighlighted) return [beforeCursorStart, '|', selection, '|', afterCursorEnd].join("");
    else               return [beforeCursorStart, '|', afterCursorEnd].join("");
  }
  
  
  /**
   * Returns a string displaying the location of the cursor on a rawInput value.
   * @note This doesn't call **console.log**, it returns the string to be passed to it.
   * 
   * ----
   * @param start   The raw cursor's **start** location.
   * @param end     The raw cursor's **end** location. 
   * @param rawVal  The current raw value.
   * 
  * @returns       Whether the mask is enabled / valid
   */
  protected logRawCursorPos(start: number, end: number, rawVal: string ): string {
    if (rawVal === undefined || rawVal === null) {
      console.error(`logRawCursorPos() is missing properties to display the cursor location. Data: `, { rawVal, start, end });
      return 'CursorLogError';
    }
    
    const isHighlighted = start != end;
    const beforeCursorStart = rawVal.substring(0, start);
    const selection = rawVal.substring(start, end); // either the cursor location '', or the highlighted selection.
    const afterCursorEnd = rawVal.substring(end);
    
    if (isHighlighted) return [beforeCursorStart, '|', selection, '|', afterCursorEnd].join("");
    else               return [beforeCursorStart, '|', afterCursorEnd].join("");
  }
  // #endregion 
  
  
  
  
  //--------------------------------//
  // Input Event Functions          //
  //--------------------------------//
  // #region Input Event Functions
  /**
   * Update the **cursor's** location for a specific input element. 
   * 
   * ----
   * @param cursorStart   The **cursor's** location, or the highlighted selection's starting location.
   * @param cursorEnd     The **highlighted selection's** end location, or the same as **cursorStart**.  
   * @param newValue      The updated value that we're passing to the **onChange**.
   * @param input         Uses the cached **inputRef** unless you pass in a custom one.
   */
  protected updateCursorPosition(
    cursorStart: number, cursorEnd: number, newValue: string, input?: HTMLInputElement | HTMLTextAreaElement,
  ): void {
    input = input || this.inputRef;
    if (!input) {
      console.error(`updateCursorPosition() was invoked with missing data: `, { input, cursorStart, cursorEnd, newValue });
      return;
    }
    
    // between 0 and the mask's char limit
    const cursorPos = Math.max(
      0, 
      Math.min( 
        Math.max(0, cursorStart), 
        newValue.length
      )
    );
    
    // TODO - check if this is okay?
    const newCursorPos = Math.min(
      Math.max(0, cursorStart),
      newValue.length
    );
    
    input.setSelectionRange(cursorPos, cursorPos);
  }
  
  
  /**
   * Utility function to cancel out onBeforeInput invocations and run `onChange` with a custom mask/filtered value.
   * * This is being used with `onBeforeInput` events to handle manual calls to the input's internal `onChange` event. 
   *   
   * ----
   * @param event             The onBeforeInput event we're interacting with.
   * @param preventDefault    Whether we want to prevent `onBeforeInput` from inserting characters into the input.
   * @param rawValue          The new raw value. If it's empty and {@link keepMaskVisibleWhenEmpty} isn't true, we return undefined
   */
  protected handleNativeEventLogic( 
    invokeOnChange: string | undefined = undefined, // false
    rawValue: string | undefined
  ): void {
    if (!this.inputRef) return;
    const input = this.inputRef;
    
    // ? Stop the browser from inserting the raw, unmasked characters
    // if (preventDefault) { // <- this is handled in the input's onBeforeInput() event if it's using the mask
    //   event.preventDefault();
    // }

    // ? Manually call onChange: assign the masked value to the element
    if (invokeOnChange !== undefined) {
      let newValue = invokeOnChange;
      if (!rawValue && !this._keepMaskVisibleWhenEmpty) newValue = "";
      
      // {} React calls onChange when this value is updated
      console.log(`handleNativeEventLogic(${this.listenerInputType}): updating the input value to "${newValue}"`);
      input.value = newValue; // ! Changing this property directly triggers React's internal onChange tracker
      // if (invokeOnChange === '') console.log('handleNativeEventLogic() called onChange with an empty string!');
      
      // * Dispatches a synthetic input change notification
      const tracker = (input as any)._valueTracker;
      if (tracker) {
        tracker.setValue(invokeOnChange);
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
  // #endregion
  
  
  //--------------------------------//
  // Event Listener Functions       //
  //--------------------------------//
  // #region Event Listener Functions
  /** Add the event listeners to keep track of the user's current input action. called in the {@link constructor()} */
  public initEventListeners(input: HTMLInputElement | HTMLTextAreaElement): void {
    if (this.addedEventListeners) return;
    
    this.inputRef = input;
    input.addEventListener('keydown', this.onKeyPress, true);
    input.addEventListener('cut', this.onCut, true);
    input.addEventListener('paste', this.onPaste, true);
    input.addEventListener('input', this.onAutoFill, true); 
    this.addedEventListeners = true;
  }
  
  /** 
   * Removes the `event listeners` when called. 
   * 
   * **Important:** this must be called when you're unmounting your react component or deleting the {@link InputMask} class. 
   */
  public cleanup(): void {
    if (!this.inputRef) { 
      console.error(`Something happened to this class's reference to it's current input, and was unable to unbind it's event listeners!`, { mask: this.mask, ref: this.inputRef });
      return;
    }
    
    this.inputRef.removeEventListener('keydown', this.onKeyPress, true);
    this.inputRef.removeEventListener('cut', this.onCut, true);
    this.inputRef.removeEventListener('paste', this.onPaste, true);
  }
  
  
  /** 
   * Listener for when the adds or deletes text. 
   * 
   * `Defaults to insertText:`  We're not going to check every key, just certain ones for adding/removing text.
  */
  protected onKeyPress = (inputEvent: Event): void => {
    const keyboardEvent = inputEvent as KeyboardEvent;
    const windowOrMacCtrlPressed = (keyboardEvent?.ctrlKey || keyboardEvent?.metaKey);
    const key = keyboardEvent?.key?.toLocaleLowerCase();
    if (!inputEvent || !key) return;
    
    // ? Allow for undo and redo events
    // console.log(`keyEvent(${key}), ${keyboardEvent.ctrlKey ? 'ctrl, ' : ''}${keyboardEvent.shiftKey ? 'shift, ' : ''}${keyboardEvent.altKey ? 'alt, ' : ''}`, keyboardEvent);
    if (windowOrMacCtrlPressed && key === 'z') {
      const isRedo = windowOrMacCtrlPressed && keyboardEvent.shiftKey;
      const isUndo = !isRedo;
      
      console.log('\n\nthis was an undo/redo event!: ', keyboardEvent);
      if (isUndo) {
        this.listenerInputType = 'historyUndo'; // we're not using actual history events, just our own InputMaskHistory state
        this.evaluate(inputEvent, this.listenerInputType);
      }
      
      else if (isRedo) {
        this.listenerInputType = 'historyRedo'; // we're not using actual history events, just our own InputMaskHistory state
        this.evaluate(inputEvent, this.listenerInputType);
      }
      
      return;
    }
    
    // * Handling specific events
    // ? Allow for copy and paste events
    if (windowOrMacCtrlPressed && (key == 'c' || key == 'v')) {
      return;
    }
    
    // ? Allow for cut events
    if (windowOrMacCtrlPressed && key == 'x') {
      return;
    }
    
    // ? Allow if the user select's all with ctrl + a
    if (windowOrMacCtrlPressed && key == 'a') {
      return;
    }
    
    // ? Browser specific functionality
    if (windowOrMacCtrlPressed && (key == 'r' || key == 'n' || key == 't' || key == 'f' || key == 'd' || key == 'p')) {
      return; 
    } 
    
    // ? Page navigation
    if (keyboardEvent.altKey || keyboardEvent.metaKey && (key == 'arrowleft' || key == 'arrowright')) {
      return;
    }
    
    // ? Zooming 
    if (windowOrMacCtrlPressed && (key == '=' || key == '-' || key == '0')) {
      return;
    }
    
    // * Ignore structural navigation keys
    if ([
      'arrowup', 'arrowleft', 'arrowdown', 'arrowright',
      // 'unidentified', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright',
      // 'tab', 'control', 'alt', 'meta', 'escape', 'capslock', 'insert'
    ].includes(key)) {
      // console.log('structural nav keys, and misc');
      return;
    }
    
    // ? Captured key events we're looking for (insert character, backspace, or delete)
    if (key == 'backspace' || key == 'delete') {
      this.listenerInputType = key == 'backspace' ? 'deleteContentBackward' : 'deleteContentForward';
      
      // -> An autofill's deletion event, handle gracefully
      // if (this.inputRef?.matches(':autofill') || this.inputRef?.matches(':-webkit-autofill')) {
      //   // DO NOT call inputEvent.preventDefault() here!
      //   // Let the browser natively break its autofill state block.
      //   console.log(`\n\nUser pressed ${key} on an autoFilled field. Letting browser handle native clear.`);
      //   inputEvent.preventDefault();
      //   return; 
      // }
      
      // -> The user pressed backspace / delete, invoke the event
      inputEvent.preventDefault();
      console.log(`\n\nuser(${this.listenerInputType}): just deleted some text.`, { keyboardEvent });
      this.evaluate(keyboardEvent, this.listenerInputType);
      return;
    }    
    
    // -> The user inserted some text, invoke the event
    if (key.length === 1) { // ? final safety check that this was a character they typed, and not a modifier key
      this.listenerInputType = 'insertText';
      console.log(`\n\nuser(${this.listenerInputType}): just pressed the ${key} key.`, { keyboardEvent });
      inputEvent.preventDefault();
      this.evaluate(keyboardEvent, this.listenerInputType);
      return;
    }
    
    // <- All other shortcuts, and modifier events (except for shift)
    if (windowOrMacCtrlPressed || keyboardEvent.altKey) {
      return;
    }
    
    // ?! disable scenarios where we don't know what will happen?
    inputEvent.preventDefault();
  }
  
  
  /** Listener for when the user pastes some text. */
  protected onPaste = (inputEvent: Event): void => {
    const pasteEvent = inputEvent as ClipboardEvent;
    
    if (inputEvent&& pasteEvent?.clipboardData) {
      const paste = pasteEvent.clipboardData.getData('text');
      this.listenerInputType = 'insertFromPaste';
      console.log(`\n\nuser(${this.listenerInputType}): just pasted some text.`, { paste, inputEvent });
      inputEvent.preventDefault();
      this.evaluate(pasteEvent, this.listenerInputType);
    }
  }
  
  
  /** Listener for when the user cuts some text. */
  protected onCut = (inputEvent: Event): void => {
    const clipboardEvent = inputEvent as ClipboardEvent;
    
    if (inputEvent) {
      this.listenerInputType = 'deleteByCut';
      
      // add the cut text to the user's clipboard
      const highlightedText = window.getSelection()?.toString(); // ! Cut events do not allow you to retrieve the selection from the event.
      navigator.clipboard.writeText(highlightedText || '');
      
      // Pass the event to the InputMask's evaluate
      console.log(`\n\nuser(${this.listenerInputType}): just cut some text.`, { inputEvent, text: highlightedText });
      const combinedEvent: any = clipboardEvent;
      combinedEvent.key = '';
      inputEvent.preventDefault();
      this.evaluate(combinedEvent, this.listenerInputType); 
    }
  }
  
  
  /** Listener to catch native browser injections like autofill before React updates */
  protected onAutoFill = (inputEvent: Event): void => {
    
    // * Event information
    const nativeEvent = inputEvent as InputEvent;
    const target = inputEvent.target as HTMLInputElement;
    
    // * Potential autofill information
    const inputValue = target.value;
    const currUpdate = this.history.get() || {} as any;
    const { inputActionType, curStart, curEnd, rawValue, maskedValue } = currUpdate;
    const hasAutofillSel = target.matches(':autofill') || target.matches(':-webkit-autofill'); 
    
    // ! Note: These events are ran when we call handleEventLogic(), and can cause an infinite loop where our data isn't updated or persisted (using history to fix this)
    // console.log(`\n(nativeInputEvent) during ${this.listenerInputType} -  Checking if this was an autofill event: data: `, 
    //   { inputValue, rawInput: this.rawInputValue, cachedInput: this.getCachedInputValue(), hasAutofillSel, historyActionType: inputActionType, currListenerType: this.listenerInputType },
    //   `\n history: `, {  _history: this.history, id: this.history.currentId, rawValue, maskedValue, curStart, curEnd }
    // );
    
    
    // ? Browser Input Autofill Add - Overwrite the value and store it in the history event
    const isValidAutoFill = hasAutofillSel && inputValue && inputValue != this.rawInputValue;
    const prevActionWasAutofill = inputActionType == 'insertReplacementText';
    if (isValidAutoFill && !prevActionWasAutofill) {
      this.listenerInputType = 'insertReplacementText'; 
      const customEvent: InputEvent & { text?: string } = nativeEvent;
      customEvent.text = inputValue;
      
      // inputEvent.stopPropagation();
      inputEvent.preventDefault();
      console.warn(`Autofill(add) event, persisting to evaluate: `, { inputValue, customEvent });
      this.evaluate(customEvent, this.listenerInputType); // ! this will trigger an onChange, and browser behavior can become sporadic
      return;
    }
    
    
    // {} Instead of programmatically checking specific scenarios, let's use our own internal state tracking
    // ? Browser Input Autofill Deletion - All text was removed, check if the input contents magically disappeared
    const prevUpdate = this.history.get(this.history.currentId - 1); // the history just updated, and the pointer is stored for the next instance
    const userRemovedAllText = !!currUpdate && !!prevUpdate && !!prevUpdate.rawValue && rawValue == ''; 
    const textHasBeenEmpty = (!!currUpdate && !!prevUpdate) && prevUpdate.rawValue == '' && rawValue == '';
    // console.log(`autofill(clear): checking whether to run the clear autofill event`, 
    //   `\n data: `, { inputVal: target.value, prevVal: prevUpdate?.rawValue, currentVal: rawValue },
    //   `\n rawCalcs: `, { userRemovedAllText, textHasBeenEmpty, noTargetVal: !target.value },
    //   `\n state: `, { currentStateEmpty: !rawValue, prevStateEmpty: !prevUpdate?.rawValue, current: currUpdate, prev: prevUpdate },
    // );
    if (!inputValue && !userRemovedAllText && !textHasBeenEmpty) { 
      this.listenerInputType = 'deleteReplacementText'; 
      inputEvent.preventDefault();
      
      const customEvent: InputEvent & { text?: string } = nativeEvent;
      customEvent.text = inputValue;
      console.warn(`Autofill(del) event, persisting to evaluate: `, { inputValue, customEvent });
      this.evaluate(customEvent, this.listenerInputType); // ! this will trigger an onChange, and browser behavior can become sporadic
      return;
    }
    
    
    // ? Other Browser Input Autofill Deletion Detection
    // TODO - Autofill clear in google doesn't update the value until you autofill, but I don't know about other browser behavior
    if (false) { 
      // When Chrome cancels an autofill preview, it leaves the input as is.
      const isChromiumCancel = (nativeEvent.inputType === undefined || nativeEvent.inputType === '') && !inputValue;
      
      // Firefox and Edge explicitly flag structural state resets with 'historyUndo' or 'insertReplacementText'
      const isFirefoxCancel = (nativeEvent.inputType === 'historyUndo' || nativeEvent.inputType === 'insertReplacementText') && !inputValue;
      
      if (isChromiumCancel || isFirefoxCancel) {
        this.listenerInputType = 'deleteReplacementText';
        inputEvent.preventDefault();
        
        // Create custom event and forward payload
        const customEvent: InputEvent & { text?: string } = nativeEvent;
        customEvent.text = '';
        console.warn(`Verified Autofill(cancel/clear) event detected via InputEvent signature.`, { nativeEvent, isChromiumCancel, isFirefoxCancel });
        this.evaluate(customEvent, this.listenerInputType as any);
        return;
      }
    }
  }
  
  
  /** Invoked during {@link evaluate()}. Maps the specific type of event passed to us based on the input action. We tried this for easy type assertions, it's okay. */
  protected handleUserInputEvent( ...[actionType, event]:
    | [ listenerInputType: Extract<InputActionType, 'insertText'>,            event: KeyboardEvent, ]
    | [ listenerInputType: Extract<InputActionType, 'insertFromPaste'>,       event: ClipboardEvent, ]
    | [ listenerInputType: Extract<InputActionType, 'deleteContentBackward'>, event: KeyboardEvent, ]
    | [ listenerInputType: Extract<InputActionType, 'deleteContentForward'>,  event: KeyboardEvent, ]
    | [ listenerInputType: Extract<InputActionType, 'deleteByCut'>,           event: ClipboardEvent, ]
    | [ listenerInputType: Extract<InputActionType, 'insertCompositionText'>, event: KeyboardEvent, ] 
    | [ listenerInputType: Extract<InputActionType, 'historyUndo'>,           event: KeyboardEvent, ] 
    | [ listenerInputType: Extract<InputActionType, 'historyRedo'>,           event: KeyboardEvent, ] 
    | [ listenerInputType: Extract<InputActionType, 'insertReplacementText'>, event: InputEvent & { text: '' }, ] 
    | [ listenerInputType: Extract<InputActionType, 'deleteReplacementText'>, event: InputEvent & { text: '' }, ] 
    | [ listenerInputType: Extract<InputActionType, 'undefined'>,             event: Event, ] 
  ):  
    | { actionType: Extract<InputActionType, 'insertText'>,             event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'insertFromPaste'>,        event: ClipboardEvent | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'insertCompositionText'>,  event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'deleteContentBackward'>,  event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'deleteContentForward'>,   event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'deleteByCut'>,            event: ClipboardEvent | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'historyUndo'>,            event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'historyRedo'>,            event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'insertReplacementText'>,  event: InputEvent & { text: '' } | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'deleteReplacementText'>,  event: InputEvent & { text: '' } | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'undefined'>,              event: Event | undefined, insertedText: string }
  {
    // ? This just turned into a mapping of event types for each return, but I don't think this works when you pass unknown vars when it's called
    // () i.e you still have to do a if (actionType == 'insertText') for event to be of 'KeyboardEvent' type.
    
    // * Insert events 
    if (actionType == 'insertText' && event?.key) return {
      actionType, event, insertedText: event.key
    }
    if (actionType == 'insertFromPaste' && event?.clipboardData) return {
      actionType, event, insertedText: event.clipboardData.getData('text')
    }
    if (actionType == 'insertCompositionText' && event?.key) return {
      actionType, event, insertedText: event.key
    }
    
    // * Delete events
    if (actionType == 'deleteContentBackward') return {
      actionType, event, insertedText: ''
    }
    if (actionType == 'deleteContentForward') return {
      actionType, event, insertedText: ''
    }
    if (actionType == 'deleteByCut') return {
      actionType, event, insertedText: ''
    }
    
    // * History events
    if (actionType == 'historyRedo') return {
      actionType, event, insertedText: event.key
    }
    if (actionType == 'historyUndo') return {
      actionType, event, insertedText: event.key
    }
    
    // * Autofill events
    if (actionType == 'insertReplacementText' || actionType == 'deleteReplacementText') return {
      actionType, event, insertedText: event.text
    }
    
    return { actionType, event, insertedText: '' } as any;
  }
  // #endregion
  
  
}



/** A saved snapshot of the {@link InputMask}'s current state, stored in a {@link InputMaskHistory} class. */
interface InputMaskHistoryState {
  rawValue: string;
  maskedValue: string;
  curStart: number; // cursorStart
  curEnd: number; // cursorEnd
  inputActionType?: InputActionType
}

/**
 * ### **InputMaskHistory**
 * This class uses an array to limit the history stack used for undo and redo events on this input. Should be called when you update the inputMask's state
 * 
 * ----
 * **Remarks:**
 * * Any edit to the raw value will update the history and clear anything ahead of it in the stack, just like the normal undo/redo's functionality
 *   
 */
class InputMaskHistory {
  private stack: InputMaskHistoryState[] = [];
  private pointer: number = -1;
  private maxDepth: number = 100; // Limit memory usage\
  
  /** 
   * Returns the current history state, or if provided an index, the history state of the specified instance. 
   * 
   * ----
   * @param index     **History** starts at 0, and goes up to 100, from the first event all the to the current value.
   * @returns         The current {@link InputMaskHistoryState|HistoryState} or a specified index, or null if there is none.
  */
  public get(index?: number): InputMaskHistoryState | null {
    const pointer = index !== undefined ? index : this.pointer;
    if (pointer < this.stack.length && pointer >= 0) {
      return this.stack[pointer];
    }
    return null;
  }
  
  
  /** Retrieves the current index of the history state */
  public get currentId(): number {
    return this.pointer;
  }
  
  
  /** Add a new instance to the history state. This removes any history that was previously after this action. */
  public push(state: InputMaskHistoryState) {
    // Drop any "redo" states if the user types a new character mid-timeline
    if (this.pointer < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.pointer + 1);
    }
    
    // Add the state
    this.stack.push(state);
    this.pointer++;
    
    // Keep a history undo limit
    if (this.stack.length > this.maxDepth) {
      this.stack.shift();
      this.pointer--;
    }
  }
  
  
  /** Go back one action in the history state. Preserves redo until you call {@link push}. */
  public undo(): InputMaskHistoryState | null {
    if (this.pointer > 0) {
      this.pointer--;
      return this.stack[this.pointer];
    }
    return null; // Top of stack reached
  }
  
  
  /** Go forwards one action in the history state. Will return null if you're already up to date */
  public redo(): InputMaskHistoryState | null {
    if (this.pointer < this.stack.length - 1) {
      this.pointer++;
      return this.stack[this.pointer];
    }
    return null; // End of stack reached
  }
}

