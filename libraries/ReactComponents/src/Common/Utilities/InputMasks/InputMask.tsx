import { ChangeEvent, FormEvent, RefObject } from "react";


export type MaskEventHandle = { canceledBeforeInput: boolean, invokedOnChange: string | boolean };

/** A standard class to be used for creating custom masks that use a mask and/or filtered accepted characters. */
class InputMask {
    /** 
     * An input mask that uses underscores to represent wildcard characters that are filled from the user's input.  
     * 
     * --- 
     * @Example  PhoneMask = " ( ___ ) - ___ - ____ "
    */
  protected _mask: string | undefined;
  
    /** 
     * A regExp expression designed to filter the accepted characters for the input.  
     * 
     * --- 
     * @Example  charsNumsSpecialChars = &nbsp; /^[A-Za-z0-9\s!@#$%^&*()_+=\-[\]{}|;:'",.<>/?`~]+$/
    */
  protected _acceptedChars: RegExp | undefined;
  
  /** The stored previous value from the last time the mask was run, or explicitly defined from @see setPrevValue() */
  protected _prevValue: string;
  
  
  /** Default constructor, initializes everything to undefined */
  constructor(mask: string | undefined = undefined, acceptedChars: RegExp | undefined = undefined) {
    this._mask = mask;
    this._acceptedChars = acceptedChars;
    this._prevValue = '';
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
    if (!event) return { canceledBeforeInput: false, invokedOnChange: false };
    
    const input = event.target as HTMLTextAreaElement | HTMLInputElement;
    const inputName = input.name;
    const nativeEvent = event.nativeEvent as InputEvent; // browser event, not react's synthetic event ^
    
    const actionType = nativeEvent.inputType; // The keyed action
    const insertedText = nativeEvent.data; // null/empty during deletions
    let addedText = insertedText || '';
    console.log(`${inputName}::Evaluating input mask`, { mask: this.mask, acceptableChars: this.acceptedChars, event },
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
      if (this.acceptedChars) {
        addedText = this.filterChars(insertedText, this.acceptedChars);
        if (!addedText) { // If there are no characters that would be added from this, early out
          this.handleNativeEventLogic(event, undefined, true); // cancel the events
          return { canceledBeforeInput: true, invokedOnChange: false }; // input left as-is
        }
      }
      
      
      /*
        * Mask logic
          Check the current index of the prevValue "or current value"
            - Find the index of the text we're inserting
              - from 0-maskEnd, check if the associated mask's index is at a wildcard location
                - if not, add the mask's character, and rerun this step
                - if we found a wildcard, add the valid character here
              - once this is completed, we have the newly updated value, and should calculate the cursor position 
							
							
							
							
					* Let's change this up a bit
						- Start with initializing the mask on the input, adding it as the placeholder
						- when they type we need to check if we've autofilled the mask
						- after we do, handle overwriting the current characters at the cursor locations and shifting to find where the next wildcard is
						- pastes handle selection insertion and clearing old removed values our paste didnt get to
						- deletions handle single, mutliple highlighted, or ctrl xcuts
						
						const inputType = event.nativeEvent.inputType;

if ([
  'deleteContentBackward', 
  'deleteContentForward', 
  'deleteByCut'
].includes(inputType)) {
  // Content was deleted
}


       */
      if (this.mask) {
        const splitMask = this.mask.split('');
        const firstHalf = prevValue.substring(0, start); // values up to where we inserted text (safe mask formatting)
        const secondHalf = prevValue.substring(end); // Everything after this needs the mask format stripped
        
        // ? (no wildcards) nowhere else to add characters in the mask. 
        const restOfMask = this.mask.substring(start);
        if (!restOfMask.includes('_')) {
          // Move the cursor over one to show the value was computed with the mask (but retain the same value)
          this.handleNativeEventLogic(event, undefined, true); // cancel the events
          this.updateCursorPosition(input, newValue, prevValue, start + 1, start + 1);
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
        this.updateCursorPosition(input, newMaskedValue, prevValue, start + cursorJump, end + cursorJump);
        
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
        if (this.acceptedChars) newValue = this.filterChars(rawPredictedVal, this.acceptedChars);
        else newValue = rawPredictedVal;
        
        // null the onBeforeInput event and call onChange with the masked value
        this.handleNativeEventLogic(event, newValue);
        
        // Keep the cursor position up to date to the new location
        this.updateCursorPosition(input, newValue, prevValue, start + addedText.length, end + addedText.length);
        
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
    
    
    // ? User pressed backspace
    // Custom mask logic: Should we jump over a slash or dash mask?
    else if (actionType == 'deleteContentBackward') {
      // Handle deleting the proper character, and removing / skipping over the input mask's characters
      
      
    }
    
    
    // ? User pasted text
    // Custom mask logic: Strip out formatting and validate raw string
    else if (actionType == 'insertFromPaste') {
      // added chars is the entire pasted string
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
  
  
  /**
   * Uses a RegExp expression to `filter` out any unwanted characters to a string.
   * 
   * ---
   * @Example
   * ```ts
   * const currentValue = 'abc123';
   * const numbersOnly = /[^\d]/g; 
   * 
   * const filtered = this.filterChars(currentValue, numbersOnly); 
   * console.log(filtered); // Returns: 123
   * 
   * ```
   * ---
   * @param chars       The characters we want to filter.
   * @param chars       The RegExp we're using to filter characters.
   * 
   * @returns The filtered version of the value.
   */
  public filterChars(chars: string, filterRegex: RegExp): string {
    // .replace replaces every matching bad character with an empty string
    return chars.replace(filterRegex, "");
  }
  
  
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
    newValue: string, prevValue: string, 
    cursorStart: number, cursorEnd: number
  ): void {
    // Keep the cursor position up to date after the filter stripped out some characters
    const addedCharsCount = newValue.length - prevValue.length;
    const newCursorPos = Math.min(
      newValue.length,
      Math.max(0, cursorStart)
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
  
  
  //----------------------------------//
  // Utility functions                //
  //----------------------------------//
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
  public get mask(): string | undefined {
    return this._mask;
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
  public get acceptedChars(): RegExp | undefined {
    return this._acceptedChars;
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

	
	
	- cursor start and end is 6
	- user inserts the number is 5
	- the current value is (000)-111-2222
	- would change to (000)-511-2222
	
	for the raw value: 
	
	0001112222
  
	the index would be 3
	
	
	just loop through the mask until we get to cursorStart
		- capture all the masked non-wildcard character
		- subtract it from the index
		
	
	
		
	if they highlighted multiple characters (cursorStart != cursorEnd)
		- the cursorStart index we add would be the same
		- we should replace any removed characters with wildcards
		
	
	