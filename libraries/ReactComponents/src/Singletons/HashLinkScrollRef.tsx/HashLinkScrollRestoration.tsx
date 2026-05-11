


export type NavState = 'uninitialized' | 'navigated' | 'scroll' | 'ready';

// TODO: what is window history's object for this?
export interface CurrentNavInfo { // The values we need/should calculate
  url: string;
  type: 'push' | 'replace';
  wasReload?: boolean;
  wentBackOrForward?: boolean;
}

/*
  user lands on the home page - 'ready'
    - clicks on a link -> sets to 'navigated'
    - the navbar rerenders for nav, checks state, if just 'navigated'
      - checks if there's a hash to scroll to
        - able to scroll?: scrolls to hash and sets to 'scroll'
          - scroll finishes, navbar should account for this? then update to 'ready'
          
        - no scroll id?: does nothing and sets to 'ready'

    - if we interrupt a scroll in progress with another nav
      - stable because behavior doesn't affect anything and the state is set to 'navigated' again
      - @note - navbar's userScrollPause timers should be canceled upon navigation from the effect. 

  
  TODO: this no longer is for scroll behavior, but whether they should scroll
        - implement logic and state synchronizations when they invoke the navigate events
          - allows use to determine when to use scroll restoration
            - add snapping to top when they navigate without an id
            - forwards, backwards, reload work without any problem


*/

class HashLinkScrollRestoration {
  protected currentNavState: NavState;
  protected prevUrl: string;
  protected windowHistoryRef?: any;

  // Current scroll to metadata
  protected wasReload?: boolean;
  protected baseUrl?: string;
  protected idHash?: string;
  

  constructor() {
    this.currentNavState = 'uninitialized';
    this.prevUrl = '';
    this.windowHistoryRef = undefined;

    this.wasReload = false;
    this.baseUrl = '';
    this.idHash = '';
  }


  /** 
   * Checks whether we should scroll from the previous navigation. \n
   * 
   * This function updates this class's internal values and 
   * should be ran in parallel with the internal react-router's navigation logic to stay in sync.
   * 
   * @param url The new url after the navigation has occurred
   * @param userReload Whether the user reloaded the page
   * 
   * @returns If we should scroll 
   */ // TODO: handle scroll behavior BEFORE we scroll for onNavigate() scroll logic (snap, stay, snap->scroll)
  public shouldScrollFromNav(url: string, userReload: boolean, historyRef?: any): boolean {
    const newBaseUrl = this.getBaseUrl(url);
    const oldBaseUrl = this.getBaseUrl(this.prevUrl);
    const newHash = this.getHash(url);
    const oldHash = this.getHash(this.prevUrl);
    
    
    // The user navigated with a hash, we should use our custom scroll behavior
    const hasHashLink = this.isHashUrl(url);
    const didNavigate = url != this.prevUrl;
    const differentHashLink = newHash != oldHash;
    if (hasHashLink) 
    {
      if (didNavigate) {
        this.updatedNavInfo(url, 'scroll', historyRef);
        return true;
      }
  
      if (differentHashLink) {
        this.updatedNavInfo(url, 'scroll', historyRef);
        return true;
      }
    }
    else 
    {
      // navigated to a new page without a hashLink (immediately open at the top)
      if (didNavigate) {
        this.updatedNavInfo(url, 'ready', historyRef);
        return false;
      }

      if (this.wasReload) {
        this.updatedNavInfo(url, 'ready', historyRef);
        return false;
      }

      // - when the user goes back to their previous route
      // - TODO: when the user presses the back or forward button
      //   - should we just capture the window.history?
      if (true) {

      }
    }

    

    /* 
      When we should scroll
      - navigated to a page with an id (start from the beginning and scroll down)
      - navigated to a new id on the same page (current to new location)
      
      When we shouldn't scroll
        - when the user reloaded the page
        - when the user goes back to their previous route
        - TODO: when the user presses the back or forward button
          - should we just capture the window.history?
    
    */

    return false;
  }

  
  /** Updates the internal current nav state for this service. */
  public updatedNavInfo(url: string, newState: NavState, historyRef?: any): void {
    this.prevUrl = url;
    this.currentNavState = newState;
    this.windowHistoryRef = historyRef;
  }

  /** Updates the internal current nav state for this service. */
  public setNavState(state: NavState): void {
    this.currentNavState = state;
  }


  /** Returns the current navigation state. */
  protected getNavState(): NavState {
    return this.currentNavState;
  }


  /** Returns the current url and hash from the most recent captured navigation. */
  protected getHashAndBaseUrl(url: string): { hash: string, baseUrl: string } {
    if (!this.isHashUrl(url)) {
      return { hash: '', baseUrl: url };
    }

    // return the hash and the base url
    const hashIndex = url.indexOf('#');
    const baseUrl = url.slice(0, hashIndex);
    const hash = url.slice(hashIndex + 1);
    return { hash, baseUrl };
  }

  protected getHash(url: string): string {
    const hashIndex = url.indexOf('#');
    return url.slice(hashIndex + 1);
  }


  /** Gets the base url from a react-router-dom url, removing the id */ // TODO: is there query params that we should account for?
  protected getBaseUrl(url: string): string {
    const hashIndex = url.indexOf('#');
    return url.slice(0, hashIndex);
  }


  /** Whether this url has a hash id */
  protected isHashUrl(url: string): boolean {
    return url.includes('#');
  }


}



export const navScrollRestoration = new HashLinkScrollRestoration();
