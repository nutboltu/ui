class SearchAbortController {
  private requestList: AbortController[];

  constructor() {
    this.requestList = [];
  }

  public addController = (): AbortSignal => {
    // For AbortController see: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
    const controller = new window.AbortController();
    const signal = controller.signal;
    // Keep track of search requests.
    this.requestList.push(controller);
    return signal;
  };

  /**
   * Cancel all the requests which are in pending state.
   */
  public cancelAllSearchRequests = (): void => {
    this.requestList.forEach(request => request.abort());
    this.requestList = [];
  };
}

export default new SearchAbortController();
