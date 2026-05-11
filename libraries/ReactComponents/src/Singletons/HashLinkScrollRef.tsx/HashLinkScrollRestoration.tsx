


export type NavState = 'navigated' | 'scroll' | 'ready';

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
  protected history?: any;
  protected currentNavState: NavState;
  protected baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_BASE_URL || window.location.origin;
    this.currentNavState = 'ready';
    if (typeof window !== 'undefined') {
      this.history = window.history;
    }

    console.log('initial window history: ', this.history);
  }


  /* 
    HashLink -> Navigates
      - update state to 'navigated' or 'scroll'
        - 'navigated' if they navigate to a new page without an id
        - 'scroll' if they navigate with a hash to a new or the same page
    
    Does not handle back/forward or reload here
      - allows for native scroll behavior
      - NavState is not affected, so default behavior shouldn't be affected

    
    Navbar -> useEffect called after router navigation
      - scroll to location if state is 'scroll'
      - scrollToTop without transition if state is 'navigated'
    - Both set to 'ready' once logic is ran (synchronous)


    Class Functions
      - updateNavInfo (HashLink)
      - determineScrollBehavior (Navbar)
  
  */


  /** 
   * Updates the internal navigation state so the scroll behavior's logic knows what to do. \n
   * 
   * This function updates this class's internal values and 
   * should be ran in parallel with the internal react-router's navigation logic to stay in sync.
   * 
   * 
   *  - update state to 'navigated' or 'scroll'
   *    - 'navigated' if they navigate to a new page without an id
   *    - 'scroll' if they navigate with a hash to a new or the same page
   * 
   * @param url The new url we're navigating to.
   */
  public UpdateNavInfo(url: string): void {
    const prevUrl: string = '';

    console.log(`updateNavInfo::current nav history: `, {
      newUrl: url,
      history: this.history
    });
  }


  /** 
   * Checks whether we should scroll from the previous navigation. \n
   * 
   * This function updates this class's internal values and 
   * should be ran in parallel with the internal react-router's navigation logic to stay in sync.
   * 
   *  - This check is in place to account for non react-router nav logic (reload, forwards, backwards)
   *    - 'scroll':     scroll transition to location
   *    - 'navigated':  scrollToTop without transition
   *    - 'ready':      allow for default behavior
   * 
   * @param url The new url we're navigating to.
   * 
   * @returns The navState associated with how we navigated.
   */
  public determineScrollBehavior(): NavState {

    console.log(`determineScrollBehavior::current nav history: `, this.history);
    return 'scroll';
  }


  /** Updates the internal current nav state for this service. */
  public setNavState(state: NavState): void {
    this.currentNavState = state;
  }


  /** Returns the current navigation state. */
  public getNavState(): NavState {
    return this.currentNavState;
  }

  //------------------------------------------//
  // Utility Functions                        //
  //------------------------------------------//
  /** Returns the current route and hash from the most recent captured navigation. */
  public getHashAndBaseRoute(route: string): { hash: string, baseRoute: string } {
    if (!this.isHashRoute(route)) {
      return { hash: '', baseRoute: route };
    }

    // return the hash and the base url
    return { 
      hash: this.getHash(route), 
      baseRoute: this.getBaseRoute(route)
    };
  }


  /** Returns the hash from the current url passed in */
  public getHash(route: string): string {
    try {
      const parsed = new URL(route, this.baseUrl);
      console.log(`hash: ${parsed.hash}, route: ${route}`, {url: parsed});
      return parsed.hash.replace('#', '');
    } catch (e) {
      // Manual fallback: find #, then cut off anything starting at ?
      const hashIndex = route.indexOf('#');
      if (hashIndex === -1) return '';
      
      const hashPart = route.slice(hashIndex + 1);
      const queryInHashIndex = hashPart.indexOf('?');
      
      return queryInHashIndex !== -1 
        ? hashPart.slice(0, queryInHashIndex) 
        : hashPart;
    }
  }


  /** Gets the base route from a react-router-dom navigation url, removing the id */
  public getBaseRoute(route: string): string {
    try {
      const parsed = new URL(route, this.baseUrl);
      console.log(`baseRoute: ${parsed.pathname}, route: ${route}`, {url: parsed});
      return parsed.pathname;
    } catch (e) {
      // Fallback for extreme edge cases
      const index = route.search(/[?#]/);
      return index !== -1 ? route.slice(0, index) : route;
    }
  }


  /** Whether this route has a hash id */
  public isHashRoute(route: string): boolean {
    try {
      const parsed = new URL(route, this.baseUrl);
      console.log(`isHash: ${parsed.hash}, route: ${route}`, {url: parsed});
      return !!parsed.hash;
    } catch (e) {
      const index = route.search(/[#]/);
      return index !== -1;
    }
  }


}




export const navScrollRestoration = new HashLinkScrollRestoration();
