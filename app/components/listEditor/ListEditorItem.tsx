import { Reorder, useDragControls } from "framer-motion";
import Image from "next/image";
import Input from "../Input";

import Icon from "../Icon";
import crossIcon from "/public/images/icon-cross.svg";
import { useTheme } from "next-themes";
import { ChangeEvent, Component, forwardRef } from "react";

interface Props {
  item: Item;
  onRemove: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}

export interface Item {
  id: string;
  value: string;
}

const ListEditorItem = forwardRef(
  ({ item, onRemove, errorMessage, onChange, ...props }: Props, ref) => {
    const controls = useDragControls();

    const { resolvedTheme } = useTheme();

    return (
      <Reorder.Item dragListener={false} value={item} dragControls={controls}>
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
              ref={ref}
              onChange={onChange}
              {...props}
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
