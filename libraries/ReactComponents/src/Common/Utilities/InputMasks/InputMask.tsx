import { ChangeEvent, FormEvent, RefObject } from "react";


export type MaskEventHandle = { canceledBeforeInput: boolean, invokedOnChange: string | boolean };
export type InputActionType = 
| 'insertText' | 'insertFromPaste' 
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
    /** 
     * An input mask that uses underscores to represent wildcard characters that are filled from the user's input.  
     * 
     * --- 
     * @Example  PhoneMask = " ( ___ ) - ___ - ____ "
    */
  protected _mask: string | undefined;
  
  protected _maskWildcardCharacter: string | undefined;
  
    /** 
     * A regExp expression designed to filter the accepted characters for the input.  
     * 
     * --- 
     * @Example  charsNumsSpecialChars = &nbsp; /^[A-Za-z0-9\s!@#$%^&*()_+=\-[\]{}|;:'",.<>/?`~]+$/
    */
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
    console.log(`${inputName}::Evaluating input mask`, { mask: this.mask, filter: this.filter, event },
      `\n native event data: `, { actionType, insertedText },
      `\n input target: `, { inputName, input }
    );
    
    
    // ! This comment's color is red -> error/fallback?
    // ? This comment's current color is blue -> condition/scenario?
    // * This comment's current color is turquoise -> special notes?
    // -> This comment's color is green -> return scenario?
    // <- This comment's color is purple -> misc comment.
    
    
    // ? User typed a single character
    if (actionType == 'insertText' || actionType == 'insertFromPaste') {
      let addedText = insertedText;
      
      // * If we're using a filter
      if (this.isFilterEnabled()) {
        filteredInsert = this.filter(insertedText);
        
        // -> Early out, there's no valid text to add
        if (!filteredInsert) {
          this.handleNativeEventLogic(event, undefined, true); // cancel the events
          this.updateCursorPosition(input, cursorStart, cursorStart, newValue, 0);
          return { canceledBeforeInput: false, invokedOnChange: false }; // input left as-is
        }
        
        addedText = filteredInsert;
      }
      
      // * update the raw value
      let newRawValue = '';
      let start = cursorStart;
      let end = cursorEnd;
      let maskNonWCChars = 0; // mask chars between the selection (non-wildcard)
      if (this.isMaskEnabled()) {
        let startOffset = 0;
        let endOffset = 0;
        
        // Loop through the mask and find the cursor's start/end locations for the raw value
        for (let i = 0; i < this.mask.length; i++) {
          const maskChar = this.mask[i];
          if (i < cursorStart && maskChar !== this.wildcard) startOffset++;
          if (i < cursorEnd && maskChar !== this.wildcard) endOffset++;
          if (i >= cursorEnd) break;
        }
        
        // insert the added text to the raw value, (less/extra text) -> (add wildcards / overwrite chars)
        start = cursorStart - startOffset;
        end = cursorEnd - endOffset;
        maskNonWCChars = endOffset - startOffset;
      }
      
      // * Recalculate the mask
      newRawValue = this.calcRawValue(addedText, prevRawValue, start, end); // filter & mask calc
      let newMaskValue = '';
      for (let i = 0; i < this.mask.length; i++) {
        const maskChar = this.mask[i];
        const inputChar = newRawValue.slice(i, i + 1);
        
        if (maskChar != this.wildcard) newMaskValue += maskChar;
        else newMaskValue += inputChar ? inputChar : this.wildcard;
      }
      
      // -> Successfully recreated the mask for single/multi insert and paste inputs
      this.handleNativeEventLogic(event, newMaskValue, true); // call the onChange w/maskInput
      this.updateCursorPosition(input, cursorStart, cursorEnd, newMaskValue, maskNonWCChars); // after the added text
      return { canceledBeforeInput: true, invokedOnChange: newMaskValue }; 
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
    
    // ? User pressed deleted via backspace, cursor single/multi selected deletion, or ctrl + x (Cut)
    if (
      actionType == 'deleteContentBackward' || 
      actionType == 'deleteContentForward' || 
      actionType == 'deleteByCut'
    ) {
      
    }
    
    
    // ! Fallback for other unhandled browser inputs
    // For logging purposes
    const calculatedNewValue = 
      newValue.substring(0, cursorStart) + 
      insertedText + 
      newValue.substring(cursorEnd);
    console.error(`${inputName}::InputMask(${this.mask}) encountered an error while evaluating the mask on a keypress.`,
      `\n The previous input entry's actionType was ${actionType}, returning the event unaffected, newValue: ${newValue}`, { prevValue, calculatedNewValue, insertedText },
      `\n Event data: `, { nativeEvent, input, event },
    );
    
    // Let the normal event run it's course
    return { canceledBeforeInput: false, invokedOnChange: false };
  }
  
  
  
  
  
  public calcRawValue(inserted: string, prevValue: string, cursorStart: number, cursorEnd: number): string {
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
        else if (charsToAdd.length == 0 && cursorEnd > i) {
          currentChar = this.wildcard;
        }
      }
      
      // build the new raw value
      newRawValue += currentChar;
    }
    
    return newRawValue;
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
   * ```
   * ---
   * @param chars           The characters we want to filter.
   * @param filterRegex     The RegExp we're using to filter characters.
   * @param chars           The characters we want to filter.
   * @param filterRegex     The RegExp we're using to filter characters.
   * 
   * @returns The filtered version of the value.
   */
  public filter(chars: string | null, filterRegex?: RegExp): string {
    const charsToFilter = chars || '';
    const filterExp = filterRegex || this.filterExp;
    // .replace replaces every matching bad character with an empty string
    return charsToFilter.replace(filterExp, "");
  }
  
  
  /** Whether the filter is enabled */
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
   * @returns The mask that we're currently using for this mask, or undefined if we're only using the class to filter characters.
   */
  public get filterExp(): RegExp {
    return this._filter || /(?!)/;
  }
  
  
  
  
  //--------------------------------//
  // Mask                           //
  //--------------------------------//
  /** Whether the mask is enabled */
  protected isMaskEnabled(): boolean {
    return !!this.mask;
  }
  
  /**
   * Retrieves the input mask. Only filters characters if this is left undefined.
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
   * @returns The mask that we're currently using for this mask, or undefined if we're only using the class to filter characters.
   */
  public get mask(): string {
    return this._mask || "";
  }
  
  /** Retrieves the mask's wildcard character. */
  public get wildcard(): string {
    return this._maskWildcardCharacter || "";
  }
  
  
  
  
  //--------------------------------//
  // Event Functions                //
  //--------------------------------//
  /**
   * Update the cursor's `location` based on the original and the updated text.
   * 
   * ---
   * @param input         A reference to the input to update the cursor's location.
   * @param newValue      The updated value that we're passing to the `onChange`.
   * @param prevValue     The current or previous value for this input.
   * @param cursorStart   The cursor's location, or the highlighted selection's starting location.
   * @param cursorEnd     The highlighted selection's end location, or the same as cursorStart.
   * 
   * @returns The filtered version of the value.
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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  public oldEvaluate(event: FormEvent<HTMLInputElement | HTMLTextAreaElement>): MaskEventHandle {
    if (!event) return { canceledBeforeInput: false, invokedOnChange: false };
    
    const input = event.target as HTMLTextAreaElement | HTMLInputElement;
    const inputName = input.name;
    const nativeEvent = event.nativeEvent as InputEvent; // browser event, not react's synthetic event ^
    
    const actionType = nativeEvent.inputType; // The keyed action
    const insertedText = nativeEvent.data; // null/empty during deletions
    let addedText = insertedText || '';
    console.log(`${inputName}::Evaluating input mask`, { mask: this.mask, acceptableChars: this.filterExp, event },
      `\n native event data: `, { actionType, insertedText },
      `\n input target: `, { inputName, input }
    );
    
    // Retrieve the changed input value from the native 
    const start = input.selectionStart ?? 0; // cursor location
    const end = input.selectionEnd ?? 0; // highlighted?
    const prevValue = input.value;
    let newValue = prevValue;
    
    
    // ? User typed a single character
    if (actionType == 'insertText') {
      // Early out if we didn't actually add anything
      if (!insertedText) {
        return { canceledBeforeInput: false, invokedOnChange: false };
      }
      
      // filter out any characters that aren't accepted with this mask
      if (this.filterExp) {
        addedText = this.filter(insertedText);
        if (!addedText) { // If there are no characters that would be added from this, early out
          this.handleNativeEventLogic(event, undefined, true); // cancel the events
          return { canceledBeforeInput: true, invokedOnChange: false }; // input left as-is
        }
      }
      
      // mask logic
      if (this.mask) {
        const splitMask = this.mask.split('');
        const firstHalf = prevValue.substring(0, start); // values up to where we inserted text (safe mask formatting)
        const secondHalf = prevValue.substring(end); // Everything after this needs the mask format stripped
        
        // ? (no wildcards) nowhere else to add characters in the mask. 
        const restOfMask = this.mask.substring(start);
        if (!restOfMask.includes('_')) {
          // Move the cursor over one to show the value was computed with the mask (but retain the same value)
          this.handleNativeEventLogic(event, undefined, true); // cancel the events
          // this.updateCursorPosition(input, newValue, prevValue, start + 1, start + 1);
          return { canceledBeforeInput: false, invokedOnChange: false }; // input left as-is
        } 
        
        
        // ? The added text + the mask's potential formatted characters
        let maskedInsertedText = ''; // The inserted text, w/mask's non wildcard characters
        let insertIndex = start;
        for (let i = insertIndex; i < splitMask.length; i++) {
          const currMaskChar = splitMask[i];
          
          // add this to the text we're inserting, and continue to search for the next wildcard
          if (currMaskChar !== '_') maskedInsertedText += currMaskChar; // add the mask's format characters
          else {
            maskedInsertedText += addedText; // add the user's keyed character
            break;
          }
        }
        
        
        // ? recalculate the secondHalf of the formatted string
        const splitSecondHalf = secondHalf.split('');
        let rawSecondHalf: string[] = []; // user typed characters extracted from the mask input
        for (let i = insertIndex; i < splitMask.length; i++) { // uses prevValues index split
          if (!(splitSecondHalf.length > i - insertIndex)) break; // No chars of value left
          
          // Retrieve the wildcard characters from the second have of the current input value
          const currMaskChar = splitMask[i];
          const secondHalfChar = splitSecondHalf[i];
          if (currMaskChar === '_') rawSecondHalf.push(secondHalfChar);
        }
        
        
        // ? Construct the new formatted masked value for the inserted and second half of the value
        let reEvaluatedSecondHalf = '';
        const currentCombinedLength = firstHalf.length + maskedInsertedText.length;
        let rawDataWriteIdx = 0;

        for (let i = currentCombinedLength; i < splitMask.length; i++) {
          const currMaskChar = splitMask[i];
          if (currMaskChar !== '_') { // mask's formatted characters
            reEvaluatedSecondHalf += currMaskChar;
          } else {
            if (rawDataWriteIdx < rawSecondHalf.length) { // second half of user's characters
              reEvaluatedSecondHalf += rawSecondHalf[rawDataWriteIdx];
              rawDataWriteIdx++;
            } else {
              reEvaluatedSecondHalf += '_'; // Pad with wildcard if out of data
            }
          }
        }
        
        // ? finally, combine the values for the properly masked input
        let newMaskedValue = firstHalf + maskedInsertedText + reEvaluatedSecondHalf;
        
        // Block native input, assign custom value, and calculate layout positions
        this.handleNativeEventLogic(event, newMaskedValue);
        const cursorJump = maskedInsertedText.length;
        // this.updateCursorPosition(input, newMaskedValue, prevValue, start + cursorJump, end + cursorJump);
        
        // notify the onBeforeInput that used this mask
        return { canceledBeforeInput: true, invokedOnChange: newMaskedValue };
      }
      
      
      // * if we're only filtering the input
      else {
        // calculate the new value
        const rawPredictedVal = 
          prevValue.substring(0, start) 
          + addedText || '' 
          + prevValue.substring(end);
        
        // check if we need to filter the text
        if (this.filterExp) newValue = this.filter(rawPredictedVal);
        else newValue = rawPredictedVal;
        
        // null the onBeforeInput event and call onChange with the masked value
        this.handleNativeEventLogic(event, newValue);
        
        // Keep the cursor position up to date to the new location
        // this.updateCursorPosition(input, newValue, prevValue, start + addedText.length, end + addedText.length);
        
        // notify the onBeforeInput that used this mask
        return { canceledBeforeInput: true, invokedOnChange: newValue };
      }
    }
    
    
    // ? User pasted some text
    if (actionType == 'insertFromPaste') {
      // We need to strip out the current mask's non wildcard characters and reevaluate it
      
      // from the prevValue's text we can find the rawPrevValue
      // find where we pasted the text
      //   - keep track of where this is pasted within the masked input
      //   - ideally remove the formatted mask, and insert the new text in the proper location
      // after combining it that way, re-evaluate the mask, and perform an update via onChange
    }
    
    
    // ? User pressed deleted via backspace, cursor single/multi selected deletion, or ctrl + x (Cut)
    if (['deleteContentBackward', 'deleteContentForward', 'deleteByCut'].includes(actionType)) {
      // Handle deleting the proper character, and removing / skipping over the input mask's characters
      
    }
    
    
    // ! Fallback for other unhandled browser inputs
    // For logging purposes
    const currentValue = input.value;
    const calculatedNewValue = 
      currentValue.substring(0, start) + 
      insertedText + 
      currentValue.substring(end);
    console.error(`${inputName}::InputMask(${this.mask}) encountered an error while evaluating the mask on a keypress.`,
      `\n The previous input entry's actionType was ${actionType}, returning the event unaffected, newValue: `, { prevValue, calculatedNewValue, insertedText },
      `\n Event data: `, { nativeEvent, input, event },
    );
    
    // Let the normal event run it's course
    return { canceledBeforeInput: false, invokedOnChange: false };
  }
  
  
}



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

