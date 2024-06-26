import { Reorder } from "framer-motion";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 } from "uuid";
import { Schema, z, ZodArray } from "zod";
import Button from "../Button";
import ListEditorItem, { Item } from "./ListEditorItem";
import { listType } from "@/app/schemas/boardSchema";

interface Props {
  title: string;
  addButtonTitle: string;
}

const ListEditor = ({ title, addButtonTitle }: Props) => {
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

  return (
    <div className="flex flex-col">
      <p className="text-medium-grey">{title}</p>
      <Reorder.Group
        axis="y"
        values={list}
        onReorder={handleReorder}
        className="flex flex-col gap-3 mt-2"
      >
        {list.map((item: Item, index: number) => (
          <ListEditorItem
            key={item.id}
            item={item}
            onRemove={() => removePlatform(index)}
            errorMessage={(errors["list"] || [])[index]?.value?.message}
            {...register(`list.${index}.value`)}
          />
        ))}
      </Reorder.Group>

      <Button
        variant="secondary"
        size="sm"
        className="mt-3"
        onClick={handleAdd}
        type="button"
      >
        {addButtonTitle}
      </Button>
    </div>
  );
};

export default ListEditor;
