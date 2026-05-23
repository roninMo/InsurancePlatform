
/* 
  ? Simple RegExp expressions for quickly filtering strings for things like masking.
    ! Do not evaluate for RegExp_CHARS_NUMS_SPC with large strings, it accepts spaces and arrays of symbols, 
      ! and this can cause ReDoS errors in react
*/

// ? These are filtered expressions explicitly for the InputMask class
// Match anything that is NOT a letter
export const Filter_CHARS_ONLY = /[^A-Za-z]/g;

// Match anything that is NOT a digit
export const Filter_NUMS_ONLY = /[^\d]/g;

// Match anything that is NOT a letter or a digit
export const Filter_CHARS_NUMS = /[^A-Za-z0-9]/g;

// Match anything that is NOT a letter, number, space, or standard symbol
export const Filter_CHARS_NUMS_SPC = /[^A-Za-z0-9\s!@#$%^&*()_+=\-[\]{}|;:'",.<>/?`~]/g;



// ! These are validation expressions, not filter expressions
/** Characters only (Case-insensitive) */
export const Validate_CHARS_ONLY: RegExp = /^[A-Za-z]+$/;

/** Numbers only */
export const Validate_NUMS_ONLY: RegExp = /^\d+$/;

/** Characters and numbers */
export const Validate_CHARS_NUMS: RegExp = /^[A-Za-z0-9]+$/;

/** Characters, numbers, spaces, and common special characters. */
export const Validate_CHARS_NUMS_SPC: RegExp = /^[A-Za-z0-9\s!@#$%^&*()_+=\-[\]{}|;:'",.<>/?`~]+$/;

/** All valid email characters */
export const Validate_EMAIL: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** Min 8 characters, one upper, one lower, one special character. */
export const Validate_PASS: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/** Min 8 characters, one upper, one lower, one number, one special character. */
export const Validate_PASS_HS: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


/*

? The cursor selection logic
  - starts at 0, before the first character
  - ends at (n), after the last character


? Conceptual Mask logic
  - We first need to build the mask's format and use this as the base value.
    - Everything that is added, appended, or deleted needs to be in sync with this because we can't keep track of highlighted edits without this being explicitly implied
  - We should check the integrity of the current value (prevValue) using the maskHash and prevValueHash every time we evaluate
    - iterate through the value and check that all non wildcard characters are in place.
      - if so, all logic for inserting, appending, and deleting will be inherently safe, especially cursor position synchronization mixed with edits alongside the mask template
      - if not, we capture the prevValue, the inserted/deleted text action, and add it to the mask template from start(0) to the end of the mask template
    ? All edits will be safe and in sync, allowing for easy edits
    
  ? From here we're overwriting the text from "insertText" or "appendPaste" the same way safely
  

TODO: Current Logic that needs to be implemented:


? (A) (Filter only) - Default Additive insert text
  - works for both insertText and appendFromPaste, use when there is no mask.
  - call the onChange after the update, preventDefault in onBeforeInput.
  - update the cursor location to after the insertion.
  
  ? Things we need to account for
    1. If "appendFromPaste" with no valid characters after filter, just remove highlighted characters.
    2. If "insertText" and there are no valid characters after the filter, early out.
  
  * Example - adds "X" after the "M" in "Mozilla Firefox"
    const start = 1; // the boundary before the "o", and after the "M"
    const end = 1; // this isn't a highlighted selection, so this is the cursor's inherent location
    const rawPredictedVal = 
      prevValue.substring(0, start) 
      + addedText || '' 
      + prevValue.substring(end);
    
    * Logic
      0. prevValue = "Mozilla Firefox"
      
      1. cursor at index 1 (Typing "X")
      
      2. pevValue.substring(0, 1) -> "M"
      
      3. insertedText -> "X"
      
      4. prevValue.substring(1) -> "ozilla FireFix"
      
      5. Result: "MXozilla Firefox"

  * Example2 - pastes "Safari" after the "i" all the way to the "e" in "Mozilla Firefox"
    const start = 4; // before the i and after the z.
    const end = 11; // after the r and before the e.
    
    * Logic
      0. highlighted index 4-10 -> "illa Fir"
      
      1. prevValue.substring(0, 4) -> "Mozi"
      
      2. pastedText -> "Safari"
      
      3. prevValue.substring(11) -> "eFox"
      
      4. Result: "MoziSafarieFox"




? (B) (Mask ?+ filter) - Inserting Text scenario (overwrite: this should not be additive with masks)
  ! override default behavior
  - using the cursor's starting location to find where we're replacing the current character
  - find the next available wildcard "_" character to add our text
  - replace the current character or overwrite the mask's empty wildcard. If there are no more wildcards, we reached the end of the mask
  
  ? Things we need to account for
    1. Use the filter logic (if there is any) to determine whether this is a character we should add
    2. Update the cursor location to the new location. If they overwrote a key, move it to the key after the one that was overwritten
    3. If we updated the text, call the onChange, otherwise just cancel the event.
    4. If we have a valid value, even if a character wasn't added, we must update the cursor location
      - TODO::Question: in the event we didn't change the mask, reached the end and need to move our cursor there, can we do this without calling the onChange event?
  
  * Example - overwrite "o" with "X" after the "M" in "Mozilla Firefox"
    if (actionType == "insertText")
    const start = 1; // the boundary before the "o", and after the "M"
    const end = 1; // this isn't a highlighted selection, so this is the cursor's inherent location
    const maskHash: Record<number, string>; // if mask is "(___) - ___ - ____", 0 is "(", 1 is "_", etc
    const prevValHash: Record<number, string>; // same as above, but with the captured previous values
    
      
      TODO - can we do this in one pass? - yes
      - Overwriting consists of from the cursorStart adding the inserted text or paste, and iterating through and overwriting the next values
        ? denote the starting location, where we start the overwrite. Important that we:
          - add the new characters to only wildcard locations, iterating and overwriting any previous values
          - only remove overwritten characters from a paste (1abc to "(321)-456-7890" while "(321)" is highlighted should only change to (121)-456-7890 )
          - insertText should look for the next wildcard to overwrite
          
        - So inherently, we're looping through keys, and just need the cursor's start location
        - Deletes can handle clearing mask wildcards
        
        ? using a hash of the prevValue and the mask's template
          - Overwrite works perfectly with indexing based on the cursor's starting location
            - cursorStart before the "o" is 1, the prevValueHash's 0 index would be "o" as well. 
            - we can handle overwrites easily this way, iterating through the hash while looping through each accepted character to safely overwrite
      
        * This is perfect because
          ? non destructive to the mask format, 
          ? lots of less code to handle fundamentally 
          ? works for both insert and paste scenarios
          ? works alongside filtering without a problem


? (C) (Mask only) - Deleting text scenarios
  - Replace deleted characters with mask wildcards while preserving the mask template
  - If we're only using the filter, just early out and allow the default event logic to remove text.

  ? Things we need to account for
    - filter only uses default event logic
    - masked logic can use the hash to loop through the cursor's selection, and replace the user's character with wildcards
    - once this is complete, preventDefault the onBeforeInput, and call the onChange event with the masked text
    - move the cursor to the cursorStart for highlighted selections, and back to the next wildcard character


? (D) (Mask OR Filter OR both) - fallback - no defined inputType
  - we can't really do anything or assume they're pasting or deleting text here, but allow for native behavior could break the mask's layout.
  - So just check if there's inserted text, and if there is:
    - for mask ?+ filter, use the overwrite logic and append the text accordingly
    - for filter only, use the default logic as a fallback if we don't know the action type, simulating the native insertText scenario  
    - this logic will be divided into functions for organizational purposes and reusability




TODO - Breakdown: functions to add

? Evaluate functions
  - evaluate(event)
  * Base functions
  - handleFilterOnly(event, input, nativeEvent, actionType)
  - handleMask(event, input, nativeEvent, actionType, mask)
  * Universal functions
    - filterInsertedText() // filters out the invalid characters
    - isMaskValid(currentValue) // Checks whether the currentValue is the maskTemplate (not including wildcards)
    - rebuildMask(currentValue, event, input) // rebuilds the mask, takes the (currentValue + edit) and adds it to the mask 
    - insertIntoMask() // handles insertText and appendFromPaste using the overwrite methods on a masked prevValue
    - deleteFromMask() // deletes selection from the mask
    - updateCursorLocation() // TODO: do we need to edit the updateCursorLocation function to work for the previous additive and the overwrite scenarios?
    - additiveFallbackEdit() // handles non mask edits - only needs to be used for additions, allow native logic to handle deletion


*/