import React, { KeyboardEvent, useState, useEffect, useRef } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { css } from 'emotion';

import { default as IconSearch } from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import debounce from 'lodash/debounce';

import AutoComplete from '../AutoComplete';
import colors from '../../utils/styles/colors';
import { callSearch } from '../../utils/calls';
import { useLoadAndError } from './useLoadAndError';

export interface State {
  search: string;
  suggestions: unknown[];
  loading: boolean;
  loaded: boolean;
  error: boolean;
}

const CONSTANTS = {
  API_DELAY: 300,
  PLACEHOLDER_TEXT: 'Search Packages',
  ABORT_ERROR: 'AbortError',
};

export const SearchComponent = (props: RouteComponentProps<{}>): React.ReactElement => {
  const [search, setSearch] = useState<string>('');
  const [suggestions, setSuggestions] = useState<unknown[]>([]);
  const [loading, loaded, error, setLoadAndError] = useLoadAndError();
  const requestList = useRef<AbortController[]>([]);

  const cancelAllSearchRequests = (): void => {
    requestList.current.forEach(request => request.abort());
    requestList.current = [];
  };

  useEffect(() => {
    /**
     * A use case where User keeps adding and removing value in input field,
     * so we cancel all the existing requests when input is empty.
     */
    if (search.length === 0) {
      cancelAllSearchRequests();
    }
  }, [search]);
  /**
   * Cancel all the request from list and make request list empty.
   */
  const handlePackagesClearRequested = (): void => {
    setSuggestions([]);
  };

  /**
   * onChange method for the input element.
   */
  const handleSearch = (event: KeyboardEvent<HTMLInputElement>, { newValue, method }: { newValue: string; method: string }): void => {
    // stops event bubbling
    event.stopPropagation();
    if (method === 'type') {
      const value = newValue.trim();
      setSearch(value);
      setLoadAndError(true, false, false);
    }
  };

  /**
   * When an user select any package by clicking or pressing return key.
   */
  const handleClickSearch = (
    event: React.KeyboardEvent<HTMLInputElement>,
    { suggestionValue, method }: { suggestionValue: string[]; method: string }
  ): void => {
    const { history } = props;
    // stops event bubbling
    event.stopPropagation();
    switch (method) {
      case 'click':
      case 'enter':
        setSearch('');
        history.push(`/-/web/detail/${suggestionValue}`);
        break;
    }
  };

  /**
   * Fetch packages from API.
   */
  const handleFetchPackages = async ({ value }: { value: string }): Promise<void> => {
    try {
      // NOTE: For AbortController see: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
      const controller = new window.AbortController();
      const signal = controller.signal;
      // Keep track of search requests.
      requestList.current.push(controller);
      const suggestions = await callSearch(value, signal);
      // @ts-ignore
      setSuggestions(suggestions);
      setLoadAndError(false, true, false);
    } catch (error) {
      /**
       * AbortError is not the API error.
       * It means browser has cancelled the API request.
       */
      if (error.name === CONSTANTS.ABORT_ERROR) {
        setLoadAndError(false, false, false);
      } else {
        setLoadAndError(false, false, true);
      }
    }
  };

  const getAdorment = (): React.ReactElement => (
    <InputAdornment
      className={css`
        color: ${colors.white};
      `}
      position={'start'}>
      <IconSearch />
    </InputAdornment>
  );
  /**
   * As user focuses out from input, we cancel all the request from requestList
   * and set the API state parameters to default boolean values.
   */
  const handleOnBlur = (event: KeyboardEvent<HTMLInputElement>): void => {
    // stops event bubbling
    event.stopPropagation();
    setLoadAndError(false, false, false);
    cancelAllSearchRequests();
  };

  return (
    <AutoComplete
      color={colors.white}
      onBlur={handleOnBlur}
      onChange={handleSearch}
      onCleanSuggestions={handlePackagesClearRequested}
      onClick={handleClickSearch}
      onSuggestionsFetch={debounce(handleFetchPackages, CONSTANTS.API_DELAY)}
      placeholder={CONSTANTS.PLACEHOLDER_TEXT}
      startAdornment={getAdorment()}
      suggestions={suggestions}
      suggestionsError={error}
      suggestionsLoaded={loaded}
      suggestionsLoading={loading}
      value={search}
    />
  );
};

export default withRouter(SearchComponent);
