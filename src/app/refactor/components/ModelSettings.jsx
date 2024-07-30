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
  const [modelSettings, setModelSettings] = useState();
  console.log("This is the model Settings", modelSettings);
  const form = useForm({
    defaultValues: {
      items: [],
    },
  });

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Model Settings</FormLabel>
                <FormDescription>
                  Select the model settings you want to have.
                </FormDescription>
                <ModelSelect setModelId={setModelId} />
              </div>

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
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                console.log("THis is the field + current selection", [...field.value, item.id])
                                const newModelSettings = JSON.parse(
                                  JSON.stringify(modelSettings || {})
                                );
                                //   ChangeModelViewSettings(modelSettings, map, tb)

                                if (checked) {
                                  const newSettingsArray = [
                                    ...(newModelSettings.settings || []),
                                    item.id,
                                  ];

                                  newModelSettings.settings = newSettingsArray;

                                  // setModelSettings((prev) => [
                                  //   ...(prev || []),
                                  //   {
                                  //     modelId: modelId,
                                  //     settings: newSettingsArray,
                                  //   },
                                  // ]);

                                  setModelSettings((prev) => {
                                    const prevSettings = prev || [];
                                    const existingSetting = prevSettings.find(
                                      (setting) => setting.modelId === modelId
                                    );

                                    if (existingSetting) {
                                      console.log("modelId exist")
                                      return prevSettings.map((setting) =>
                                        setting.modelId === modelId
                                          ? {
                                              ...setting,
                                              settings: newSettingsArray,
                                            }
                                          : setting
                                      );
                                    } else {
                                      // If the modelId does not exist, add a new object
                                      console.log("modelId does not exist")
                                      return [
                                        ...prevSettings,
                                        {
                                          modelId: modelId,
                                          settings: newSettingsArray,
                                        },
                                      ];
                                    }
                                  });

                                  field.onChange(newModelSettings.settings);
                                } else {
                                  //   // from the previous settings array.
                                  //   // filter out the item.id that has been unchecked
                                  //   // and update it using setModelSettings
                                  //   // as well as in field.onChange()
                                  //   const newSettingsArray = newModelSettings.settings?.filter(
                                  //     (value) => value !== item.id
                                  //   )
                                  //   setModelSettings()
                                  //   field.onChange(newSettingsArray);
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default function BuildingSettings({ map, tb }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Configure Model Viewing Options</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Model Settings</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <CheckboxReactHookFormMultiple map={map} tb={tb} />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
