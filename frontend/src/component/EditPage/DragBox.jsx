import React from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
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
import EditViewSpot from "./EditViewSpot";

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

function DragBox({ spots, onItemsReordered, updateSpotData, locked = false }) {
    const [items, setItems] = useState(spots.map((s) => s.relation_id));
    const [openSpot, setOpenSpot] = useState(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 25, // 以像素为单位的距离
            },
        })
    );
    useEffect(() => {
        setItems(spots.map((s) => s.relation_id));
    }, [spots]);

    const delSpot = (id) => {
        setItems((items) => {
            const newItems = items.filter((i) => i !== id);
            onItemsReordered(newItems);
            return newItems;
        });
    };
    const handleDragEnd = (event) => {
        if (locked) return;
        const { active, over } = event;
        if (active !== null && over !== null && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                onItemsReordered(newItems);
                return newItems;
            });
        }
    };

    return (
        <>
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
                                spot={spots.find((s) => s.relation_id === item)}
                                delSpot={() => {
                                    delSpot(item);
                                }}
                                setOpenedSpot={setOpenSpot}
                                locked={locked}
                            />
                        </SortableItem>
                    ))}
                </SortableContext>
            </DndContext>
            {openSpot && (
                <EditViewSpot
                    spot={openSpot}
                    onClose={() => setOpenSpot(null)}
                    updateSpotData={updateSpotData}
                    locked={locked}
                />
            )}
        </>
    );
}

export default DragBox;
