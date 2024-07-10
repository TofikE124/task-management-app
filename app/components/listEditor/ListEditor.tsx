import { motion, Reorder } from "framer-motion";
import { useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";
import { Button } from "../Button";
import ListEditorItem from "./ListEditorItem";

interface Props {
  title: string;
  addButtonTitle: string;
  itemPlaceholder: string;
  listName: string;
  fieldName: string;
}

const ListEditor = ({
  title,
  addButtonTitle,
  itemPlaceholder,
  listName,
  fieldName,
}: Props) => {
  const schema = z.object({
    [listName]: z.array(z.object({ [fieldName]: z.string() })),
  });
  type schemaType = z.infer<typeof schema>;
  const {
    watch,
    formState: { errors },
    control,
  } = useFormContext<schemaType>();

  const { append, remove, swap } = useFieldArray({
    control,
    name: listName as any, // Type assertion to any to bypass type check
  });

  const list = watch(listName, []);

  const handleAdd = () => {
    const id = v4();
    append({ id, value: "" }, { shouldFocus: false });
  };

  const removePlatform = (index: number) => {
    remove(index);
  };

  const handleReorder = (newList: any[]) => {
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

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col">
      <p className="text-medium-grey">{title}</p>
      <motion.div
        className={`pr-4 overflow-y-auto scrollbar-rounded max-h-[150px] transition-[height] duration-[350ms]`}
        style={{
          height: list.length * 50,
          overflowY: list.length <= 3 ? "hidden" : "scroll",
        }}
      >
        <Reorder.Group
          axis="y"
          values={list}
          onReorder={handleReorder}
          className="mt-2 space-y-3"
          ref={containerRef}
        >
          {list.map((item, index: number) => (
            <ListEditorItem
              key={item.id}
              listName={listName}
              fieldName={fieldName}
              index={index}
              item={item}
              onRemove={() => removePlatform(index)}
              ref={containerRef}
              errorMessage={
                ((errors[listName] || [])[index] || {})[fieldName]?.message
              }
              placeholder={itemPlaceholder}
            />
          ))}
        </Reorder.Group>
      </motion.div>

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
