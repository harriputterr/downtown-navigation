"use client";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import ChangeModelViewSettings from "./ChangeModelViewSettings";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const items = [
    {
        id: "wireframe",
        label: "Wireframe",
    },
    {
        id: "raycasting",
        label: "raycasting",
    },
    {
        id: "min-opacity",
        label: "min-opacity",
    },
    {
        id: "visibile",
        label: "visible",
    },
];

import ModelSelect from "./ModelSelect";

export function CheckboxReactHookFormMultiple({ map, tb }) {
    const [modelId, setModelId] = useState("");
    const [modelSettings, setModelSettings] = useState([]);
    const form = useForm({
        defaultValues: {
            items: [],
        },
    });
    ChangeModelViewSettings(modelId, modelSettings, map, tb);

    function onSubmit(data) {
        toast({
            title: "Selected Configuration",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                        {JSON.stringify(data.items, null, 2)}
                    </code>
                </pre>
            ),
        });
    }

    const handleModelChange = (value) => {
        setModelId(value);
        const selectedModel = modelSettings?.find(
            (model) => model.modelId === value
        );
        form.setValue("items", selectedModel ? selectedModel.settings : []);
    };

    const handleCheckboxChange = (checked, item, field) => {
        const newSettingsArray = checked
            ? [...field.value, item.id]
            : field.value.filter((value) => value !== item.id);

        setModelSettings((prev) => {
            const prevSettings = prev || [];
            const existingSetting = prevSettings.find(
                (setting) => setting.modelId === modelId
            );

            if (existingSetting) {
                return prevSettings.map((setting) =>
                    setting.modelId === modelId
                        ? { ...setting, settings: newSettingsArray }
                        : setting
                );
            } else {
                return [
                    ...prevSettings,
                    {
                        modelId: modelId,
                        settings: newSettingsArray,
                    },
                ];
            }
        });

        field.onChange(newSettingsArray);
    };

    const handleReset = () => {
        setModelSettings([]);
        setModelId("");
        form.reset({ items: [] });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="items"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="font-semibold text-lg">
                                    Model Settings
                                </FormLabel>
                                <FormDescription>
                                    Select the model settings you want to have.
                                </FormDescription>
                            </div>

                            <ModelSelect setModelId={handleModelChange} />

                            <div className="pt-2">
                                {modelId &&
                                    items.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="items"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex items-center gap-2 space-y-0">
                                                        <FormControl
                                                            id={item.id}>
                                                            <Checkbox
                                                                checked={field.value?.includes(
                                                                    item.id
                                                                )}
                                                                onCheckedChange={(
                                                                    checked
                                                                ) => {
                                                                    handleCheckboxChange(
                                                                        checked,
                                                                        item,
                                                                        field
                                                                    );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel
                                                            htmlFor={item.id}
                                                            className="text-sm font-normal">
                                                            {item.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="button"
                    onClick={handleReset}
                    variant={"destructive"}>
                    Reset All
                </Button>
            </form>
        </Form>
    );
}

export default function BuildingSettings({ map, tb }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    Configure Model Viewing Options
                </Button>
            </SheetTrigger>
            <SheetContent>
                <CheckboxReactHookFormMultiple map={map} tb={tb} />
            </SheetContent>
        </Sheet>
    );
}
