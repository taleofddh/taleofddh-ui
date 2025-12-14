import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useRef } from 'react';

function AutocompleteInput({
    // TypeInput props
    id, 
    name, 
    className = '', 
    countryCode, 
    disabled, 
    initialValue = '', 
    label = '', 
    value, 
    max, 
    maxLength, 
    min, 
    note, 
    onChange = event => {},
    onKeyDown, 
    onSelect,
    pattern, 
    placeHolder = '', 
    ref, 
    required = true, 
    size = 50, 
    type, 
    inputMode, 
    title = 'Please match the requested format',
    
    // AutocompleteInput specific props
    suggestions = [],
    debounceMs = 300,
    maxSuggestions = 5,
    minCharacters = 3,
    onSuggestionSelect = (suggestion, index) => {},
    filterFunction = null
}) {
    // TypeInput state (following same patterns)
    const [focused, setFocused] = useState(false);
    const [keyDown, setKeyDown] = useState(true);
    
    // AutocompleteInput specific state
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    
    // Refs for managing focus and dropdown
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Core filtering functionality with enhanced error handling
    const filterSuggestions = useCallback((query, suggestionArray, maxResults = 5) => {
        try {
            // Handle empty/undefined suggestions arrays gracefully (Requirement 6.1)
            if (!suggestionArray || !Array.isArray(suggestionArray) || suggestionArray.length === 0) {
                return [];
            }

            // Handle empty query
            if (!query || typeof query !== 'string') {
                return [];
            }

            // Implement case-insensitive matching with toLowerCase()
            const lowerQuery = query.toLowerCase();
            const filtered = [];

            // Use includes() method for performance and limit results to maximum
            for (let i = 0; i < suggestionArray.length && filtered.length < maxResults; i++) {
                const suggestion = suggestionArray[i];
                
                // Handle malformed suggestion data gracefully (Requirement 6.2)
                if (suggestion === null || suggestion === undefined) {
                    console.warn(`AutocompleteInput: Skipping null/undefined suggestion at index ${i}`);
                    continue;
                }
                
                // Convert non-string suggestions to strings and warn
                let suggestionStr;
                if (typeof suggestion === 'string') {
                    suggestionStr = suggestion;
                } else {
                    console.warn(`AutocompleteInput: Converting non-string suggestion to string:`, suggestion);
                    try {
                        suggestionStr = String(suggestion);
                    } catch (conversionError) {
                        console.warn(`AutocompleteInput: Failed to convert suggestion to string, skipping:`, suggestion, conversionError);
                        continue;
                    }
                }
                
                // Handle special characters safely (Requirement 6.2)
                try {
                    if (suggestionStr.toLowerCase().includes(lowerQuery)) {
                        filtered.push(suggestionStr);
                    }
                } catch (matchError) {
                    console.warn(`AutocompleteInput: Error matching suggestion "${suggestionStr}":`, matchError);
                    continue;
                }
            }

            return filtered;
        } catch (error) {
            console.error('AutocompleteInput: Critical error in filterSuggestions:', error);
            // Return empty array as fallback to prevent component crash
            return [];
        }
    }, []);

    // Custom filter function or default includes-based filtering with enhanced error handling
    const getFilteredSuggestions = useCallback((query) => {
        try {
            if (filterFunction && typeof filterFunction === 'function') {
                try {
                    const result = filterFunction(query, suggestions, maxSuggestions);
                    
                    // Validate filter function result
                    if (!Array.isArray(result)) {
                        console.warn('AutocompleteInput: Custom filter function returned non-array, falling back to default:', result);
                        return filterSuggestions(query, suggestions, maxSuggestions);
                    }
                    
                    return result;
                } catch (error) {
                    console.warn('AutocompleteInput: Custom filter function failed, falling back to default:', error);
                    return filterSuggestions(query, suggestions, maxSuggestions);
                }
            }
            return filterSuggestions(query, suggestions, maxSuggestions);
        } catch (error) {
            console.error('AutocompleteInput: Critical error in getFilteredSuggestions:', error);
            // Return empty array as fallback to prevent component crash
            return [];
        }
    }, [filterFunction, suggestions, maxSuggestions, filterSuggestions]);

    // Debouncing effect for filtering with error handling
    useEffect(() => {
        try {
            const timeoutId = setTimeout(() => {
                setDebouncedQuery(value || '');
            }, debounceMs);

            return () => {
                try {
                    clearTimeout(timeoutId);
                } catch (error) {
                    console.warn('AutocompleteInput: Error clearing debounce timeout:', error);
                }
            };
        } catch (error) {
            console.error('AutocompleteInput: Error setting up debounce effect:', error);
            // Fallback to immediate update if debouncing fails
            setDebouncedQuery(value || '');
        }
    }, [value, debounceMs]);

    // Centralized function to update suggestions based on threshold with error handling
    const updateSuggestions = useCallback((query) => {
        try {
            // Check minimum character threshold
            if (!query || query.length < minCharacters) {
                setFilteredSuggestions([]);
                setShowSuggestions(false);
                setSelectedIndex(-1);
                return;
            }

            // Get filtered suggestions
            const filtered = getFilteredSuggestions(query);
            setFilteredSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
            setSelectedIndex(-1);
        } catch (error) {
            console.error('AutocompleteInput: Error updating suggestions:', error);
            // Reset to safe state on error
            setFilteredSuggestions([]);
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }
    }, [minCharacters, getFilteredSuggestions]);

    // Effect to handle debounced filtering
    useEffect(() => {
        updateSuggestions(debouncedQuery);
    }, [debouncedQuery, updateSuggestions]);

    // Suggestion selection handler with error handling
    const handleSuggestionClick = useCallback((suggestion, index) => {
        try {
            // Create synthetic event for onChange compatibility
            const syntheticEvent = {
                target: {
                    name: name,
                    value: suggestion
                }
            };
            
            // Call original onChange handler with selected value
            try {
                onChange && onChange(syntheticEvent);
            } catch (error) {
                console.warn('AutocompleteInput: Error in onChange callback:', error);
            }
            
            // Call suggestion-specific callback
            try {
                onSuggestionSelect && onSuggestionSelect(suggestion, index);
            } catch (error) {
                console.warn('AutocompleteInput: Error in onSuggestionSelect callback:', error);
            }
            
            // Ensure dropdown closes after selection (Requirement 2.2)
            setShowSuggestions(false);
            setSelectedIndex(-1);
            setFilteredSuggestions([]);
            
            // Focus back to input to maintain user experience with fallback
            try {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            } catch (error) {
                console.warn('AutocompleteInput: Error focusing input after selection:', error);
            }
        } catch (error) {
            console.error('AutocompleteInput: Critical error in handleSuggestionClick:', error);
            // Reset to safe state on critical error
            setShowSuggestions(false);
            setSelectedIndex(-1);
            setFilteredSuggestions([]);
        }
    }, [name, onChange, onSuggestionSelect]);

    // Handle mouse enter for hover effects
    const handleSuggestionMouseEnter = useCallback((index) => {
        setSelectedIndex(index);
    }, []);

    // Handle mouse leave to clear hover state only if not using keyboard navigation
    const handleSuggestionMouseLeave = useCallback(() => {
        // Don't clear selection on mouse leave to allow keyboard navigation to persist
        // Selection will be cleared when dropdown closes or new selection is made
    }, []);

    // Click outside handler to close dropdown with error handling
    const handleClickOutside = useCallback((event) => {
        try {
            // Safely check if event and target exist
            if (!event || !event.target) {
                return;
            }
            
            // Check if click is outside both the input and dropdown with safe DOM access
            let isOutsideInput = true;
            let isOutsideDropdown = true;
            
            try {
                isOutsideInput = inputRef.current && !inputRef.current.contains(event.target);
            } catch (error) {
                console.warn('AutocompleteInput: Error checking input containment:', error);
                isOutsideInput = true; // Assume outside on error for safety
            }
            
            try {
                isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
            } catch (error) {
                console.warn('AutocompleteInput: Error checking dropdown containment:', error);
                isOutsideDropdown = true; // Assume outside on error for safety
            }
            
            if (isOutsideInput && isOutsideDropdown) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
                setFilteredSuggestions([]);
            }
        } catch (error) {
            console.error('AutocompleteInput: Critical error in handleClickOutside:', error);
            // Close dropdown on any critical error for safety
            setShowSuggestions(false);
            setSelectedIndex(-1);
            setFilteredSuggestions([]);
        }
    }, []);

    // Effect to handle click outside with proper cleanup (Requirement 6.5)
    useEffect(() => {
        if (showSuggestions) {
            try {
                document.addEventListener('mousedown', handleClickOutside);
                return () => {
                    try {
                        document.removeEventListener('mousedown', handleClickOutside);
                    } catch (error) {
                        console.warn('AutocompleteInput: Error removing click outside listener:', error);
                    }
                };
            } catch (error) {
                console.error('AutocompleteInput: Error adding click outside listener:', error);
                // Return cleanup function even if adding listener failed
                return () => {
                    try {
                        document.removeEventListener('mousedown', handleClickOutside);
                    } catch (cleanupError) {
                        console.warn('AutocompleteInput: Error in cleanup after failed listener setup:', cleanupError);
                    }
                };
            }
        }
    }, [showSuggestions, handleClickOutside]);

    // TypeInput event handlers (following same patterns) with error handling
    const onBlur = () => {
        try {
            setFocused(false);
            // Small delay to allow click events on suggestions to fire first
            // This prevents the dropdown from closing before click events can be processed
            setTimeout(() => {
                try {
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                } catch (error) {
                    console.warn('AutocompleteInput: Error in blur timeout:', error);
                }
            }, 150);
        } catch (error) {
            console.error('AutocompleteInput: Error in onBlur handler:', error);
            // Ensure dropdown is closed even if error occurs
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }
    }

    const onFocus = () => {
        try {
            setFocused(true);
            // Re-show suggestions if input has enough characters and suggestions exist
            if (value && value.length >= minCharacters && suggestions.length > 0) {
                updateSuggestions(value);
            }
        } catch (error) {
            console.error('AutocompleteInput: Error in onFocus handler:', error);
            // Ensure focused state is set even if error occurs
            setFocused(true);
        }
    }

    const onKeyedDown = (e) => {
        try {
            if(e.target.type === 'number') {
                setKeyDown(false);
            }
            
            // Handle keyboard navigation when suggestions are visible
            if (showSuggestions && filteredSuggestions.length > 0) {
                switch (e.key) {
                    case 'ArrowDown':
                        try {
                            e.preventDefault();
                            setSelectedIndex(prevIndex => {
                                // Wrap to first suggestion if at the end
                                return prevIndex >= filteredSuggestions.length - 1 ? 0 : prevIndex + 1;
                            });
                        } catch (error) {
                            console.warn('AutocompleteInput: Error handling ArrowDown:', error);
                        }
                        break;
                        
                    case 'ArrowUp':
                        try {
                            e.preventDefault();
                            setSelectedIndex(prevIndex => {
                                // Wrap to last suggestion if at the beginning
                                return prevIndex <= 0 ? filteredSuggestions.length - 1 : prevIndex - 1;
                            });
                        } catch (error) {
                            console.warn('AutocompleteInput: Error handling ArrowUp:', error);
                        }
                        break;
                        
                    case 'Enter':
                        try {
                            e.preventDefault();
                            // Select highlighted suggestion if one is selected
                            if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
                                const selectedSuggestion = filteredSuggestions[selectedIndex];
                                handleSuggestionClick(selectedSuggestion, selectedIndex);
                            }
                        } catch (error) {
                            console.warn('AutocompleteInput: Error handling Enter key:', error);
                        }
                        break;
                        
                    case 'Escape':
                        try {
                            e.preventDefault();
                            // Close dropdown and clear selection
                            setShowSuggestions(false);
                            setSelectedIndex(-1);
                            setFilteredSuggestions([]);
                            // Return focus to input field with fallback behavior
                            if (inputRef.current) {
                                inputRef.current.focus();
                            }
                        } catch (error) {
                            console.warn('AutocompleteInput: Error handling Escape key:', error);
                            // Ensure dropdown is closed even if focus fails
                            setShowSuggestions(false);
                            setSelectedIndex(-1);
                            setFilteredSuggestions([]);
                        }
                        break;
                        
                    case 'Tab':
                        try {
                            // Close dropdown on Tab but allow default tab behavior
                            setShowSuggestions(false);
                            setSelectedIndex(-1);
                        } catch (error) {
                            console.warn('AutocompleteInput: Error handling Tab key:', error);
                        }
                        break;
                        
                    default:
                        // For other keys, let them through normally
                        break;
                }
            } else if (e.key === 'Escape') {
                try {
                    // Handle Escape key even when dropdown is not visible
                    // This ensures consistent behavior regardless of dropdown state
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                    setFilteredSuggestions([]);
                    e.preventDefault();
                } catch (error) {
                    console.warn('AutocompleteInput: Error handling Escape key when dropdown closed:', error);
                }
            }
            
            // Call original onKeyDown if provided with error handling
            try {
                if (onKeyDown) {
                    onKeyDown(e);
                }
            } catch (error) {
                console.warn('AutocompleteInput: Error in external onKeyDown callback:', error);
            }
        } catch (error) {
            console.error('AutocompleteInput: Critical error in onKeyedDown handler:', error);
            // Reset to safe state on critical error
            setShowSuggestions(false);
            setSelectedIndex(-1);
            setFilteredSuggestions([]);
        }
    }

    const handleChange = (event) => {
        try {
            const inputValue = event.target.value;
            
            // Call original onChange handler with error handling
            try {
                onChange && onChange(event);
            } catch (error) {
                console.warn('AutocompleteInput: Error in external onChange callback:', error);
            }
            
            // Update suggestions based on minimum character threshold
            // Note: This provides immediate feedback while debounced version handles performance
            updateSuggestions(inputValue);
        } catch (error) {
            console.error('AutocompleteInput: Critical error in handleChange:', error);
            // Reset suggestions on critical error
            setFilteredSuggestions([]);
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }
    }

    // Required text logic (following TypeInput pattern)
    let reqdText;
    if(required) {
        reqdText = '*';
    } else {
        reqdText = '';
    }

    // Note text logic (following TypeInput pattern)
    let noteText;
    if(note) {
        noteText = <label className="inputnote">{'(' + note + ')'}</label>;
    } else {
        noteText = <></>
    }

    return (
        <div className={`autocomplete-container ${className}`}>
            <p className={`type ${className}`}>
                <label>
                    {label}
                    <span className="required"> {reqdText}</span>
                </label>
                {noteText}
                <input
                    type={type}
                    inputMode={inputMode}
                    id={id}
                    name={name}
                    ref={inputRef}
                    placeholder={placeHolder}
                    min={min}
                    max={max}
                    maxLength={maxLength}
                    disabled={disabled}
                    required={required}
                    value={value}
                    pattern={pattern}
                    title={title}
                    size={size}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onKeyDown={onKeyedDown}
                    onChange={handleChange}
                    // Enhanced accessibility attributes with fallbacks
                    role="combobox"
                    aria-expanded={showSuggestions}
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                    aria-activedescendant={selectedIndex >= 0 ? `${id}-suggestion-${selectedIndex}` : undefined}
                    autoComplete="off"
                />
            </p>
            
            {/* Suggestion dropdown with click handlers, hover effects, and accessibility fallbacks */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div 
                    ref={dropdownRef} 
                    className="autocomplete-dropdown"
                    role="listbox"
                    aria-label="Autocomplete suggestions"
                >
                    {filteredSuggestions.map((suggestion, index) => {
                        try {
                            return (
                                <div 
                                    key={index} 
                                    id={`${id}-suggestion-${index}`}
                                    className={`autocomplete-suggestion ${index === selectedIndex ? 'highlighted' : ''}`}
                                    onClick={() => handleSuggestionClick(suggestion, index)}
                                    onMouseEnter={() => handleSuggestionMouseEnter(index)}
                                    onMouseLeave={handleSuggestionMouseLeave}
                                    role="option"
                                    aria-selected={index === selectedIndex}
                                    tabIndex={-1}
                                    // Fallback accessibility attributes
                                    data-suggestion-index={index}
                                    data-suggestion-value={suggestion}
                                >
                                    {suggestion}
                                </div>
                            );
                        } catch (error) {
                            console.warn(`AutocompleteInput: Error rendering suggestion at index ${index}:`, error);
                            // Return a safe fallback element
                            return (
                                <div 
                                    key={index} 
                                    className="autocomplete-suggestion error"
                                    role="option"
                                    aria-selected={false}
                                    tabIndex={-1}
                                >
                                    [Error rendering suggestion]
                                </div>
                            );
                        }
                    })}
                </div>
            )}
        </div>
    )
}

AutocompleteInput.propTypes = {
    // TypeInput props
    type: PropTypes.string,
    inputMode: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    ref: PropTypes.string,
    label: PropTypes.string,
    note: PropTypes.string,
    placeHolder: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    maxLength: PropTypes.number,
    initialValue: PropTypes.string,
    value: PropTypes.string,
    pattern: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onSelect: PropTypes.func,
    countryCode: PropTypes.string,
    
    // AutocompleteInput specific props with enhanced validation
    suggestions: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object // Allow objects that can be converted to strings
    ])),
    debounceMs: function(props, propName, componentName) {
        const value = props[propName];
        if (value !== undefined && (typeof value !== 'number' || value < 0)) {
            return new Error(`Invalid prop \`${propName}\` of value \`${value}\` supplied to \`${componentName}\`, expected a non-negative number.`);
        }
    },
    maxSuggestions: function(props, propName, componentName) {
        const value = props[propName];
        if (value !== undefined && (typeof value !== 'number' || value < 1)) {
            return new Error(`Invalid prop \`${propName}\` of value \`${value}\` supplied to \`${componentName}\`, expected a positive number.`);
        }
    },
    minCharacters: function(props, propName, componentName) {
        const value = props[propName];
        if (value !== undefined && (typeof value !== 'number' || value < 0)) {
            return new Error(`Invalid prop \`${propName}\` of value \`${value}\` supplied to \`${componentName}\`, expected a non-negative number.`);
        }
    },
    onSuggestionSelect: PropTypes.func,
    filterFunction: PropTypes.func
};

export default AutocompleteInput;