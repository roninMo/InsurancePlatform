import { ChangeEvent, FormEvent, RefObject } from "react";


export type MaskEventHandle = { canceledBeforeInput: boolean, invokedOnChange: string | boolean };
export type InputActionType = 
| 'insertText' | 'insertCompositionText' | 'insertFromPaste' 
| 'deleteContentBackward' | 'deleteContentForward' | 'deleteByCut';

// TODO - add multiple constructors to enable a mask + filter from this config
export type MaskConfig = {
  mask: string;
  maskWildcard: string;
  
  /** A RegExp expression to add a filter to the inserted text. */
  filter?: RegExp;
  
  /** Whether we should additionally filter out any non-wildcard characters this mask uses from the user's inputted text. */
  filterNonWildCardsFromInput?: boolean;
}

/** A standard class to be used for creating custom masks that use a mask and/or filtered accepted characters. */
class InputMask {
  /** An input mask that uses wildcard characters to defined what's filled from the user's input. */
  protected _mask: string | undefined;
  
  /** The mask's wildcard character. Must be defined to determine where the wildcards are when evaluating the mask. */
  protected _maskWildcardCharacter: string | undefined;
  
  /** A regExp expression designed to filter the accepted characters for the input. */
  protected _filter: RegExp | undefined;
  
  /** The raw input value without the mask. @note this still applies the filter. */
  protected rawInputValue: string;
  
  /** The cached input value after applying the mask. */
  protected maskedInputValue: string;
  
  
  /** Default constructor, initializes everything to undefined */
  constructor(maskConfig: MaskConfig, filter: RegExp | undefined = undefined) {
    const config = maskConfig || {};
    
    this._mask = config.mask;
    this._maskWildcardCharacter = config.maskWildcard;
    
    this._filter = filter;
    this.rawInputValue = '';
    this.maskedInputValue = '';
  }
  
  
  
  
  /**
   * Evaluates an input's new value from the onBeforeInput event using 
   * the native event's state and the previous value for reference.
   * 
   * * This is intended to be used in onBeforeInput only
   * * This invokes the `onChange` event IF it's a valid change to the mask, which includes: 
   *    1. If it's valid text that add's or removes from the `mask's format`. 
   *    2. If the text inserted wasn't filtered out from the `acceptedChars`.
   *    3. If you `pasted text` somewhere, and the mask re-evaluated the value entirely.
   *    4. All other scenarios won't trigger the change event for efficiency purposes.
   *   
   * ---
   * @Example
   * ```ts
   * // During the onBeforeInput event's function logic: 
   * const handleOnBeforeInput = (event: FormEvent<HTMLInputElement>) => {
   *    // other logic here
   * 
   *    const currentValue = getCurrentValue(); 
   *    const handle = inputMask.evaluate(currentValue, event); 
   * 
   *    console.log(handle);
   *    // { canceledBeforeInput: true, invokedOnChange: 'newMaskedValue' }
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
  public evaluate(event: FormEvent<HTMLInputElement | HTMLTextAreaElement>): MaskEventHandle {
    if (!event) return { canceledBeforeInput: false, invokedOnChange: false }; // ! the event was invalid
    
    // Input and Event information
    const input = event.target as HTMLTextAreaElement | HTMLInputElement;
    const inputName = input.name;
    const nativeEvent = event.nativeEvent as InputEvent; // browser event, not react's synthetic event ^
    
    // User action information
    const actionType = nativeEvent.inputType as InputActionType; // The keyed action
    const insertedText = nativeEvent.data || ''; // null/empty during deletions
    let filteredInsert = insertedText;
    
    // Retrieve the changed input value from the native 
    const cursorStart = input.selectionStart ?? 0; // cursor location
    const cursorEnd = input.selectionEnd ?? 0; // highlighted?
    
    // Cached refs
    const prevRawValue = this.rawInputValue;
    const prevMaskedValue = this.maskedInputValue;
    
    // Calculated input values
    const prevValue = input.value;
    let newValue = prevValue;
    console.log(`\n${inputName}::Evaluating and updating input from user event(${actionType}), maskData: `, { mask: this.mask, filter: this.filter, event },
      `\n native event data: `, { actionType, insertedText, [inputName]: input, nativeEvent },
      `\n current data: `, { currentRawValue: prevRawValue, currentMaskedValue: prevMaskedValue,
        cursor: { start: cursorStart, end: cursorEnd }, 
      },
    );
    
    
    // ? User typed a single character
    if ( actionType == 'insertText' 
      || actionType == 'insertCompositionText'
      || actionType == 'insertFromPaste'
    ) {
      let addedText = insertedText;
      
      // * If we're using a filter
      if (this.isFilterEnabled()) {
        filteredInsert = this.filter(insertedText);
        
        // <- Early out, there's no valid text to add
        if (!filteredInsert) {
          this.handleNativeEventLogic(event, undefined); // cancel the events
          this.updateState(prevRawValue, prevMaskedValue); // update internal state tracking
          this.updateCursorPosition(input, cursorStart, cursorEnd, newValue, 0);
          console.log(`${inputName}::Cancelled - The added text was filtered, aborting the onChange event. data: `, { insertedText, filteredInsert, filter: this._filter });
          return { canceledBeforeInput: true, invokedOnChange: false }; // input left as-is
        }
        
        addedText = filteredInsert;
      }
      
      // * update the raw value
      let newRawValue = '';
      let start = cursorStart;
      let end = cursorEnd;
      let maskNonWCChars = 0; // mask chars between the selection (non-wildcard)
      if (this.isMaskEnabled()) {
        // offsets for the cursor location after removing the mask parts of the string
        const { startOffset, endOffset } = this.getRawCursorLocation(start, end);
        start = cursorStart - startOffset;
        end = cursorEnd - endOffset;
        maskNonWCChars = endOffset - startOffset;
      }
      
      // Handle building the mask from the raw input value
      newRawValue = this.addToRawValue(addedText, prevRawValue, start, end); // filter & mask calc
      const newMaskValue = this.buildInputMask(newRawValue);
      
      // -> Successfully recreated the mask for single/multi insert and paste inputs
      this.handleNativeEventLogic(event, newMaskValue); // call the onChange w/maskInput
      this.updateState(newRawValue, newMaskValue); // update internal state tracking
      this.updateCursorPosition(input, cursorStart, cursorEnd, newMaskValue, addedText.length, maskNonWCChars); // after the added text
      console.log(`${inputName}::Completed - Recreated the mask for the single/multi insert, and paste actions. Event data: `, 
        { newRawValue, newMaskValue, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled() },
        `\n Cursor specific tracking: `, { cursor: { start, end }, maskNonWildCardChars: maskNonWCChars },
      );
      return { canceledBeforeInput: true, invokedOnChange: newMaskValue }; 
    }
    
    
    // ? User pressed deleted via backspace, cursor single/multi selected deletion, or ctrl + x (Cut)
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
      this.handleNativeEventLogic(event, newMaskValue); // call the onChange w/maskInput
      this.updateState(newRawValue, newMaskValue); // update internal state tracking
      
      // back one, or remove highlight
      const startAfterDeletion = deletionCount == 1 ? cursorStart - 1 : cursorStart; 
      const endAfterDeletion = deletionCount == 1 ? startAfterDeletion : cursorStart;
      this.updateCursorPosition(input, startAfterDeletion, endAfterDeletion, newMaskValue, 0, maskNonWCChars); 
      console.log(`${inputName}::Completed - Recreated the mask for a delete event. Event data: `, 
        { newRawValue, newMaskValue, wasFiltered: this.isFilterEnabled(), wasMasked: this.isMaskEnabled() },
        `\n Cursor specific tracking: `, { cursor: { start, end }, maskNonWildCardChars: maskNonWCChars },
      );
      return { canceledBeforeInput: true, invokedOnChange: newMaskValue }; 
    }
    
    
    
    // ! Fallback: we don't want to break the mask input, so just prevent this event from occurring
    console.error(`${inputName}::InputMask(${this.mask}) encountered an error while evaluating the mask on a keypress.`,
      `\n The previous input entry's actionType was ${actionType}, returning the event unaffected: `, { prevRawValue, prevMaskedValue, insertedText },
      `\n Event data: `, { nativeEvent, input, event },
    );
    
    this.handleNativeEventLogic(event, undefined); // prevent the event from editing the mask's value
    return { canceledBeforeInput: true, invokedOnChange: false };
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
    if (!prevValue) return '';
    if (!inserted) return prevValue;
    
    // ? Filter only -> additive
    if (!this.isMaskEnabled()) {
      return  prevValue.substring(0, cursorStart) + 
              inserted + 
              prevValue.substring(cursorEnd);
    }
    
    // ? Mask logic -> overwrite
    let newRawValue = '';
    const charsToAdd = inserted.split("");
    for (let i = 0; i < prevValue.length; i++) {
      let currentChar = prevValue[i];
      
      if (cursorStart <= i) {
        // If we still have characters to add, overwrite the current value
        if (charsToAdd.length) {
          currentChar = charsToAdd.shift() || currentChar;
        }
        
        // Add wildcards within the highlighted text if there are no more characters to add
        else if (charsToAdd.length == 0 && i < cursorEnd) {
          currentChar = this.wildcard;
        }
      }
      
      // build the new raw value
      newRawValue += currentChar;
    }
    
    return newRawValue;
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
    if (!prevValue) return '';
    if (cursorStart > cursorEnd) {
      console.error(`removeFromRawValue(${prevValue}): An error occurred from one of the inputMask calculations, invalid input data: `, { prevValue, cursorStart, cursorEnd });
      return prevValue;
    }
    
    const isMultipleCharacters = (cursorEnd - cursorStart) > 0;
    if (isMultipleCharacters) {
      const firstHalf = prevValue.substring(0, cursorStart);
      const secondHalf = prevValue.substring(cursorEnd);
      return firstHalf + secondHalf;
    }
    
    // handle deleting the value
    const deleteIndex = actionType == 'deleteContentForward' ? cursorStart : cursorStart - 1;
    if (deleteIndex < 0) return prevValue; // Guard against out-of-bounds backspace at the very beginning of the input
    
    const firstHalf = prevValue.substring(0, deleteIndex);
    const secondHalf = prevValue.substring(deleteIndex + 1);
    return firstHalf + secondHalf;
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
    
    for (let i = 0; i < this.mask.length; i++) {
      const maskChar = this.mask[i];
      const inputChar = rawValue.substring(i, i + 1);
      
      if (maskChar != this.wildcard) newMaskValue += maskChar;
      else newMaskValue += inputChar ? inputChar : maskChar; // this.wildcard;
    }
    
    return newMaskValue;
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
  }
  
  
  
  
  //--------------------------------//
  // Filter                         //
  //--------------------------------//
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
    return charsToFilter.replace(filterExp, "");
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
  
  
  
  
  //--------------------------------//
  // Mask                           //
  //--------------------------------//
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
  
  
  
  
  //--------------------------------//
  // Event Functions                //
  //--------------------------------//
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
    const selectionLength = cursorEnd - cursorStart;
    const addedTextOffset = selectionLength - (selectionLength - insertedCharCount) + maskNonWCChars;
    const newCursorPos = Math.min( Math.max(0, 
      cursorStart + addedTextOffset),
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
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, 
    invokeOnChange: string | undefined = undefined, // false
    preventDefault: boolean = true, 
  ): void {
    const input = event.target as HTMLTextAreaElement | HTMLInputElement;
    const nativeEvent = event.nativeEvent as InputEvent; // browser event, not react's synthetic event ^
    
    // ? Stop the browser from inserting the raw, unmasked characters
    if (preventDefault) {
      event.preventDefault();
    }

    // ? Manually call onChange: assign the masked value to the element
    // ! Changing this property directly triggers React's internal onChange tracker
    if (invokeOnChange !== undefined) {
      input.value = invokeOnChange; // invokes onChange
      
      // * Dispatches a synthetic input change notification
      const tracker = (input as any)._valueTracker;
      if (tracker) {
        tracker.setValue(invokeOnChange);
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
  
  
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


export type InputMaskProps = 
| { 
    /** 
     * An input mask that uses underscores to represent wildcard characters that are filled from the user's input. 
     * 
     * --- 
     * @Example  PhoneMask = " ( ___ ) - ___ - ____ "
    */
    mask?: string; 
    /** A regex pattern for the acceptable strings from the user's keyed characters.  */
    acceptableChars?: RegExp;
    /** The input's event that we're using the mask on. */
    event?: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>; 
  } 
| { 
    mask?: never; 
    /** @deprecated CANNOT use 'event' without the defined input mask. */
    event?: never; 
    /** @deprecated CANNOT use 'acceptableChars' without the defined input mask. */
    acceptableChars?: never; 
  };

