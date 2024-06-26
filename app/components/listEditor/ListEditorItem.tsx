import { motion, Reorder, useDragControls } from "framer-motion";
import Image from "next/image";
import Input from "../Input";

import Icon from "../Icon";
import crossIcon from "/public/images/icon-cross.svg";
import { useTheme } from "next-themes";
import { ChangeEvent, Component, forwardRef, RefObject } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  item: Item;
  index: number;
  onRemove: () => void;
  errorMessage?: string;
}

export interface Item {
  id: string;
  value: string;
}

const ListEditorItem = forwardRef(
  ({ item, onRemove, errorMessage, index }: Props, ref) => {
    const controls = useDragControls();

    const { register } = useFormContext();

    const { resolvedTheme } = useTheme();

    return (
      <Reorder.Item
        dragListener={false}
        value={item}
        dragControls={controls}
        dragConstraints={ref as RefObject<HTMLDivElement>}
        initial={{ opacity: 0, scale: 0.5, visibility: "hidden" }}
        animate={{ opacity: 1, scale: 1, y: 0, visibility: "visible" }}
        exit={{ opacity: 0, y: 50, visibility: "hidden", height: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 select-none">
          <div
            onPointerDown={(e) => controls.start(e)}
            className="cursor-pointer"
          >
            <Icon
              width={20}
              height={20}
              src="/images/icon-menu.svg"
              color={resolvedTheme == "dark" ? "#fff" : "#828FA3"}
            ></Icon>
          </div>

          <div className="flex items-center gap-4 w-full">
            <Input
              placeholder="e.g Make coffee"
              errorMessage={errorMessage}
              {...register(`list.${index}.value`)}
            ></Input>
            <div className="cursor-pointer select-none" onClick={onRemove}>
              <Image
                width={16}
                height={16}
                src={crossIcon}
                alt="Cross Icon"
              ></Image>
            </div>
          </div>
        </div>
      </Reorder.Item>
    );
  }
);

export default ListEditorItem;
