import React from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';

interface Option {
    value: number;
    label: string;
}

interface MultiSelectProps {
    msStyle: string;
    placeholder: string;
    options: Option[];
    selectedOptions: Option[];
    onChange: (newValue: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ msStyle, placeholder, options, selectedOptions, onChange }) => {
    return (
        <Select
            isMulti
            value={selectedOptions}
            onChange={onChange}
            options={options}
            className={msStyle}
            classNamePrefix="react-select"
            placeholder={placeholder}
            classNames={{
                menuList: () => "dark:bg-gray-800",
                multiValue: () => "dark:text-background",
                valueContainer: () => "dark:bg-gray-800",
                multiValueRemove: () => "dark:bg-foreground",
                multiValueLabel: () => "dark:bg-foreground",
                clearIndicator: () => "dark:bg-gray-800",
                dropdownIndicator: () => "dark:bg-gray-800",
                indicatorsContainer: () => "dark:bg-gray-800"
            }}
            styles={{
                control: provided => ({
                    ...provided,
                    color: 'black',
                }),
                input: provided => ({
                    ...provided,
                    color: 'var(--foreground)'
                }),
                multiValueLabel: provided => ({
                    ...provided,
                    color: 'oklch(0.145 0 0)',
                }),
            }}
        />
    );
};

export default MultiSelect;