import { FC, useCallback, useState } from "react";
import { Select } from "@chakra-ui/react";

interface CetraNetworkSwitchProps {
    fontWeight?: string;
    fontSize?: string;
    w?: string;
    bgColor?: string;
    isDisabled?: boolean;
    onChange?: (index: number) => void;
}

const CetraNetworkSwitch: FC<CetraNetworkSwitchProps> = ({
    fontWeight,
    fontSize,
    w,
    bgColor,
    isDisabled,
    onChange,
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleOnChange = useCallback(
        (e: any) => {
            const index = e.target.selectedIndex;
            setSelectedIndex(index);
            onChange?.(index);
        },
        [onChange]
    );

    return (
        <Select
            bg={bgColor ?? "transparent"}
            color={selectedIndex === 1 ? "#8247E5" : "#FF4545"}
            fontFamily="Chakra Petch"
            fontWeight={fontWeight ?? "bold"}
            fontSize={fontSize ?? ["12px", "12px", "16px"]}
            w={w ?? "200px"}
            onChange={handleOnChange}
            border={
                selectedIndex === 1 ? "1px solid #8247E5" : "1px solid #FF4545"
            }
            _hover={{}}
            isDisabled={isDisabled}
            defaultValue={selectedIndex}
        >
            <option value="optimism">Optimism</option>
            <option value="polygon">Polygon</option>
        </Select>
    );
};

export { CetraNetworkSwitch, type CetraNetworkSwitchProps };
