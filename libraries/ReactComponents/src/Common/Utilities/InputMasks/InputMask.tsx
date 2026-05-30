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




/** The metadata returned from the InputMask notifying you of what we did with the onChange event. */
export type MaskEventHandle = string | false;

/** The Input's Native Event classified inputTypes. */
export type InputActionType = 
| 'insertText' | 'insertCompositionText' | 'insertFromPaste' 
| 'deleteContentBackward' | 'deleteContentForward' | 'deleteByCut';


/**
 * ### **InputMask**
 * This class allows you to add `filters` and `input masking` to your input using it's **onBeforeInput()** event.
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
 * const numbersOnly: RegExp = /[^\d]/g; 
 * const maskConfig: MaskConfig = {
 *   mask: "(___)-___-____",
 *   maskWildCardCharacter: "_",
 *   filterNonWildCardsFromInput: true
 * }; 
 * const inputMask = new InputMask(maskConfig, filter);
 * const inputValue = "1112223333"; 
 * // Usage: call evaluate() in the **onBeforeInput** event
 * // Expected output: "(111)-222-3333" 
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
  
  /** The mask's unique non-wild characters. If we're filtering them out from the input, they're done manually. */
  protected _maskCachedNWChars: string[] | undefined;
  
  
  // * Cached values
  /** The raw input value without the mask. @note this still applies the filter. */
  protected rawInputValue: string;
  
  /** The cached input value after applying the mask. */
  protected maskedInputValue: string;
  
  
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
      this._mask = config.mask;
      this._maskWildcardCharacter = config.maskWildCardCharacter;
      this._filterMaskChars = config.filterNonWildCardsFromInput;
      if (this._filterMaskChars && this._mask && this._maskWildcardCharacter) {
        this._maskCachedNWChars = this.getNonWildcardChars(this._mask, this._maskWildcardCharacter);
      }
    }
    
    this.rawInputValue = '';
    this.maskedInputValue = '';
    this.addedEventListeners = false;
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
    const prevRawValue = this.rawInputValue;
    const prevMaskedValue = this.maskedInputValue;
    
    // Calculated input values
    let filteredInsert = insertedText;
    const prevValue = input.value;
    let newValue = prevValue;
    
    // * logging
    console.log(`\n\nMaskEval::Evaluating and updating input from user event(${actionType}), maskData: `, { inputName, mask: this.mask, filter: this.filterExp, event },
      `\n native event data: `, { actionType, insertedText, [inputName]: input },
      `\n current data: `, { currentRawValue: prevRawValue, currentMaskedValue: prevMaskedValue },
      `\n cursor: `, { cursor: this.logCursorPos(cursorStart, cursorEnd, { maskedVal: prevMaskedValue }), cursorStart, cursorEnd, },
    );
    
    
    // #region - User typed or pasted something
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
          this.updateState(prevRawValue, prevMaskedValue); // update internal state tracking
          this.updateCursorPosition(input, cursorStart, cursorEnd, newValue, 0);
          console.log(`Cancelled MaskEval::${actionType}: The added text was filtered out, aborting the onChange event. data: `, { insertedText, filteredInsert, filter: this.filterExp, inputName });
          return false; // input left as-is
        }
      }
      
      // ? Calc the new raw value
      const { rawCursorStart, rawCursorEnd } = this.getRawCursorFromMasked(cursorStart, cursorEnd);
      const newRawValue = this.addToRawValue(addedText, prevRawValue, rawCursorStart, rawCursorEnd);
      
      // ? Create the masked input
      const newCursorLocation = this.getNewRawCursorLocation(rawCursorStart, rawCursorEnd, addedText.length); // redundant
      const { maskedCursorStart, maskedCursorEnd } = this.findMaskedCursorLocations(newCursorLocation, newCursorLocation);
      const newMaskValue = this.buildInputMask(newRawValue);
      
      // -> Successfully recreated the mask for single/multi insert and paste inputs
      this.handleNativeEventLogic(newMaskValue); // call the onChange w/maskInput
      this.updateState(newRawValue, newMaskValue); // update internal state tracking
      this.updateCursorPosition(input, maskedCursorStart, maskedCursorEnd, newMaskValue, addedText.length, 0); // after the added text
      
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
    if (
      actionType == 'deleteContentBackward' || 
      actionType == 'deleteContentForward' || 
      actionType == 'deleteByCut'
    ) {
      
      // * update the raw value
      let newRawValue = '';
      let start = cursorStart;
      let end = cursorEnd;
      let maskNonWCChars = 0; // mask chars between the selection (non-wildcard)
      const deletionCount = (end - start) > 0 ? (end - start) : 1;
      if (this.isMaskEnabled()) {
        const { startOffset, endOffset } = this.getRawCursorLocation(start, end);
        // offsets for the cursor location after removing the mask parts of the string
        start = cursorStart - startOffset;
        end = cursorEnd - endOffset;
        maskNonWCChars = endOffset - startOffset;
      }
      
      // * update the raw value
      newRawValue = this.removeFromRawValue(prevRawValue, start, end, actionType);
      const newMaskValue = this.buildInputMask(newRawValue);
      
      // -> Successfully recreated the mask for single/multi insert and paste inputs
      this.handleNativeEventLogic(newMaskValue); // call the onChange w/maskInput
      this.updateState(newRawValue, newMaskValue); // update internal state tracking
      
      // back one, or remove highlight
      const startAfterDeletion = deletionCount == 1 ? cursorStart - 1 : cursorStart; 
      const endAfterDeletion = deletionCount == 1 ? startAfterDeletion : cursorStart;
      this.updateCursorPosition(input, startAfterDeletion, endAfterDeletion, newMaskValue, 0, maskNonWCChars); 
      console.log(`MaskEval::Completed - Recreated the mask for a delete event. Event data: `, 
        { newRawValue, newMaskValue, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled(), inputName },
        `\n Cursor specific tracking: `, { cursor: { start, end }, maskNonWildCardChars: maskNonWCChars },
      );
      return newMaskValue; 
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
   * @param mStart          The mask's cursor start location
   * @param mEnd            The mask's cursor end location
   * 
   * @returns               A destructurable object that contains the `rawCursorStart` and `rawCursorEnd`.
   */
  protected getRawCursorFromMasked(mStart: number, mEnd: number, opts?: { mask?: string, wildcard?: string }): { rawCursorStart: number, rawCursorEnd: number } {
    const mask = opts?.mask || this.mask;
    const wildcard = opts?.wildcard || this.wildcard;
    if (!mask || !wildcard) {
      console.error(`getRawCursorFromMasked() is missing properties to find the rawCursorLocation. Data: `, { mask, wildcard, mStart, mEnd });
      return { rawCursorStart: mStart, rawCursorEnd: mEnd };
    }
    
    // Capture the non-wildcard characters up to each index and subtract them.
    let rawCursorStart = mask.length;
    let rawCursorEnd = mask.length;
    let nonWildcards = 0;
    for (let i = 0; i < mask.length; i++) {
      const maskChar = mask[i];
      
      if (mStart == i) rawCursorStart = i - nonWildcards;
      if (mEnd == i) rawCursorEnd = i - nonWildcards;
      
      if (maskChar != wildcard) {
        nonWildcards++;
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
   *  * `Filter only`: It additively inserts the text based on the cursor's location or selection. Just like the `native` behavior.
   *  * `Mask`: It will `overwrite` the text in the current selection. Will add wildcards in empty spaces from a highlight + paste combination.
   * 
   * **Note:** This preserve's the placement of the text for mask variations on highlighted multi select inserts, and will overwrite extra characters based on the paste.
   * 
   * ---
   * @param inserted              The user's inserted text, whether it was a single key, a selection and a key or a paste.
   * @param cursorStart           The cursor's start location.
   * @param cursorEnd             The cursor's end location.
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
      // insert & append the characters to existing raw value
      const beforeCursor = prevValue.substring(0, cursorStart);
      const cursorSel = inserted;
      const rawAfterCursor = prevValue.substring(cursorEnd); // the actual value
      const afterCursor = rawAfterCursor.substring(inserted.length); // handles both single and highlighted inputs
      newRawValue = beforeCursor + cursorSel + afterCursor;
      
      // -> Calculate and return the new cursor position from the edit;
      const clampedRawValue = newRawValue.substring(0, maxLength);
      console.log(`addToRawValue() insertLogic:`, { clampedRawValue, beforeCursor, cursorSel, afterCursor, newRawValue });
      return clampedRawValue;
    }
  }
  
  
  /**
   * Delete the raw value's characters just like the native event.
   * 
   * **Note:** Uses the cursor's `selection` to determine what's deleted.
   * 
   * ---
   * @param prevValue             The input's current value without the mask applied.
   * @param cursorStart           The cursor's start location.
   * @param cursorEnd             The cursor's end location.
   * @returns                     The new raw input value.
   */
  protected removeFromRawValue(prevValue: string, cursorStart: number, cursorEnd: number, actionType: InputActionType): string {
    if (prevValue === undefined) return '';
    if (cursorStart > cursorEnd) {
      console.error(`removeFromRawValue(${prevValue}): An error occurred from one of the inputMask calculations, invalid input data: `, { prevValue, cursorStart, cursorEnd });
      return prevValue;
    }
    
    const isMultipleCharacters = (cursorEnd - cursorStart) > 0;
    if (isMultipleCharacters) {
      const firstHalf = prevValue.substring(0, cursorStart);
      const secondHalf = prevValue.substring(cursorEnd);
      
      console.log(`removeFromRawValue::multi(${actionType}) - Completed, data: `, 
        { prevValue, newValue: firstHalf + secondHalf, cursorStart, cursorEnd, firstHalf, secondHalf });
      return firstHalf + secondHalf;
    }
    
    // handle deleting the value
    const deleteIndex = actionType == 'deleteContentForward' ? cursorStart : cursorStart - 1;
    if (deleteIndex < 0) { // Guard against out-of-bounds backspace at the very beginning of the input
      console.log(`removeFromRawValue::single(${actionType}) - Cancelled, deleted at zero index: `, {sameValue: prevValue, deleteIndex, cursorStart, cursorEnd});
      return prevValue;
    } 
    
    const firstHalf = prevValue.substring(0, deleteIndex);
    const secondHalf = prevValue.substring(deleteIndex + 1);
    
    console.log(`removeFromRawValue::single(${actionType}) - Completed, data: `, 
      { prevValue, newValue: firstHalf + secondHalf, deleteIndex, firstHalf, secondHalf });
    return firstHalf + secondHalf;
  }
  
  
  /**
   * Calculates the new **raw cursor** location from the current and the edit.
   * * **note** if there was highlighted text, we start from the cursor's start location, and add the difference from the removed/pasted characters.
   * 
   * ---
   * @param rawCursorStart          The mask's cursor start location
   * @param rawCursorEnd            The mask's cursor end location
   * @param diff                    The added/subtracted characters. For inserts/deletes, it's the **count**. For a paste, it's the difference from the **highlighted text**
   * 
   * @returns               the calculated `newRawCursorLocation`.
   */
  protected getNewRawCursorLocation(rawCursorStart: number, rawCursorEnd: number, diff: number): number {
    let newCursorLocation = 0;
    const isHighlighted = rawCursorStart != rawCursorEnd;
    
    if (!isHighlighted) newCursorLocation = rawCursorStart + diff;
    else {
      // 012345
      // 01X2345 + 6
      // 0|1234|5 + 66
      const selectionLength = rawCursorEnd - rawCursorStart;
      // const highlightedDiff = 
    }
    return rawCursorStart + diff;
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
    
    // console.log(`buildInputMask finished: `, { newMaskValue, rawValue });
    return newMaskValue;
  }
  
  
  /** Updates the raw cursor locations with the mask's template values so it's in sync with the masked input value. */
  protected findMaskedCursorLocations(rawCursorStart: number, rawCursorEnd: number, mask?: string, wildcard?: string): { maskedCursorStart: number, maskedCursorEnd: number } {
    if (!mask) mask = this.mask;
    if (!wildcard) wildcard = this.wildcard;
    if (!this.mask /* !mask */ || !wildcard) {
      console.error(`Calling findMaskedCursorLocation on an input mask that only filter's it's input! Pass in params or initialize the mask!`, { mask, wildcard });
      return { } as any;
    }
    
    // Just make a hashmap
    const wildcardMap: Map<number, number> = new Map();
    let rawCursorIndex: number = 0;
    for (let i = 0; i < mask.length; i++) {
      const maskChar = mask[i];
      if (maskChar == wildcard) {
        wildcardMap.set(rawCursorIndex, i);
        rawCursorIndex++;
      }
    }
    
    // -> Return the masked cursor locations
    let maskedCursorStart = wildcardMap.get(rawCursorStart) || mask.length;
    let maskedCursorEnd = wildcardMap.get(rawCursorEnd) || mask.length;
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
   */
  protected updateState(rawInputValue: string, maskedInputValue: string): void {
    this.rawInputValue = rawInputValue;
    this.maskedInputValue = maskedInputValue;
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
   * @returns              Whether the mask is enabled / valid
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
   * Uses the mask to find the cursor locations for the raw input by counting it's non-wildcard template characters.
   * 
   * ---
   * @param cursorStart    The cursor's start location
   * @param cursorEnd      The cursor's end location
   * 
   * @returns              A destructurable object that contains the offsets for the cursor's start and end locations.
   */
  protected getRawCursorLocation(cursorStart: number, cursorEnd: number): { startOffset: number, endOffset: number; } {
    let startOffset: number = 0;
    let endOffset: number = 0;
    
    // Loop through the mask and find the cursor's start/end locations for the raw value
    for (let i = 0; i < this.mask.length; i++) {
      const maskChar = this.mask[i];
      if (i < cursorStart && maskChar !== this.wildcard) startOffset++;
      if (i < cursorEnd && maskChar !== this.wildcard) endOffset++;
      if (i >= cursorEnd) break;
    }
    
    return { startOffset, endOffset };
  }
  
  
  
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
   * Update the cursor's `location` based on 
   * how much was highlighted versus how much we added, 
   * and offset by the `mask's` characters (non-wildcard).
   * 
   * ---
   * 
   * ### Equation  
   *  * CursorStart +  ( selection - (selection - insertedCharCount) + masksNonWildCardChars )  
   * 
   * ---
   * @param input         A reference to the input to update the cursor's location.
   * @param newValue      The updated value that we're passing to the `onChange`.
   * @param prevValue     The current or previous value for this input.
   * @param cursorStart   The cursor's location, or the highlighted selection's starting location.
   * @param cursorEnd     The highlighted selection's end location, or the same as cursorStart.  
   * 
   * @returns             The filtered version of the value.
   */
  protected updateCursorPosition(
    input: HTMLInputElement | HTMLTextAreaElement,
    cursorStart: number, cursorEnd: number, newValue:string,
    insertedCharCount: number, maskNonWCChars: number = 0
  ): void {
    // ? How much was highlighted versus how much we added, offset by the mask's characters (non-wildcard)
    // const selectionLength = cursorEnd - cursorStart;
    // const addedTextOffset = selectionLength - (selectionLength - insertedCharCount) + maskNonWCChars;
    // const newCursorPos = Math.min( Math.max(0, 
    //   cursorStart + addedTextOffset),
    //   newValue.length
    // );
    const newCursorPos = Math.min( Math.max(0, 
      cursorStart),
      newValue.length
    );
    
    input.setSelectionRange(newCursorPos, newCursorPos);
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
  protected onKeyPress = (e: Event): void => {
    const keyboardEvent = e as KeyboardEvent;
    const key = keyboardEvent?.key;
    if (!e || !key) return;
    
    // * Keys to ignore
    if (['Unidentified', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(key)) return;
    
    // * Captured event keys
    else if (key == 'Backspace') this.listenerInputType = 'deleteContentBackward';
    else if (key == 'Delete')    this.listenerInputType = 'deleteContentForward';
    else  /*(key == 'anyKey')*/  this.listenerInputType = 'insertText';
    
    this.evaluate(keyboardEvent, this.listenerInputType);
    console.log(`\nuser(${this.listenerInputType}): just pressed the ${key} key`, { keyboardEvent });
  }
  
  
  /** Listener for when the user pastes some text. */
  protected onPaste = (e: Event): void => {
    const pasteEvent = e as ClipboardEvent;
    
    if (e && pasteEvent?.clipboardData) {
      const paste = pasteEvent.clipboardData.getData('text');
      this.listenerInputType = 'insertFromPaste';
      this.evaluate(pasteEvent, this.listenerInputType);
      console.log(`\nuser(${this.listenerInputType}): just pasted some text`, { paste, event: e });
    }
  }
  
  
  /** Listener for when the user cuts some text. */
  protected onCut = (e: Event): void => {
    const clipboardEvent = e as ClipboardEvent & any;
    
    if (e && clipboardEvent.clipboardData) {
      this.listenerInputType = 'deleteByCut';
      clipboardEvent.key = '';
      this.evaluate(clipboardEvent, this.listenerInputType);
      console.log(`\nuser(${this.listenerInputType}): just cut some text`, { event: e });
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
  ):  
    | { actionType: Extract<InputActionType, 'insertText'>,             event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'insertFromPaste'>,        event: ClipboardEvent | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'insertCompositionText'>,  event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'deleteContentBackward'>,  event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'deleteContentForward'>,   event: KeyboardEvent  | undefined, insertedText: string }
    | { actionType: Extract<InputActionType, 'deleteByCut'>,            event: ClipboardEvent | undefined, insertedText: string }
  {
    // This just turned into a mapping of event types for each return, but I don't think this works when you pass unknown vars when it's called
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
    
    
    return { actionType, event, insertedText: '' } as any;
  }
  // #endregion
  
  
}


/*
  * Example -> user's adds 6 when cursor is at the 6th index (the first one)
    - (000)-[cursor]111-2222
    
    ? logical flow
      - cursor start and end is 6
      - user inserts the number is 5
      - currentValue: (000)-111-2222
      - updatedValue: (000)-511-2222
      - cursor is after the 5
    
    ? recalculate the new value and reapply the mask
      - overwrite the values in the raw input for individual inserts
      - for highlighted selections scenarios:
        - overwrite pasted characters that take up extra space examples:
          - pasted 333 when they highlighted 11-22 (add non-wildcards)
              (000)-111-2222 -> (000)-133-3_22 // cursor remains after the last 3
          - pasted 33333 when they highlighted 11-22
            - (000)-111-2222 -> (000)-133-3332 // cursor remains after the last 3
            
    // ? Handle changing the new cursor location to where the last character is appended
        * Calculation: start +  selectionLength - (selectionLength - insertedCharCount) + (maskNonWCChars)
        * selectionLength = cursorEnd - cursorStart
        * insertedCharCount = addedText.length
        * maskNonWCChars = endOffset - startOffset
          - if the selection was 4 chars and they only had added 3 chars
            -> their's a wildcard at the last location, and the cursor before it to easily add text
          - if the selection was 4 chars and they added 5 chars
            -> extra text overwrote the char after the selection, and the cursor is after the final char
                
            
      - for deletion scenarios
        - do not shift, overwrite with wildcards
          - deleted the final one
              (000)-111-2222 -> (000)-11_-2222 // cursor is before the first wildcard
          - deleted 11-22
            - (000)-111-2222 -> (000)-1__-__22 // cursor is before the first wildcard
  
  
*/

