import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Input } from '@/components/ui/input';
import debounce from 'lodash.debounce';

interface SearchLocationInputProps {
    setSelectedLocation: (latLng: { lat: number | undefined; lng: number | undefined }, display_name: string, zipCode: string) => void;
    initialValue?: string;
}

const SearchLocationInput: React.FC<SearchLocationInputProps> = ({ setSelectedLocation, initialValue = "" }) => {
    const [query, setQuery] = useState<string>(initialValue);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    const fetchSuggestions = async (value: string) => {
        if (value.length > 2) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                    params: {
                        q: value,
                        format: "json",
                        addressdetails: 1,
                        limit: 5,
                    },
                });
                setSuggestions(response.data);
            } catch (error) {
                console.error("Error fetching location suggestions:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        debouncedFetchSuggestions(value);
    };

    const handleSelectSuggestion = (suggestion: any) => {
        const { display_name, lat, lon, address } = suggestion;
        const zipCode = address?.postcode || '';

        if (!display_name) {
            setQuery('');
            setSuggestions([]);
            setSelectedLocation({ lat: undefined, lng: undefined }, '', '');
        } else {
            setQuery(display_name);
            setSuggestions([]);
            setSelectedLocation({ lat: parseFloat(lat), lng: parseFloat(lon) }, display_name, zipCode);
        }
    };

    useEffect(() => {
        return () => {
            debouncedFetchSuggestions.cancel();
        };
    }, [debouncedFetchSuggestions]);

    return (
        <div className="search-location-input">
            <Input
                className="form-control"
                onChange={handleInputChange}
                placeholder="Search Places ..."
                value={query}
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-list" style={styles.suggestionsList}>
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSelectSuggestion(suggestion)} style={styles.suggestionItem}>
                            {suggestion.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    suggestionsList: {
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#fff',
        listStyleType: 'none',
        padding: '8px',
        margin: '0',
        maxHeight: '150px',
        overflowY: 'auto' as React.CSSProperties['overflowY'],
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    suggestionItem: {
        padding: '8px',
        cursor: 'pointer',
    },
};

export default SearchLocationInput;
