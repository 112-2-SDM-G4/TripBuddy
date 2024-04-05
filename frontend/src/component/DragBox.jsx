import {
    DndContext,
    closestCenter,
    PointerSensor,
    TouchSensor,
    MouseSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SpotinEdit from "./SpotinEdit";
import { useEffect, useState } from "react";

function SortableItem(props) {
    const { id } = props;
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {props.children}
        </div>
    );
}

function DragBox({ spots, setSpots }) {
    const [items, setItems] = useState(spots.map((s) => s.spot_id));
    useEffect(() => {
        const idToObjMap = new Map(spots.map((obj) => [obj.spot_id, obj]));
        const sortedObjects = items.map((id) => idToObjMap.get(id));
        setSpots(sortedObjects);
        return () => {};
    }, [items]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(MouseSensor)
    );
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                {items.map((item, index) => (
                    <SortableItem key={item} id={item}>
                        <SpotinEdit
                            spot={spots.find((s) => s.spot_id === item)}
                        />
                    </SortableItem>
                ))}
            </SortableContext>
        </DndContext>
    );
}

export default DragBox;
