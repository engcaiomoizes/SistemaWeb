import { Baixa } from "@/types/baixas";
import React from "react";
import Select, { ActionMeta, SingleValue } from "react-select";

interface Option {
    value: string;
    label: string;
}

interface SearchSelectProps {
    msStyle: string;
    placeholder: string;
    options: Option[];
    selectedOption: Option | undefined;
    onChange: (newValue: SingleValue<Option>, actionMeta: ActionMeta<Option>) => void;
}

const SearchSelect: React.FC<SearchSelectProps> = ({ msStyle, placeholder, options, selectedOption, onChange }) => {
    return (
        <Select
            value={selectedOption}
            options={options}
            onChange={onChange}
            placeholder={placeholder}
            className={msStyle}
            classNamePrefix="react-select"
        />
    );
}

export default SearchSelect;