import { ChangeEvent, FormEvent, RefObject } from "react";
import { Filter_NUMS_ONLY, Validate_EMAIL, Validate_PASS_HS } from "./RegExpFilters";



/** The configuration to build the mask part of an {@link InputMask} */
export type MaskConfig = {
  /** 
   * An input mask that uses underscores to represent wildcard characters that are filled from the user's input. 
   * 
   * --- 
   * **Example**  
   * ```ts
   * const phoneMask = " ( ___ ) - ___ - ____ ";
   * ```
  */
  mask: string;
  
  /** The mask's wildcard character. This is used for handling custom masks. If left undefined, the default value is "_". */
  maskWildCardCharacter: string;
  
  /** Whether we should additionally filter out any non-wildcard characters this mask uses from the user's inputted text. */
  filterNonWildCardsFromInput?: boolean;
  
  /** Whether to use the mask's template as the input's placeholder. */
  useMaskAsPlaceholder?: boolean;
}


/** For subClassing the {@link InputMask} and safely passing the props to components. */
export type MaskOpts = {
  /** The configuration for creating an `InputMask`. @note pass this in as a stable reference to prevent rerenders. */
  inputMask?: MaskConfig;
  
  /** 
   * A RegExp expression designed to `filter` the accepted characters for the input. 
   * 
   * --- 
   * **Usages**  
   * ```ts
   * const numbersOnly = /[^\d]/g; 
   * const charsNumsSpecialChars = /^[A-Za-z0-9\s!@#$%^&*()_+=\-[\]{}|;:'",.<>/?`~]+$/;
   * ```
  */
  filter?: RegExp;
  
  // Additional props added here through subclasses
}


//----------------------------------------//
// Prebuilt Mask Configurations           //
//----------------------------------------//
export const phoneMask: MaskOpts = {
  filter: Filter_NUMS_ONLY,
  inputMask: {
    mask: '(___)-___-____',
    maskWildCardCharacter: '_',
    useMaskAsPlaceholder: true,
    // filterNonWildCardsFromInput: false
  },
  
}
export const creditCardMask: MaskOpts = {
  filter: Filter_NUMS_ONLY,
  inputMask: {
    mask: '____-____-____-____',
    maskWildCardCharacter: '_',
    useMaskAsPlaceholder: true,
    // filterNonWildCardsFromInput: false
  },
}
export const creditCardExpMask: MaskOpts = {
  filter: Filter_NUMS_ONLY,
  inputMask: {
    mask: '__/__',
    maskWildCardCharacter: '_',
    useMaskAsPlaceholder: true,
    // filterNonWildCardsFromInput: false
  },
}

// Filter masks
export const emailFilter: MaskOpts = {
  filter: Validate_EMAIL
}
export const passwordFilter: MaskOpts = {
  filter: Validate_PASS_HS
}
export const numbersOnly: MaskOpts = {
  filter: Filter_NUMS_ONLY
}


/** The default wildcard character for this project's {@link InputMask} class. */
export const DEFAULT_INPUTMASK_WILDCARD = "_";

/** The metadata returned from the InputMask notifying you of what we did with the onChange event. */
export type MaskEventHandle = string | false;

/** The Input's Native Event classified inputTypes. */
export type InputActionType = 
| 'insertText' | 'insertCompositionText' | 'insertFromPaste' 
| 'deleteContentBackward' | 'deleteContentForward' | 'deleteByCut'
| 'historyUndo' | 'historyRedo';

/**
 * ### **InputMask**
 * This class allows you to add `filters` and `input masks` to your input. One caveat is that it attaches itself
 * to the **event listeners** of your input, so certain native behaviors are handled internally through here (undo/redo), while others are preserved.
 * 
 * Through **keydown**, **copy**, **paste**, and **cut** events, the InputMask captures the edits to the value, stores them in a raw value, and 
 * `filters` and/or `masks` them before directly editing the input value and calling it's respective **onChange**. This way
 * it handles mutating the data while invoking react's **rendering events**, as well as notifying libraries like **react-hook-forms** about updates.
 * 
 * ---
 * **Remarks**
 * * This uses onBeforeInput to override the default onChangeEvent logic, and pass the masked input as the value.
 * * This **only** invokes the `onChange` event **IF** it's a valid change to the mask, which includes: 
 *    1. If it's valid text that add's or removes from the `mask's format`. 
 *    2. If the text inserted wasn't filtered out from the `acceptedChars`.
 *    3. If you `pasted text` somewhere, and the masked input was re-evaluated entirely.
 *    4. If the input passed in wasn't activated from a native event's `inputType`, we will prevent the event from occurring.
 *   
 * ---
 * #### Initialization
 * ```ts
 * 
 * // Create a ref for the inputMask, and initialize it in a useEffect, or when you attach the ref itself.
 * const numbersOnly: RegExp = /[^\d]/g; 
 * const maskConfig: MaskConfig = {
 *   mask: "(___)-___-____",
 *   maskWildCardCharacter: "_",
 *   filterNonWildCardsFromInput: true
 * }; 
 * 
 * // unified ref function
 * const inputMask = UseRef<InputMask(new InputMask(maskConfig, filter));
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
 * ---
 * #### InputMask types
 *  * **Filter Only**: `InputMask(filter)`
 *  * **Mask Only**: `InputMask(maskConfig)`
 *  * **Mask + Filter**: `InputMask(maskConfig, filter)`
 * &nbsp;
 */
export class InputMask {
  // * Filter and mask
  /** A regExp expression designed to filter the accepted characters for the input. */
  protected _filter: RegExp | undefined;
  
  /** An input mask that uses wildcard characters to defined what's filled from the user's input. */
  protected _mask: string | undefined;
  
  /** The mask's wildcard character. Must be defined to determine where the wildcards are when evaluating the mask. */
  protected _maskWildcardCharacter: string | undefined;
  
  /** Whether we should additionally filter out any non-wildcard characters this mask uses from the user's inputted text. */
  protected _filterMaskChars: boolean | undefined;
  
  /** The mask's unique non-wildcard characters. If we're filtering them out from the input, they're done manually. */
  protected _maskCachedNWChars: string[] | undefined;
  
  
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
   * ---
   * #### Initialization
   * ```ts
   * const numbersOnly: RegExp = /[^\d]/g; 
   * const inputFilter = new InputMask(numbersOnly);
   * 
   * ```
   * * **note:** You need to call {@link evaluate()} in the input's onBeforeInput() event.
   * 
   * ---
   * #### Params
   * @param filter        A **RegExp** designed for filtering certain text from a string.
   */
  constructor(filter: RegExp); 
  
  
  /**
   * ### **InputMask** - Mask Only
   * This class allows you to add `filters` and `input masking` to your input using it's **onBeforeInput()** event.
   * 
   * ---
   * #### Initialization
   * ```ts
   * const maskConfig: MaskConfig = {
   *   mask: "(___)-___-____",
   *   maskWildCardCharacter: "_",
   *   filterNonWildCardsFromInput: true
   * }; 
   * const inputMask = new InputMask(maskConfig);
   * 
   * ```
   * * **note:** You need to call {@link evaluate()} in the input's onBeforeInput() event.
   * 
   * ---
   * #### Params
   * @param maskConfig    The configuration for building the inputMask
   */
  constructor(maskConfig: MaskConfig); 
  
  
  /**
   * ### **InputMask** - Mask Only
   * This class allows you to add `filters` and `input masking` to your input using it's **onBeforeInput()** event.
   * 
   * ---
   * #### Initialization
   * ```ts
   * const numbersOnly: RegExp = /[^\d]/g; 
   * const maskConfig: MaskConfig = {
   *   mask: "(___)-___-____",
   *   maskWildCardCharacter: "_",
   *   filterNonWildCardsFromInput: true
   * }; 
   * const inputMask = new InputMask(maskConfig, filter);
   * 
   * ```
   * * **note:** You need to call {@link evaluate()} in the input's onBeforeInput() event.
   * 
   * ---
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
   * ---
   * #### Initialization
   * ```ts
   * const numbersOnly: RegExp = /[^\d]/g; 
   * const maskConfig: MaskConfig = {
   *   mask: "(___)-___-____",
   *   maskWildCardCharacter: "_",
   *   filterNonWildCardsFromInput: true
   * }; 
   * 
   * const options: InputMaskOptions = {
   *   inputMask: {   // <-- InputMaskConfig
   *     mask: "(___)-___-____",
   *     maskWildCardCharacter: "_",
   *     filterNonWildCardsFromInput: true
   *   },
   *   filter: /[^\d]/g     // <-- numbers only regExp
   * };
   * const inputMask = new InputMask(maskConfig, filter);
   * 
   * ```
   * * **note:** You need to call {@link evaluate()} in the input's onBeforeInput() event.
   * 
   * ---
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
  // #endregion
  
  
  
  
  /**
   * ### InputMask::evaluate( `onBeforeInputEvent` )
   * Evaluates an input's new value from the onBeforeInput event using 
   * the native event's state and the previous value for reference.
   * 
   * ---
   * **Remarks**
   * * This uses onBeforeInput to override the default onChangeEvent logic, and pass the masked input as the value.
   * * This **only** invokes the `onChange` event **IF** it's a valid change to the mask, which includes: 
   *    1. If it's valid text that add's or removes from the `mask's format`. 
   *    2. If the text inserted wasn't filtered out from the `acceptedChars`.
   *    3. If you `pasted text` somewhere, and the masked input was re-evaluated entirely.
   *    4. If the input passed in wasn't activated from a native event's `inputType`, we will prevent the event from occurring.
   *   
   * ---
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
   * ---
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
    
    // Cached refs
    const prevRawValue = this.rawInputValue; // Right now these are technically the "current"
    const prevMaskedValue = this.maskedInputValue; // Right now these are technically the "current"
    
    // Calculated input values
    let filteredInsert = insertedText;
    const prevValue = input.value;
    let newValue = prevValue;
    
    // * logging
    console.log(`\nMaskEval::Evaluating and updating input from user event(${actionType}), maskData: `, { inputName, mask: this.mask, filter: this.filterExp, event },
      `\n native event data: `, { actionType, insertedText, [inputName]: input },
      `\n current data: `, { currentRawValue: prevRawValue, currentMaskedValue: prevMaskedValue },
      `\n cursor: `, { cursor: this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue }), cursorStart, cursorEnd, },
    );
    
    // TODO - handle copying deleted to clipboard?
    // - onCut event needs to saveToClipboard it's contents
    
    // TODO - add mask's non-wildcard characters filter to the mask's base filter functionality
    // - add filter functionality for this._maskCachedNWChars if this._filterMaskChars is true
    
    
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
          this.handleNativeEventLogic(undefined); // cancel the events
          this.updateState(prevRawValue, prevMaskedValue, cursorStart, cursorEnd); // update internal state tracking
          this.updateCursorPosition(cursorStart, cursorEnd, newValue, input);
          console.log(`Cancelled MaskEval::${actionType}: The added text was filtered out, aborting the onChange event. data: `, { insertedText, filteredInsert, filter: this.filterExp, inputName });
          return false; // input left as-is
        }
      }
      
      // ? Calc the new raw value
      const { rawCursorStart, rawCursorEnd } = this.getRawCursorFromMasked(cursorStart, cursorEnd, prevMaskedValue);
      const newRawValue = this.addToRawValue(addedText, prevRawValue, rawCursorStart, rawCursorEnd);
      
      // ? Create the masked input
      const newCursorLocation = this.getNewRawCursorLocation(rawCursorStart, rawCursorEnd, addedText.length);
      const { maskedCursorStart, maskedCursorEnd } = this.findMaskedCursorLocations(newCursorLocation, newCursorLocation);
      const newMaskValue = this.buildInputMask(newRawValue);
      
      // -> Successfully recreated the mask for single/multi insert and paste inputs
      this.handleNativeEventLogic(newMaskValue); // call the onChange w/maskInput
      this.updateState(newRawValue, newMaskValue, maskedCursorStart, maskedCursorEnd); // update internal state tracking
      this.updateCursorPosition(maskedCursorStart, maskedCursorEnd, newMaskValue, input); // after the added text
      
      // <- kelp me
      console.log(`Completed MaskEval::${actionType}: Recreated the mask for the single/multi insert, and paste actions. Event data: `, 
        { value: this.logCursorPos(maskedCursorStart, maskedCursorEnd, { maskedVal: newMaskValue }), 
        start: maskedCursorStart, end: maskedCursorEnd, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
      );
      console.log(`cursor history () data:`, 
        `\nprevRaw:   `, { cursor: this.logRawCursorPos(rawCursorStart, rawCursorEnd, prevRawValue) },
        `\nnewRaw:    `, { cursor: this.logRawCursorPos(newCursorLocation, newCursorLocation, newRawValue) },
        `\nprevMasked:`, { cursor: this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue }) },
        `\nnewMasked: `, { cursor: this.logCursorPos(maskedCursorStart, maskedCursorEnd, { maskedVal: newMaskValue }) },
      );
      return newMaskValue; 
    }
    // #endregion
    
    
    // #region - User pressed deleted via backspace, cursor single/multi selected deletion, or ctrl + x (Cut)
    // {} The user pressed deleted via backspace, cursor single/multi selected deletion, or ctrl + x (Cut)
    if (
      actionType == 'deleteContentBackward' || 
      actionType == 'deleteContentForward' || 
      actionType == 'deleteByCut'
    ) {
      // Delete by cut shouldn't evaluate if they didn't make a selection.
      if (actionType == 'deleteByCut' && cursorStart == cursorEnd) {
        this.handleNativeEventLogic(undefined); // cancel the events
        this.updateState(prevRawValue, prevMaskedValue, cursorStart, cursorEnd); // update internal state tracking
        this.updateCursorPosition(cursorStart, cursorEnd, newValue, input);
        console.log(`Cancelled MaskEval::${actionType}: The user inputted a cut event without a selection: `, { inputName });
        return false;
      }
      
      // ? Calc the new raw value
      const { rawCursorStart, rawCursorEnd } = this.getRawCursorFromMasked(cursorStart, cursorEnd, prevMaskedValue);
      const removedChars = this.getRemovedCharacterCount(rawCursorStart, rawCursorEnd);
      const newRawValue = this.removeFromRawValue(prevRawValue, rawCursorStart, rawCursorEnd, removedChars, actionType);
      
      // ? Create the masked input
      const newCursorLocation = this.getNewRawCursorLocation(rawCursorStart, rawCursorEnd, removedChars, actionType);
      const { maskedCursorStart, maskedCursorEnd } = this.findMaskedCursorLocations(newCursorLocation, newCursorLocation);
      const newMaskValue = this.buildInputMask(newRawValue);
      
      // -> Successfully recreated the mask for single/multi insert and paste inputs
      this.handleNativeEventLogic(newMaskValue); // call the onChange w/maskInput
      this.updateState(newRawValue, newMaskValue, maskedCursorStart, maskedCursorEnd); // update internal state tracking
      this.updateCursorPosition(maskedCursorStart, maskedCursorEnd, newMaskValue, input); 
      console.log(`Completed MaskEval::${actionType}: Recreated the mask for the delete event. Data: `, 
        { value: this.logCursorPos(maskedCursorStart, maskedCursorEnd, { maskedVal: newMaskValue }), 
        start: maskedCursorStart, end: maskedCursorEnd, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
      );
      console.log(`cursor history () data:`, 
        `\nprevRaw:   `, { cursor: this.logRawCursorPos(rawCursorStart, rawCursorEnd, prevRawValue) },
        `\nnewRaw:    `, { cursor: this.logRawCursorPos(newCursorLocation, newCursorLocation, newRawValue) },
        `\nprevMasked:`, { cursor: this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue }) },
        `\nnewMasked: `, { cursor: this.logCursorPos(maskedCursorStart, maskedCursorEnd, { maskedVal: newMaskValue }) },
      );
      return newMaskValue; 
    }
    // #endregion
    
    
    // #region - Undo and Redo events
    // {} use the InputMaskHistory to retrieve the previous history's value
    if (actionType == 'historyUndo' || actionType == 'historyRedo') {
      let prevState: InputMaskHistoryState| null;
      if (actionType == 'historyUndo') prevState = this.history.undo();
      else prevState = this.history.redo();
      
      // -> Update the input with the undo/redo, if there is one
      if (prevState) {
        console.log('there was a undo/redo state! data: ', prevState);
        const { rawInputValue, maskedInputValue, selectionStart, selectionEnd } = prevState;
        this.handleNativeEventLogic(maskedInputValue); // call the onChange w/maskInput
        this.updateState(rawInputValue, maskedInputValue, selectionStart, selectionEnd, false);
        this.updateCursorPosition(selectionStart, selectionEnd, maskedInputValue, input); 
        return maskedInputValue;
      } else {
        console.log('missing unto/redo state! data: ', { prevState, current: {  prevRawValue, prevMaskedValue, cursorStart, cursorEnd } });
        this.handleNativeEventLogic(prevMaskedValue); // call the onChange w/maskInput
        this.updateState(prevRawValue, prevMaskedValue, cursorStart, cursorEnd, false);
        this.updateCursorPosition(cursorStart, cursorEnd, prevMaskedValue, input); 
        return prevMaskedValue;
      }
    }
    // #endregion
    
    
    // ! Fallback: we don't want to break the mask input, so just prevent this event from occurring
    console.error(`MaskEval::InputMask(${this.mask}) encountered an error while evaluating the mask on a keypress.`,
      `\n The previous input entry's actionType was ${actionType}, returning the event unaffected: `, { prevRawValue, prevMaskedValue, insertedText, inputName },
      `\n Event data: `, { input, event },
    );
    
    this.handleNativeEventLogic(undefined); // prevent the event from editing the mask's value
    return false;
  }
  
  
  
  
  //--------------------------------//
  // Primary Functions              //
  //--------------------------------//
  // #region Primary Functions
  /**
   * Uses the **mask's** cursor locations to find the locations for the **raw input** by counting it's **non-wildcard** template characters.
   * 
   * ---
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
      if (this._maskCachedNWChars?.includes(maskChar)) {
        nonWildcards++;
      }
      
      // Remove empty spaces from the raw input's index
      if (maskChar == wildcard && i < mask.length) {
        emptySpaces++;
      }
    }
    
    console.log(`getRawCursorFromMasked() cursorInformation:`, { mStart, mEnd, rawCursorStart, rawCursorEnd },
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
   * ---
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
   * ---
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
   * Calculates the new **raw cursor** location from the current and the edit.
   * * **note** if there was highlighted text, we start from the cursor's start location, and add the difference from the removed/pasted characters.
   * 
   * ---
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
   * ---
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
   * ---
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
   * ---
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
    if (!this.mask /* !mask */ || !wildcard) {
      console.error(`Calling findMaskedCursorLocation on an input mask that only filter's it's input! Pass in params or initialize the mask!`, { mask, wildcard });
      return { } as any;
    }
    
    // Just make a hashmap
    const wildcardMap: Map<number, number> = new Map();
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
   * ---
   * @param rawInputValue           The input value without the mask applied.
   * @param maskedInputValue        The masked input value.
   * @param selectionStart          The **cursor's** start location.
   * @param selectionEnd            The **cursor's** end location.
   */
  protected updateState(rawInputValue: string, maskedInputValue: string, selectionStart: number, selectionEnd: number, updateHistory: boolean = true): void {
    this.rawInputValue = rawInputValue;
    this.maskedInputValue = maskedInputValue;
    if (updateHistory) {
      this.history.push({ rawInputValue, maskedInputValue, selectionStart, selectionEnd });
    }
    console.log(`UpdateState() InputMaskState: `, { rawInputValue, maskedInputValue });
  }
  // #endregion
  
  
  
  
  //--------------------------------//
  // Filter                         //
  //--------------------------------//
  // #region Filter Functions
  /**
   * Uses a RegExp expression to `filter` out any unwanted characters to a string.
   * 
   * ---
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
   * ---
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
    // .replace replaces every matching bad character with an empty string
    
    const filteredChars = charsToFilter.replace(filterExp, "");
    // console.log(`filter() finished, data: `, { filteredVal: filteredChars, chars, filterExp });
    return filteredChars;
  }
  
  
  /**
   * Whether we have the `filter` enabled or valid.
   * 
   * ---
   * @returns       Whether the filter is defined
   */
  protected isFilterEnabled(): boolean {
    return !!this.filterExp;
  }
  
  
  /**
   * Retrieves the accepted characters expression. Any character is accepted if left undefined.
   *   
   * ---
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
   * ---
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
   * ---
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
   * ---
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
   * ---
   * @returns       The mask that we're currently using for this mask, or undefined if we're only using the class to filter characters.
   */
  public get mask(): string {
    return this._mask || "";
  }
  
  
  /**
   * Retrieves the mask's wildcard character. Will return an empty string if the class is not using a mask.
   * @note This can be undefined, and you should use `isMaskEnabled()` before using.
   * 
   * ---
   * @returns       Whether the mask is enabled / valid
   */
  public get wildcard(): string {
    return this._maskWildcardCharacter || "";
  }
  
  
  /**
   * Sets the `input mask`, and initializes it's dependent properties for the input mask's {@link evaluate()} function to work properly. 
   * It is essential to call this function every time you're updating the **{@link InputMask}**.
   * 
   * **Note:** This function sets the values of the {@link _mask|mask}, 
   *  {@link _maskWildcardCharacter|maskWildcardCharacter}, and {@link _maskCachedNWChars|maskCachedNWChars}. Which are all used in various functions of this class
   *   
   * ---
   * @Example
   * ```ts
   * const phoneMask = '(___) - ___ - ____';
   * const maskWildcard = '_';
   * 
   * inputMask.setMask(phoneMask, maskWildcard);
   * console.log(inputMask.getMask()); // Returns: '(___) - ___ - ____';
   * 
   * 
   * ```
   * 
   * ---
   * @param newMask     The new **mask** for this class.
   * @param wildcard    If you're using a custom **wildcard** (not "**_**"), then define it here.
   * 
   * @returns       The mask that we're currently using for this mask, or undefined if we're only using the class to filter characters.
   */
  public setMask(config: MaskConfig): void {
    const newMask = config.mask;
    const wildcard = config.maskWildCardCharacter;
    const filterMaskChars = config.filterNonWildCardsFromInput; // TODO - add this logic to the mask's filter functionality
    
    
    // ? Update the mask's state
    this._mask = newMask;
    this._maskWildcardCharacter = wildcard || DEFAULT_INPUTMASK_WILDCARD;
    
    // Update the mask's dependent information
    if (this.mask && this._maskWildcardCharacter) {
      this._maskCachedNWChars = this.getNonWildcardChars(this.mask, this._maskWildcardCharacter);
      this._filterMaskChars = filterMaskChars;
    }
  }
  
  
  /**
   * Returns a string displaying the location of the cursor on a maskedInput value.
   * @note This doesn't call **console.log**, it returns the string to be passed to it.
   * 
   * ---
   * @param start   The mask's cursor **start** location.
   * @param end     The mask's cursor **end** location. 
   * @param opts    Optional values to **autofill** the mask with the current value, and for custom masks.
   * 
  * @returns       Whether the mask is enabled / valid
   */
  protected logCursorPos(start: number, end: number, opts?: { mask?: string, wildcard?: string, maskedVal?: string, rawVal?: string } ): string {
    const mask = opts?.mask || this.mask;
    const wildcard = opts?.wildcard || this.wildcard;
    if (!mask || !wildcard) {
      console.error(`logCursorPosition() is missing properties to display the cursor location. Data: `, { mask, wildcard, start, end });
      return 'CursorLogError';
    }
    
    // ? Option to display the current value
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
    
    // ? actual logic
    const isHighlighted = start != end;
    const beforeCursorStart = maskRef.substring(0, start);
    const selection = maskRef.substring(start, end); // either the cursor location '', or the highlighted selection.
    const afterCursorEnd = maskRef.substring(end);
    
    if (isHighlighted) return [beforeCursorStart, '|', selection, '|', afterCursorEnd].join("");
    else               return [beforeCursorStart, '|', afterCursorEnd].join("");
  }
  
  
  /**
   * Returns a string displaying the location of the cursor on a rawInput value.
   * @note This doesn't call **console.log**, it returns the string to be passed to it.
   * 
   * ---
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
  
  
  /**
   * Captures all non-wildcard characters from a mask, and stores them in an array.
   * 
   * ---
   * @param mask            The input mask template string
   * @param wildcard        The input mask's wildcard character.
   * 
   * @returns              An array of all the mask's unique characters.
   */
  protected getNonWildcardChars(mask: string, wildcard: string): string[] {
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
  // #endregion
  
  
  
  //--------------------------------//
  // Input Event Functions          //
  //--------------------------------//
  // #region Input Event Functions
  /**
   * Update the **cursor's** location for a specific input element. 
   * 
   * ---
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
   * ---
   * @param event             The onBeforeInput event we're interacting with.
   * @param preventDefault    Whether we want to prevent `onBeforeInput` from inserting characters into the input.
   * @param invokeOnChange    invokes the input's `onChange` with a new value. Leave `undefined` to skip.
   */
  protected handleNativeEventLogic( 
    invokeOnChange: string | undefined = undefined, // false
    // preventDefault: boolean = true, 
  ): void {
    if (!this.inputRef) return;
    const input = this.inputRef;
    
    // ? Stop the browser from inserting the raw, unmasked characters
    // if (preventDefault) { // <- this is handled in the input's onBeforeInput() event if it's using the mask
    //   event.preventDefault();
    // }

    // ? Manually call onChange: assign the masked value to the element
    if (invokeOnChange !== undefined) {
      input.value = invokeOnChange; // ! Changing this property directly triggers React's internal onChange tracker
      
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
      
      console.log('this was an undo/redo event!: ', keyboardEvent);
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
    
    // ? Allow for copy and paste events
    if (windowOrMacCtrlPressed && (key == 'c' || key == 'v')) {
      return;
    }
    
    // ? Allow if the user select's all with ctrl + a
    if (windowOrMacCtrlPressed && key == 'a') {
      return;
    }
    
    // ? Allow native behavior and prevent the press for the modifiers 'alt' or 'shift'.
    if (keyboardEvent.altKey || keyboardEvent.shiftKey) {
      return;
    }
    
    // * Ignore structural navigation keys
    if ([
      'unidentified', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright',
      'tab', 'shift', 'control', 'alt', 'meta', 'escape', 'capslock'
    ].includes(key)) {
      console.log('structural nav keys, and misc');
      return;
    }
    
    // ? Captured event keys
    else if (key == 'Backspace') this.listenerInputType = 'deleteContentBackward';
    else if (key == 'Delete')    this.listenerInputType = 'deleteContentForward';
    else  /*(key == 'anyKey')*/  this.listenerInputType = 'insertText';
    
    console.log(`\n\nuser(${this.listenerInputType}): just pressed the ${key} key`, { keyboardEvent });
    inputEvent.preventDefault();
    this.evaluate(keyboardEvent, this.listenerInputType);
  }
  
  
  /** Listener for when the user pastes some text. */
  protected onPaste = (inputEvent: Event): void => {
    const pasteEvent = inputEvent as ClipboardEvent;
    
    if (inputEvent&& pasteEvent?.clipboardData) {
      const paste = pasteEvent.clipboardData.getData('text');
      this.listenerInputType = 'insertFromPaste';
      console.log(`\n\nuser(${this.listenerInputType}): just pasted some text`, { paste, inputEvent });
      inputEvent.preventDefault();
      this.evaluate(pasteEvent, this.listenerInputType);
    }
  }
  
  
  /** Listener for when the user cuts some text. */
  protected onCut = (inputEvent: Event): void => {
    const clipboardEvent = inputEvent as ClipboardEvent & any;
    
    if (inputEvent && clipboardEvent.clipboardData) {
      this.listenerInputType = 'deleteByCut';
      clipboardEvent.key = '';
      console.log(`\n\nuser(${this.listenerInputType}): just cut some text`, { inputEvent });
      inputEvent.preventDefault();
      this.evaluate(clipboardEvent, this.listenerInputType); // TODO - handle copying deleted to clipboard?
    }
  }
  
  
  /** Invokes {@link evaluate() which then calculates the new masked input value and calls the onChange event.} */
  protected handleUserInputEvent( ...[actionType, event]:
    | [ listenerInputType: Extract<InputActionType, 'insertText'>,            event: KeyboardEvent, ]
    | [ listenerInputType: Extract<InputActionType, 'insertFromPaste'>,       event: ClipboardEvent, ]
    | [ listenerInputType: Extract<InputActionType, 'deleteContentBackward'>, event: KeyboardEvent, ]
    | [ listenerInputType: Extract<InputActionType, 'deleteContentForward'>,  event: KeyboardEvent, ]
    | [ listenerInputType: Extract<InputActionType, 'deleteByCut'>,           event: ClipboardEvent, ]
    | [ listenerInputType: Extract<InputActionType, 'insertCompositionText'>, event: KeyboardEvent, ] 
    | [ listenerInputType: Extract<InputActionType, 'historyUndo'>, event: KeyboardEvent, ] 
    | [ listenerInputType: Extract<InputActionType, 'historyRedo'>, event: KeyboardEvent, ] 
  ):  
    | { actionType: Extract<InputActionType, 'insertText'>,             event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'insertFromPaste'>,        event: ClipboardEvent | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'insertCompositionText'>,  event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'deleteContentBackward'>,  event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'deleteContentForward'>,   event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'deleteByCut'>,            event: ClipboardEvent | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'historyUndo'>,   event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'historyRedo'>,   event: KeyboardEvent  | undefined, insertedText: string }
  {
    // ? This just turned into a mapping of event types for each return, but I don't think this works when you pass unknown vars when it's called
    // () i.e you still have to do a if (actionType == 'insertText') for event to be of 'KeyboardEvent' type.
    if (actionType == 'insertText' && event?.key) return {
      actionType, event, insertedText: event.key
    }
    if (actionType == 'insertFromPaste' && event?.clipboardData) return {
      actionType, event, insertedText: event.clipboardData.getData('text')
    }
    if (actionType == 'insertCompositionText' && event?.key) return {
      actionType, event, insertedText: event.key
    }
    if (actionType == 'deleteContentBackward') return {
      actionType, event, insertedText: ''
    }
    if (actionType == 'deleteContentForward') return {
      actionType, event, insertedText: ''
    }
    if (actionType == 'deleteByCut') return {
      actionType, event, insertedText: ''
    }
    if (actionType == 'historyRedo') return {
      actionType, event, insertedText: event.key
    }
    if (actionType == 'historyUndo') return {
      actionType, event, insertedText: event.key
    }
    
    return { actionType, event, insertedText: '' } as any;
  }
  // #endregion
  
  
}



/** A saved snapshot of the {@link InputMask}'s current state, stored in a {@link InputMaskHistory} class. */
interface InputMaskHistoryState {
  rawInputValue: string;
  maskedInputValue: string;
  selectionStart: number; // cursorStart
  selectionEnd: number; // cursorEnd
}

/**
 * ### **InputMaskHistory**
 * This class uses an array to limit the history stack used for undo and redo events on this input. Should be called when you update the inputMask's state
 * 
 * ---
 * **Remarks**
 * * Any edit to the raw value will update the history and clear anything ahead of it in the stack, just like the normal undo/redo's functionality
 *   
 */
class InputMaskHistory {
  private stack: InputMaskHistoryState[] = [];
  private pointer: number = -1;
  private maxDepth: number = 100; // Limit memory usage

  // Save a new step
  public push(state: InputMaskHistoryState) {
    // Drop any "redo" states if the user types a new character mid-timeline
    if (this.pointer < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.pointer + 1);
    }

    // Add the state
    this.stack.push(state);
    this.pointer++;

    // Enforce max memory depth limit
    if (this.stack.length > this.maxDepth) {
      this.stack.shift();
      this.pointer--;
    }
  }

  // Look back
  public undo(): InputMaskHistoryState | null {
    if (this.pointer > 0) {
      this.pointer--;
      return this.stack[this.pointer];
    }
    return null; // Top of stack reached
  }

  // Look forward
  public redo(): InputMaskHistoryState | null {
    if (this.pointer < this.stack.length - 1) {
      this.pointer++;
      return this.stack[this.pointer];
    }
    return null; // End of stack reached
  }
}

