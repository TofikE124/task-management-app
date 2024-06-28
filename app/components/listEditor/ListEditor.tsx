import { Reorder } from "framer-motion";
import { useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";
import { Button } from "../Button";
import ListEditorItem, { Item } from "./ListEditorItem";
import { listType } from "@/app/schemas/listType";

interface Props {
  title: string;
  addButtonTitle: string;
  itemPlaceholder: string;
}

const ListEditor = ({ title, addButtonTitle, itemPlaceholder }: Props) => {
  const schema = z.object({
    list: listType,
  });
  type schemaType = z.infer<typeof schema>;
  const {
    register,
    watch,
    formState: { errors },
    control,
  } = useFormContext<schemaType>();

  const { append, remove, swap } = useFieldArray({
    control,
    name: "list" as any, // Type assertion to any to bypass type check
  });

  const list = watch("list", []);

  const handleAdd = () => {
    const id = v4();
    append({ id, value: "" }, { shouldFocus: false });
  };

  const removePlatform = (index: number) => {
    remove(index);
  };

  const handleReorder = (newList: Item[]) => {
    const { indexA, indexB } = getSwapIndex(list, newList);
    swap(indexA, indexB);
  };

  // Get swap index for reordering function
  const getSwapIndex = (oldArr: any[], newArr: any[]) => {
    let indexA = 0,
      indexB = 0;
    for (let i = 0; i < oldArr.length; i++) {
      if (oldArr[i] !== newArr[i]) {
        indexA = i;
        indexB = oldArr.indexOf(newArr[indexA]);
      }
    }
    return { indexA, indexB };
  };

  const containerRef = useRef(null);

  return (
    <div className="flex flex-col">
      <p className="text-medium-grey">{title}</p>
      <div
        className={`${
          false ? "overflow-y-hidden" : "overflow-y-auto"
        } max-h-[150px] scrollbar-rounded pr-4`}
        ref={containerRef}
      >
        <Reorder.Group
          axis="y"
          values={list}
          onReorder={handleReorder}
          className="mt-2 space-y-3"
        >
          {list.map((item: Item, index: number) => (
            <ListEditorItem
              key={item.id}
              index={index}
              item={item}
              onRemove={() => removePlatform(index)}
              ref={containerRef}
              errorMessage={(errors["list"] || [])[index]?.value?.message}
              placeholder={itemPlaceholder}
            />
          ))}
        </Reorder.Group>
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={handleAdd}
        type="button"
        className="mt-3"
      >
        {addButtonTitle}
      </Button>
    </div>
  );
};

export default ListEditor;
