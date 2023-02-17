import { FC, useCallback } from "react";
import { Button, SystemStyleObject } from "@chakra-ui/react";

interface CetraButtonProps {
    children: JSX.Element | string;
    fontWeight?: string;
    fontSize?: string;
    w?: string;
    h?: string;
    border?: string;
    borderColor?: string;
    bgColor?: string;
    color?: string;
    _hover?: SystemStyleObject;
    _active?: SystemStyleObject;
    isDisabled?: boolean;
    isLoading?: boolean;
    onClick?: () => void;
}

const CetraButton: FC<CetraButtonProps> = ({
    children,
    fontWeight,
    fontSize,
    w,
    h,
    border,
    borderColor,
    bgColor,
    color,
    _hover,
    _active,
    isDisabled,
    isLoading,
    onClick,
}) => {
    const handleOnClick = useCallback(() => {
        if (onClick) onClick();
    }, [onClick]);

    return (
        <Button
            bg={bgColor ?? "#7173FC"}
            color={color ?? "#FFFFFF"}
            fontFamily="Chakra Petch"
            fontWeight={fontWeight ?? "bold"}
            fontSize={fontSize ?? ["12px", "12px", "16px"]}
            onClick={handleOnClick}
            isDisabled={isDisabled}
            isLoading={isLoading}
            w={w ?? "full"}
            h={h ?? "full"}
            border={border}
            borderColor={borderColor}
            _hover={
                _hover ?? {
                    bg: "#FFFFFF",
                    color: "#7173FC",
                    border: "1px",
                    borderColor: "#7173FC",
                }
            }
            _active={
                _active ?? {
                    bg: "#FFFFFF",
                    color: "#7173FC",
                    border: "1px",
                    borderColor: "#7173FC",
                }
            }
        >
            {children}
        </Button>
    );
};

export { CetraButton, type CetraButtonProps };
